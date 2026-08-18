# Chromaforge

Oil paint color mixing app — tell it which paints you own, give it a target color (picker, hex, or sampled from a photo), and it recommends what to mix and in what ratio using a Kubelka-Munk pigment model.

## Current Status

**Phase:** Scaffolding
**Last updated:** 2026-08-17

## Deployment

- **Live URL:** not yet deployed
- **Hosting:** Vercel (planned, Hobby tier)
- **Repo:** github.com/markhazlewood42/chromaforge (public) — local git initialized, not yet pushed
- **Backend:** Supabase project created (`odrwbfthdecfgrivykwj`), publishable key wired into `.env.local`, connection verified locally (no console errors, `/login` redirect confirmed working)

## Key Decisions

- **Audience:** solo user for now, built as if public-facing later — real Supabase auth/DB from day one, not local-storage-only
- **Mixing model:** Kubelka-Munk (physically based pigment mixing), not RGB/LAB blending — paint mixing is subtractive, not additive
- **Pigment data:** curated reference set of ~30 common single-pigment oil colors across Winsor & Newton, Gamblin, Michael Harding, Rembrandt, and Bob Ross (Martin/F. Weber), keyed by Colour Index pigment code (e.g. `PB29`)
- **Mix complexity:** solver combines up to 3 owned paints + white/black (white/black are regular owned paints, not hardcoded)
- **Target input:** color picker/hex entry AND photo upload with pixel eyedropper
- **Results:** ranked list of 2-3 candidate recipes with predicted swatch + ΔE2000 accuracy score
- **Medium scope:** oil paint only for v1
- **Full design doc:** see plan approved 2026-08-17 (`.claude/plans/we-re-going-to-start-humming-balloon.md` from that session)

## What Happened

- 2026-08-17: Brainstormed and approved design. Named the project **Chromaforge**. Scaffolded Vite + React 19 + TypeScript + Tailwind v4 + HeroUI v3 project. Set up routing (Match/Collection/History), Supabase-backed AuthContext with `VITE_AUTH_BYPASS` support (matching RiffNotes pattern), ProtectedRoute gate. Verified dev server renders and routes correctly in browser. Initialized local git repo.
- 2026-08-18: Researched mixing engine approach — discovered we don't need proprietary spectral pigment datasets; Scott Burns' RGB-to-reflectance reconstruction (used by Spectral.js/Mixbox) lets us derive K-M spectra from published masstone hex + tinting strength/opacity, which brands do publish. Compiled a starter 18-pigment reference set (CI codes sourced from Gamblin's conservation-colors chart; hex/tinting-strength values marked `approx`, need verification against real swatches) at `src/engine/pigments.md`. Added Bob Ross (Martin/F. Weber) as a 5th brand alongside W&N/Gamblin/Michael Harding/Rembrandt per Mark's request.

## Outstanding / Next Steps

- [ ] Configure Google OAuth (Google Cloud Console + Supabase dashboard) — Supabase project itself is set up, OAuth provider config still pending
- [ ] Finish pigment K/S reference data research (starter 18 done, see `src/engine/pigments.md`; hex/tinting-strength values need verification against real swatches, brand cross-referencing not started)
- [ ] Build database schema + seed migrations (`pigments`, `brand_paints`, `user_collection`, `matches`)
- [ ] Implement Kubelka-Munk mixing engine + solver (Vitest unit tests)
- [ ] Build out Collection page (currently a stub)
- [ ] Build out Match page (currently a stub)
- [ ] Build out History page (currently a stub)
- [ ] Playwright E2E tests
- [ ] Create GitHub repo (public) and push
- [ ] Deploy to Vercel

## Current Stack

- **Frontend:** Vite + React 19 + TypeScript, Tailwind CSS v4, HeroUI v3 (beta)
- **Routing:** React Router v7
- **Backend:** Supabase (planned — Postgres + Auth + Storage)
- **Auth:** Supabase Auth, Google OAuth (planned), `VITE_AUTH_BYPASS=true` for local dev/testing
- **Testing:** Vitest (mixing engine), Playwright (E2E) — not yet set up

## File Structure

```
src/
  App.tsx                 — routes, auth gate wiring
  main.tsx                — entry point, BrowserRouter
  index.css               — Tailwind + HeroUI imports
  context/
    AuthContext.tsx        — Supabase auth state (+ VITE_AUTH_BYPASS)
  components/
    ProtectedRoute.tsx      — auth gate
    GlobalNav.tsx            — top nav (Match/Collection/History)
  pages/
    LoginPage.tsx
    MatchPage.tsx            — stub, target color input + solver results (TODO)
    CollectionPage.tsx       — stub, owned paints management (TODO)
    HistoryPage.tsx          — stub, saved matches (TODO)
  lib/
    supabase.ts              — Supabase client init
  types/
    database.ts               — placeholder, replace with generated types once schema exists
  engine/                     — Kubelka-Munk mixing engine (TODO, empty)
```
