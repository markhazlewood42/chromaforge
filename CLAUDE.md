# Claude Code — Chromaforge

## What this project is

Chromaforge helps oil painters figure out what to mix to get a target color. You tell it what paints you own, give it a target (color picker, hex, or a pixel sampled from an uploaded photo), and it recommends ranked paint recipes (up to 3 paints + white/black, with ratios) using a Kubelka-Munk pigment mixing model.

This is a personal project (not a HubSpot repo). Use standard npm commands.

## Why Kubelka-Munk, not RGB blending

Paint mixing is subtractive (pigments absorb/scatter light), not additive like light or naive RGB averaging. Two paints with near-identical RGB swatches can mix completely differently depending on their actual pigment composition. The mixing engine (`src/engine/`) works in K/S (absorption/scattering) space per pigment, converting to/from LAB for comparison against targets (ΔE2000). See the pigment reference data model below — this is the load-bearing design decision for the whole app.

### Where the spectral data comes from

We don't have (or need) measured spectral reflectance curves per pigment — brands don't publish those. Instead, each paint's reflectance spectrum is *reconstructed* from its published masstone RGB/hex using Scott Burns' reflectance-recovery approach (the same technique underlying open-source tools like Spectral.js and Mixbox): given only an sRGB triplet, generate a smooth, physically plausible reflectance curve consistent with that color, then do K-M mixing math on the reconstructed spectra. Tinting strength and opacity (also brand-published) scale each pigment's effective K/S weight in a mix. This means seed data only needs: Colour Index code, masstone hex, tinting strength, opacity — all things manufacturers actually publish.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4 + HeroUI v3 (beta)** — always call `get_component_docs` via the HeroUI MCP before using an unfamiliar component; don't guess v3 APIs (compound components, `onPress` not `onClick`, etc.)
- **React Router v7**
- **Supabase** for Postgres + Auth (Google OAuth) + Storage
- **React Context** for auth state (`AuthContext`)

## Key conventions

### Domain model (planned schema)

- `pigments` — reference library, seeded via migration, not user-editable: Colour Index code (e.g. `PB29`), K/S mixing parameters, tinting strength, opacity class
- `brand_paints` — brand + product name + pigment code(s) (FK to `pigments`) + reference swatch
- `user_collection` — join table: which `brand_paints` a user owns
- `matches` — saved match history: target color, resulting recipe, ΔE score

### Auth flow

Supabase Auth (Google OAuth), following the same pattern as RiffNotes: `AuthContext` handles session state, `ProtectedRoute` gates authenticated routes and redirects to `/login`. `VITE_AUTH_BYPASS=true` skips auth for local dev/testing (fake user, no Supabase calls) — same convention as RiffNotes.

### Mixing engine

Lives in `src/engine/` as pure TypeScript functions — no React, no Supabase — so it's fully unit-testable in isolation with Vitest. This is the highest-value test surface in the app since it's deterministic math.

### Environment

Two env vars required (see `.env.example`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_AUTH_BYPASS` — `true` to bypass auth locally

`.env.local` has actual values, never committed.

## Commands

```bash
npm run dev      # Start dev server (localhost:3003)
npm run build    # Production build
npm run lint     # oxlint
```

## What's next

See `status.md` for current phase and outstanding work. Broad order: Supabase project setup → pigment reference data research → schema/migrations → mixing engine → Collection/Match/History pages → E2E tests → deploy.

## Don't

- Don't use HubSpot-internal tools. This is a personal project.
- Don't guess HeroUI v3 component APIs — check via MCP or `node_modules/@heroui` types first.
- Don't fall back to RGB/HSL blending for the mixing math even as a "temporary" shortcut — it gives visibly wrong answers for paint and defeats the point of the app.
- Don't commit `.env.local` or Supabase secrets.
