# Chromaforge

Oil paint color mixing app — tell it which paints you own, give it a target color (picker, hex, or sampled from a photo), and it recommends what to mix and in what ratio using a Kubelka-Munk pigment model.

## Current Status

**Phase:** Deployed and live, working first pass confirmed by Mark. UX polish and expanded color/brand coverage planned for a future session.
**Last updated:** 2026-08-18

## Deployment

- **Live URL:** https://chromaforge-vert.vercel.app — verified live, redirects unauthenticated users to /login correctly, zero console errors, SPA routing works
- **Hosting:** Vercel (Hobby tier), project `markhazlewood42s-projects/chromaforge`, GitHub-connected for auto-deploy on push
- **Env vars set on Vercel:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (all environments)
- **Repo:** github.com/markhazlewood42/chromaforge (public) — pushed, `main` branch
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
- 2026-08-18: Applied DB migrations to the remote Supabase project via the transaction pooler (`aws-0-us-east-2.pooler.supabase.com:6543` — the direct host is IPv6-only and doesn't resolve on this network). Note: the pooler's TLS chain wasn't fully sent by the server, so Node's default trust store couldn't verify it even though it's a legitimate Supabase-issued cert (`*.pooler.supabase.com`, verified via manual chain inspection before trusting) — fetched the actual chain and pinned it explicitly rather than disabling verification. All 5 tables created, all 18 seed pigments loaded, RLS confirmed working (anon key can read `pigments`, gets empty results from `user_collection` as expected since there's no authenticated user).
- 2026-08-18: Deployed to Vercel. Linked project (GitHub-connected), set `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` on all environments, first deploy auto-promoted to production by Vercel. Verified live at chromaforge-vert.vercel.app.
- 2026-08-18: Added Playwright E2E suite (`e2e/core-flow.spec.ts`) covering Collection selection, the empty-collection error state, the full find-mix-and-save flow, and history removal — 8 tests passing across Chromium + Firefox. Note: click the wrapping `<label>` (`Checkbox.Content`), not the checkbox control directly — its animated checkmark SVG intercepts direct clicks and causes flaky/failing tests.
- 2026-08-18: Mark tested the live deploy — confirmed as "a great first pass." Flagged for a future session: UX improvements needed, and more paint colors/brands need to be supported (starter set is only 18 pigments from one brand's chart).
- 2026-08-18: Enabled `VITE_AUTH_BYPASS=true` on the production Vercel deployment (both production and preview envs) so Mark could test without Google OAuth being configured yet, and redeployed. This must be turned off before the deployment is actually auth-protected — see Outstanding.
- 2026-08-18: Researched mixing engine approach. Compiled a starter 18-pigment reference set (CI codes sourced from Gamblin's conservation-colors chart; hex/tinting-strength values marked `approx`, need verification against real swatches) at `src/engine/pigments.md`. Added Bob Ross (Martin/F. Weber) as a 5th brand alongside W&N/Gamblin/Michael Harding/Rembrandt per Mark's request. Wrote DB schema + starter seed migrations (`supabase/migrations/`) — not yet applied to remote, blocked on pooler connection string. Implemented the Kubelka-Munk mixing engine (`src/engine/`): color space conversions + CIEDE2000 (`color.ts`), per-channel K-M pigment mixing (`kubelkaMunk.ts` — v1 uses a 3-channel RGB-band simplification rather than full spectral reconstruction; documented as a known limitation with a future upgrade path), and a ratio solver that ranks candidate recipes (`solver.ts`). 13 Vitest unit tests passing, covering self-mix identity, white-lightening, blue+yellow→green (subtractive, not gray), ranking order, max-paint cap, and no-match detection. Created public GitHub repo and pushed. Built out Collection (checkbox catalog grouped by category), Match (HeroUI ColorPicker + hex, image upload with click-to-sample eyedropper, ranked recipe cards, save-to-history), and History pages — all currently backed by localStorage (`useLocalCollection`/`useLocalHistory`) as an interim store until Supabase migrations are applied and `user_collection`/`matches` are wired up. Verified the full Collection → Match → History flow live in browser: correct ranking, correct "no close match" labeling, save/remove working, zero console errors.

## Outstanding / Next Steps

Deferred to a future session per Mark (2026-08-18): "there are definitely UX improvements that need to be made, and more colors we need to support."

- [ ] UX pass — no specifics captured yet, gather Mark's feedback at the start of the next session
- [ ] Expand pigment/brand coverage beyond the starter 18 (currently Gamblin-sourced only; W&N/Michael Harding/Rembrandt/Bob Ross cross-referencing not started)
- [ ] Configure Google OAuth (Google Cloud Console + Supabase dashboard) — Supabase project itself is set up, OAuth provider config still pending
- [ ] **Turn off `VITE_AUTH_BYPASS`** on Vercel (`vercel env rm VITE_AUTH_BYPASS production preview` + redeploy) once Google OAuth is configured — it's currently bypassing real auth entirely on production
- [ ] Verify starter pigment hex/tinting-strength values against real brand swatches (currently `approx`)
- [ ] Swap `useLocalCollection`/`useLocalHistory` (localStorage) for Supabase-backed hooks against `user_collection`/`matches` (migrations are applied, hooks just aren't wired to them yet)

## Current Stack

- **Frontend:** Vite + React 19 + TypeScript, Tailwind CSS v4, HeroUI v3 (beta)
- **Routing:** React Router v7
- **Backend:** Supabase — Postgres schema live (5 tables, RLS enforced, 18 seed pigments), Auth configured but Google OAuth provider not yet set up
- **Auth:** Supabase Auth, Google OAuth (pending), `VITE_AUTH_BYPASS=true` currently set on production for testing (see Outstanding)
- **Testing:** Vitest (13 unit tests, mixing engine), Playwright (8 E2E tests, Chromium + Firefox) — both passing

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
    MatchPage.tsx            — target color (picker/hex/image eyedropper), solver results, save-to-history
    CollectionPage.tsx       — checkbox catalog grouped by pigment category
    HistoryPage.tsx          — saved matches, remove
  hooks/
    useLocalCollection.ts     — interim localStorage owned-paints store (TODO: swap for Supabase)
    useLocalHistory.ts        — interim localStorage match history (TODO: swap for Supabase)
  data/
    catalog.ts                — local mirror of the seeded pigment catalog (TODO: fetch from Supabase)
  lib/
    supabase.ts              — Supabase client init
  types/
    database.ts               — placeholder, replace with generated types once schema exists
  engine/
    color.ts                  — sRGB/linear/XYZ/LAB conversions, CIEDE2000
    kubelkaMunk.ts             — per-channel K-M pigment mixing (v1 simplification, see CLAUDE.md)
    pigment.ts                 — Pigment/OwnedPaint types, tinting-strength weighting
    solver.ts                  — ranks candidate recipes by ΔE2000
    pigments.md                 — pigment data sourcing notes
    __tests__/                  — 13 Vitest unit tests, all passing
supabase/
  migrations/                — schema + seed pigments (applied to remote)
e2e/
  core-flow.spec.ts           — Playwright E2E, 8 tests passing
```
