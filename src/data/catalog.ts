// Local mirror of the starter pigment set seeded in supabase/migrations/*_seed_pigments.sql.
// TODO: once the migrations are applied and brand_paints is populated, fetch this from Supabase
// instead of this hardcoded fallback. See src/engine/pigments.md for sourcing notes.

import type { Pigment } from '../engine/pigment'

export const PIGMENT_CATALOG: Pigment[] = [
  { ciCode: 'PW6', commonName: 'Titanium White', category: 'white', masstoneHex: '#FFFFFF', opacity: 'opaque', tintingStrength: 'very high' },
  { ciCode: 'PBk9', commonName: 'Ivory Black', category: 'black', masstoneHex: '#2B2320', opacity: 'semi-opaque', tintingStrength: 'medium' },
  { ciCode: 'PY35', commonName: 'Cadmium Yellow Light', category: 'yellow', masstoneHex: '#FFF347', opacity: 'opaque', tintingStrength: 'high' },
  { ciCode: 'PY37', commonName: 'Cadmium Yellow Medium', category: 'yellow', masstoneHex: '#FFD500', opacity: 'opaque', tintingStrength: 'high' },
  { ciCode: 'PY43', commonName: 'Yellow Ochre', category: 'yellow', masstoneHex: '#C89935', opacity: 'semi-opaque', tintingStrength: 'medium' },
  { ciCode: 'PY42', commonName: 'Transparent Mars Yellow', category: 'yellow', masstoneHex: '#C68A2E', opacity: 'transparent', tintingStrength: 'medium' },
  { ciCode: 'PO20', commonName: 'Cadmium Orange', category: 'orange', masstoneHex: '#FF7F1A', opacity: 'opaque', tintingStrength: 'high' },
  { ciCode: 'PR108', commonName: 'Cadmium Red Medium', category: 'red', masstoneHex: '#E2231A', opacity: 'opaque', tintingStrength: 'high' },
  { ciCode: 'PR101', commonName: 'Mars/Venetian Red', category: 'red', masstoneHex: '#8B2E1F', opacity: 'semi-opaque', tintingStrength: 'medium' },
  { ciCode: 'PBr7-burnt', commonName: 'Burnt Sienna', category: 'brown', masstoneHex: '#8A3324', opacity: 'semi-transparent', tintingStrength: 'medium' },
  { ciCode: 'PBr7-raw', commonName: 'Raw Umber', category: 'brown', masstoneHex: '#5C4A3A', opacity: 'semi-transparent', tintingStrength: 'low' },
  { ciCode: 'PV19', commonName: 'Quinacridone Red', category: 'red', masstoneHex: '#A8203F', opacity: 'transparent', tintingStrength: 'high' },
  { ciCode: 'PV23', commonName: 'Dioxazine Purple', category: 'violet', masstoneHex: '#3C1F5E', opacity: 'transparent', tintingStrength: 'very high' },
  { ciCode: 'PB29', commonName: 'Ultramarine Blue', category: 'blue', masstoneHex: '#2B2CA3', opacity: 'transparent', tintingStrength: 'medium' },
  { ciCode: 'PB28', commonName: 'Cobalt Blue', category: 'blue', masstoneHex: '#0047AB', opacity: 'semi-transparent', tintingStrength: 'medium' },
  { ciCode: 'PB15:2', commonName: 'Phthalo Blue', category: 'blue', masstoneHex: '#0C2340', opacity: 'transparent', tintingStrength: 'very high' },
  { ciCode: 'PG7', commonName: 'Phthalo Green', category: 'green', masstoneHex: '#123524', opacity: 'transparent', tintingStrength: 'very high' },
  { ciCode: 'PG18', commonName: 'Viridian', category: 'green', masstoneHex: '#00693E', opacity: 'semi-transparent', tintingStrength: 'medium' },
]
