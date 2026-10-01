# Catan Amigos

Mobile scorebook for the group's Catan table. Anota la partida, mira la tabla, guarda la historia.

This branch (`redesign/tabletop-companion`) is a redesign of the production page. It keeps the same Supabase reads and writes (`record_game`, players, seasons, game edit/delete, admin `delete_season`). It does not change `supabase/*.sql`.

## Run locally

Open `index.html` through any static server (GitHub Pages does this in production).

- Default: try the existing Supabase project, and if it does not answer, fall back to the historical example (73 games).
- `?mock=1` — example data only. Nothing is sent to Supabase.
- `?live=1` — Supabase only. If it fails, the page stops instead of showing the example.

Mock mode is session-local. Refreshing restores the historical fixture.

## Scoring

Score Amigos = (jugadores − puesto) × multiplicador. 3 → 1,0 · 4 → 1,2 · 5 → 1,3 · 6 → 1,5. The table sorts by average. See `design-system.md` for the visual system and `REDESIGN_REPORT.md` for the review.
