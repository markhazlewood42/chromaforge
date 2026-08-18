import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, hexToLab, labToHex, deltaE2000 } from '../color'

describe('hex/rgb round-trip', () => {
  it('converts hex to rgb and back', () => {
    expect(hexToRgb('#2B2CA3')).toEqual({ r: 43, g: 44, b: 163 })
    expect(rgbToHex({ r: 43, g: 44, b: 163 })).toBe('#2b2ca3')
  })
})

describe('hex/lab round-trip', () => {
  it('round-trips within a small tolerance', () => {
    const original = '#2b2ca3'
    const lab = hexToLab(original)
    const back = labToHex(lab)
    expect(back.toLowerCase()).toBe(original.toLowerCase())
  })
})

describe('deltaE2000', () => {
  it('is zero for identical colors', () => {
    const lab = hexToLab('#7fae42')
    expect(deltaE2000(lab, lab)).toBeCloseTo(0, 5)
  })

  it('is larger for more different colors', () => {
    const red = hexToLab('#ff0000')
    const orange = hexToLab('#ff8800')
    const blue = hexToLab('#0000ff')
    expect(deltaE2000(red, orange)).toBeLessThan(deltaE2000(red, blue))
  })

  it('is symmetric', () => {
    const a = hexToLab('#336699')
    const b = hexToLab('#996633')
    expect(deltaE2000(a, b)).toBeCloseTo(deltaE2000(b, a), 10)
  })
})
