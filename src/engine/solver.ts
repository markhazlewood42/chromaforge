import { hexToLab, rgbToLab, deltaE2000 } from './color'
import { hexToSpectrum, spectrumToHex, mixSpectra, type PigmentSpectrum } from './kubelkaMunk'
import { tintingStrengthWeight, type OwnedPaint } from './pigment'
import { linearToRgb } from './color'

export type RecipeComponent = { paintId: string; label: string; ratio: number } // ratio 0-1, sums to 1
export type RecipeCandidate = {
  components: RecipeComponent[]
  predictedHex: string
  deltaE: number
}

export type SolveOptions = {
  maxPaints?: number // default 3
  candidateCount?: number // how many ranked results to return, default 3
  noMatchThreshold?: number // deltaE above which we say "no close match", default 15
}

function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) return [[]]
  if (items.length < size) return []
  const [first, ...rest] = items
  const withFirst = combinations(rest, size - 1).map((combo) => [first, ...combo])
  const withoutFirst = combinations(rest, size)
  return [...withFirst, ...withoutFirst]
}

function ratioGrid(count: number, step: number): number[][] {
  // All combinations of `count` non-negative multiples of `step` that sum to 1.
  const steps = Math.round(1 / step)
  const results: number[][] = []

  function recurse(remainingSlots: number, remainingSteps: number, current: number[]) {
    if (remainingSlots === 1) {
      results.push([...current, remainingSteps * step])
      return
    }
    for (let i = 0; i <= remainingSteps; i++) {
      recurse(remainingSlots - 1, remainingSteps - i, [...current, i * step])
    }
  }

  recurse(count, steps, [])
  return results
}

function evaluateCombo(
  combo: OwnedPaint[],
  spectra: Map<string, PigmentSpectrum>,
  targetLab: ReturnType<typeof hexToLab>,
  ratios: number[],
): RecipeCandidate {
  const weighted = combo.map((paint, i) => ({
    spectrum: spectra.get(paint.id)!,
    weight: ratios[i] * tintingStrengthWeight(paint.tintingStrength),
  }))
  const nonZero = weighted.filter((w) => w.weight > 0)
  const mixed = mixSpectra(nonZero.length > 0 ? nonZero : weighted)
  const predictedHex = spectrumToHex(mixed)
  const predictedLab = rgbToLab(linearToRgb(mixed))
  const deltaE = deltaE2000(targetLab, predictedLab)

  return {
    components: combo
      .map((paint, i) => ({ paintId: paint.id, label: paint.label, ratio: ratios[i] }))
      .filter((c) => c.ratio > 0),
    predictedHex,
    deltaE,
  }
}

/**
 * Search combinations of up to `maxPaints` owned paints for the recipe that best matches
 * `targetHex`, ranked by CIEDE2000. Coarse grid search over the ratio simplex per combo.
 */
export function solveMix(targetHex: string, ownedPaints: OwnedPaint[], options: SolveOptions = {}): RecipeCandidate[] {
  const maxPaints = options.maxPaints ?? 3
  const candidateCount = options.candidateCount ?? 3
  const targetLab = hexToLab(targetHex)

  const spectra = new Map(ownedPaints.map((p) => [p.id, hexToSpectrum(p.masstoneHex)]))

  const allCandidates: RecipeCandidate[] = []

  for (let size = 1; size <= Math.min(maxPaints, ownedPaints.length); size++) {
    // Coarser grid for larger combos to keep the search tractable.
    const step = size === 1 ? 1 : size === 2 ? 0.05 : 0.1
    const grids = size === 1 ? [[1]] : ratioGrid(size, step)

    for (const combo of combinations(ownedPaints, size)) {
      let best: RecipeCandidate | null = null
      for (const ratios of grids) {
        if (ratios.every((r) => r === 0)) continue
        const candidate = evaluateCombo(combo, spectra, targetLab, ratios)
        if (!best || candidate.deltaE < best.deltaE) best = candidate
      }
      if (best) allCandidates.push(best)
    }
  }

  allCandidates.sort((a, b) => a.deltaE - b.deltaE)

  // De-duplicate by paint-set so results aren't dominated by near-identical ratios of the same paints.
  const seen = new Set<string>()
  const ranked: RecipeCandidate[] = []
  for (const candidate of allCandidates) {
    const key = candidate.components
      .map((c) => c.paintId)
      .sort()
      .join(',')
    if (seen.has(key)) continue
    seen.add(key)
    ranked.push(candidate)
    if (ranked.length >= candidateCount) break
  }

  return ranked
}

export function isNoMatch(candidate: RecipeCandidate, threshold = 15): boolean {
  return candidate.deltaE > threshold
}
