export type Opacity = 'opaque' | 'semi-opaque' | 'semi-transparent' | 'transparent'
export type TintingStrength = 'low' | 'medium' | 'high' | 'very high'

export type Pigment = {
  ciCode: string
  commonName: string
  category: string
  masstoneHex: string
  opacity: Opacity
  tintingStrength: TintingStrength
}

// Relative weight multiplier used when a pigment's tinting strength should dominate a mix
// more than a simple volume ratio alone would suggest.
const TINTING_STRENGTH_WEIGHT: Record<TintingStrength, number> = {
  low: 1,
  medium: 2,
  high: 4,
  'very high': 8,
}

export function tintingStrengthWeight(strength: TintingStrength): number {
  return TINTING_STRENGTH_WEIGHT[strength]
}

export type OwnedPaint = {
  id: string
  label: string // e.g. "Winsor & Newton — French Ultramarine"
  masstoneHex: string
  tintingStrength: TintingStrength
}
