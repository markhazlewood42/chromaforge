import { describe, it, expect } from 'vitest'
import { hexToSpectrum, spectrumToHex, mixSpectra } from '../kubelkaMunk'
import { hexToLab, deltaE2000 } from '../color'

describe('mixSpectra', () => {
  it('mixing a pigment with itself reproduces the same color', () => {
    const spectrum = hexToSpectrum('#2b2ca3')
    const mixed = mixSpectra([
      { spectrum, weight: 0.5 },
      { spectrum, weight: 0.5 },
    ])
    const original = hexToLab('#2b2ca3')
    const result = hexToLab(spectrumToHex(mixed))
    expect(deltaE2000(original, result)).toBeLessThan(0.5)
  })

  it('mixing with white lightens the result', () => {
    const blue = hexToSpectrum('#0c2340')
    const white = hexToSpectrum('#ffffff')
    const mixed = mixSpectra([
      { spectrum: blue, weight: 0.7 },
      { spectrum: white, weight: 0.3 },
    ])
    const blueLab = hexToLab('#0c2340')
    const mixedLab = hexToLab(spectrumToHex(mixed))
    expect(mixedLab.l).toBeGreaterThan(blueLab.l)
  })

  it('mixing blue and yellow produces a green-ish result, not gray', () => {
    const blue = hexToSpectrum('#2b2ca3') // ultramarine
    const yellow = hexToSpectrum('#ffd500') // cadmium yellow medium
    const mixed = mixSpectra([
      { spectrum: blue, weight: 0.5 },
      { spectrum: yellow, weight: 0.5 },
    ])
    const resultHex = spectrumToHex(mixed)
    const rgb = {
      r: parseInt(resultHex.slice(1, 3), 16),
      g: parseInt(resultHex.slice(3, 5), 16),
      b: parseInt(resultHex.slice(5, 7), 16),
    }
    // Green-ish: green channel should be the dominant or co-dominant channel, not desaturated gray.
    expect(rgb.g).toBeGreaterThanOrEqual(rgb.r)
    expect(rgb.g).toBeGreaterThanOrEqual(rgb.b)
    // Not a flat gray: channels shouldn't all be within a few units of each other.
    const spread = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)
    expect(spread).toBeGreaterThan(10)
  })

  it('throws when all weights are zero', () => {
    const spectrum = hexToSpectrum('#ffffff')
    expect(() => mixSpectra([{ spectrum, weight: 0 }])).toThrow()
  })
})
