// Kubelka-Munk pigment mixing, applied per RGB channel.
//
// Full spectral (multi-wavelength) K-M mixing is more accurate but requires reconstructing a
// reflectance curve from each pigment's published RGB swatch (e.g. via Smits/Burns-style basis
// spectra). That's a documented future upgrade (see src/engine/pigments.md). For v1 we treat each
// of R, G, B as an independent broadband "reflectance" and run K-M mixing per channel. This is a
// recognized simplification of full-spectrum K-M (see "single-constant simplification of
// Kubelka-Munk theory for paint systems" literature) — it still captures genuinely subtractive,
// non-linear mixing behavior (blue + yellow -> green, not gray), which is the property that matters
// most for this app. It is NOT colorimetrically exact the way full-spectrum K-M is.

import { hexToRgb, rgbToHex, rgbToLinear, linearToRgb } from './color'

const MIN_REFLECTANCE = 0.001
const MAX_REFLECTANCE = 0.999

function clampReflectance(r: number): number {
  return Math.min(MAX_REFLECTANCE, Math.max(MIN_REFLECTANCE, r))
}

// K/S = (1-R)^2 / (2R)  -- the Kubelka-Munk relation between reflectance and absorption/scattering ratio
function reflectanceToKS(r: number): number {
  const clamped = clampReflectance(r)
  return (1 - clamped) ** 2 / (2 * clamped)
}

// Inverse: R = 1 + K/S - sqrt((K/S)^2 + 2*K/S)
function ksToReflectance(ks: number): number {
  const r = 1 + ks - Math.sqrt(ks ** 2 + 2 * ks)
  return clampReflectance(r)
}

export type PigmentSpectrum = { r: number; g: number; b: number } // linear-RGB "reflectance" per channel, 0-1

export function hexToSpectrum(hex: string): PigmentSpectrum {
  return rgbToLinear(hexToRgb(hex))
}

export function spectrumToHex(spectrum: PigmentSpectrum): string {
  return rgbToHex(linearToRgb(spectrum))
}

export type WeightedPigment = { spectrum: PigmentSpectrum; weight: number }

/**
 * Mix pigments via concentration-weighted K/S averaging per channel, then convert back to reflectance.
 * `weight` should already incorporate both the mix ratio and the pigment's tinting strength.
 */
export function mixSpectra(pigments: WeightedPigment[]): PigmentSpectrum {
  const totalWeight = pigments.reduce((sum, p) => sum + p.weight, 0)
  if (totalWeight <= 0) {
    throw new Error('mixSpectra requires at least one pigment with positive weight')
  }

  const channels: (keyof PigmentSpectrum)[] = ['r', 'g', 'b']
  const result = {} as PigmentSpectrum

  for (const channel of channels) {
    const ksSum = pigments.reduce((sum, p) => sum + p.weight * reflectanceToKS(p.spectrum[channel]), 0)
    const ksMix = ksSum / totalWeight
    result[channel] = ksToReflectance(ksMix)
  }

  return result
}
