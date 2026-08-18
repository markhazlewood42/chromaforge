# Pigment Reference Data — Research Notes

## Method

Each pigment's mixing behavior is derived, not measured. **v1** applies Kubelka-Munk mixing per RGB channel directly from each paint's published masstone RGB (see `src/engine/kubelkaMunk.ts` and the note in `CLAUDE.md`) — a documented simplification of full-spectrum K-M, not full spectral reconstruction. Tinting strength and opacity scale each pigment's effective weight in a mix. Full spectral reconstruction (Burns/Smits-style, as used by Spectral.js/Mixbox) is a tracked future upgrade, not yet built.

So the only facts a seed pigment needs — all things brands actually publish — are:
- **Colour Index (CI) code** — e.g. `PB29` — printed on the tube, identifies the actual pigment regardless of brand's marketing name
- **Masstone hex/RGB** — the color of the paint at full strength, straight from the tube
- **Opacity class** — opaque / semi-opaque / semi-transparent / transparent
- **Tinting strength** — roughly low / medium / high / very high (how much a small amount dominates a mix)

## Source used so far

Gamblin Conservation Colors technical chart (conservationcolors.com — PDF: "Color Chart and Composition of Colors") gave verified CI codes for a wide single-pigment color range. That source does **not** publish numeric hex swatches or tinting-strength ratings, so those two fields below are marked `approx` (drawn from general, widely-agreed pigment characteristics in art materials literature) rather than pulled from a specific citation. **Before shipping, `approx` hex values should be checked against actual brand swatches (e.g. Winsor & Newton's or Gamblin's own product photos/swatch chips) rather than trusted as-is.**

## Starter pigment set (18)

| CI Code | Common name | Masstone hex (approx) | Opacity | Tinting strength |
|---|---|---|---|---|
| PW6 | Titanium White | `#FFFFFF` | opaque | very high |
| PBk9 | Ivory Black | `#2B2320` | semi-opaque | medium |
| PY35 | Cadmium Yellow Light | `#FFF347` | opaque | high |
| PY37 | Cadmium Yellow Medium | `#FFD500` | opaque | high |
| PY43 | Yellow Ochre | `#C89935` | semi-opaque | medium |
| PY42 | Transparent Mars Yellow | `#C68A2E` | transparent | medium |
| PO20 | Cadmium Orange | `#FF7F1A` | opaque | high |
| PR108 | Cadmium Red Medium | `#E2231A` | opaque | high |
| PR101 | Mars/Venetian Red (synthetic iron oxide) | `#8B2E1F` | semi-opaque | medium |
| PBr7 | Burnt Sienna (natural iron oxide, calcined) | `#8A3324` | semi-transparent | medium |
| PBr7 | Raw Umber (natural iron oxide + Mn) | `#5C4A3A` | semi-transparent | low |
| PV19 | Quinacridone Red | `#A8203F` | transparent | high |
| PV23 | Dioxazine Purple | `#3C1F5E` | transparent | very high |
| PB29 | Ultramarine Blue | `#2B2CA3` | transparent | medium |
| PB28 | Cobalt Blue | `#0047AB` | semi-transparent | medium |
| PB15:2 | Phthalo Blue | `#0C2340` | transparent | very high |
| PG7 | Phthalo Green | `#123524` | transparent | very high |
| PG18 | Viridian | `#00693E` | semi-transparent | medium |

## Brands to cover in `brand_paints`

Winsor & Newton, Gamblin, Michael Harding, Rembrandt, **Bob Ross (made by Martin/F. Weber)**.

Bob Ross oil colors' CI codes (source: artiscreation.com/Bob_Ross_Pigments.html — a fan-compiled reference, not an official Weber technical data sheet, so treat these as needing confirmation before shipping): Alizarin Crimson PR83, Phthalo Blue PB15:3, Phthalo Green PG7, Prussian Blue PB27, Yellow Ochre PY43, Titanium White PW6/PW4, Van Dyke Brown PBk9/PBr7, Burnt/Raw Umber PBr7, Burnt Sienna PBr7, Cadmium Yellow (hue) PY1/PW4, Indian Yellow PY83, Ultramarine Blue PB29, Viridian Green PG18, Ivory Black PBk9, Cadmium Red Light/Medium PR108:1. All overlap with the starter 18 above except Van Dyke Brown (a hue mix of PBk9+PBr7) and the cadmium "hue" convenience mixes, which are multi-pigment and lower priority for the single-pigment starter set.

## Not yet done

- Cross-reference these CI codes against Winsor & Newton, Michael Harding, Rembrandt, and Bob Ross/Weber technical data sheets to populate `brand_paints` (same pigment, different brand names — e.g. PB29 is "French Ultramarine" at W&N, "Ultramarine Blue" at Gamblin)
- Verify/replace `approx` hex values against real product swatches
- Confirm Bob Ross CI codes against an official Weber source (current source is fan-compiled)
- Extend beyond this starter 18 toward the ~30-color target if gaps show up in practice
