import { describe, it, expect } from 'vitest'
import { solveMix, isNoMatch } from '../solver'
import type { OwnedPaint } from '../pigment'

const paints: OwnedPaint[] = [
  { id: 'white', label: 'Titanium White', masstoneHex: '#ffffff', tintingStrength: 'very high' },
  { id: 'black', label: 'Ivory Black', masstoneHex: '#2b2320', tintingStrength: 'medium' },
  { id: 'ultramarine', label: 'Ultramarine Blue', masstoneHex: '#2b2ca3', tintingStrength: 'medium' },
  { id: 'cadmium-yellow', label: 'Cadmium Yellow Medium', masstoneHex: '#ffd500', tintingStrength: 'high' },
  { id: 'cadmium-red', label: 'Cadmium Red Medium', masstoneHex: '#e2231a', tintingStrength: 'high' },
]

describe('solveMix', () => {
  it('finds an exact (or near-exact) match when the target is an owned paint', () => {
    const results = solveMix('#ffd500', paints)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].deltaE).toBeLessThan(1)
    expect(results[0].components.map((c) => c.paintId)).toEqual(['cadmium-yellow'])
  })

  it('returns results ranked by ascending deltaE', () => {
    const results = solveMix('#7a6a2a', paints)
    for (let i = 1; i < results.length; i++) {
      expect(results[i].deltaE).toBeGreaterThanOrEqual(results[i - 1].deltaE)
    }
  })

  it('never returns more paints per recipe than maxPaints', () => {
    const results = solveMix('#556b2f', paints, { maxPaints: 2 })
    for (const candidate of results) {
      expect(candidate.components.length).toBeLessThanOrEqual(2)
    }
  })

  it('flags a poor match as no-match via isNoMatch', () => {
    // A vivid magenta that none of these earthy/primary paints can approximate well.
    const results = solveMix('#ff00ff', paints, { maxPaints: 1 })
    expect(isNoMatch(results[0], 5)).toBe(true)
  })
})
