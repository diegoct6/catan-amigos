# Catan Amigos — morning report

Branch: `redesign/tabletop-companion` (from `main`). Not merged. Production Supabase was not modified.

Do not merge this until you have clicked through a real temporada on the live project. The visual pass ran on the historical example (`?mock=1`), which never calls Supabase.

## 1. Current product discovery

Production is one `index.html` (plus `manifest.webmanifest`) deployed to GitHub Pages from `main` only. The workflow uploads the repo root. There is no build step.

What the page already does, and this branch still does:

- Hash routes: mesa, temporadas, histórico, partidas, estadísticas, jugadores, ficha, reglas, registrar, editar.
- Season switcher. New seasons are named `Normal - …`, `Navegantes - …`, or `C&K - …`. Dates shown on a season come from its games.
- Score Amigos computed in the browser with the same multipliers as `supabase/schema.sql`. Standings sort by average, then games played, then total.
- Ties on victory points are not broken by the app. Someone at the table assigns the puestos.
- Writes: `players` insert, `seasons` insert, `record_game`, then the existing direct update/delete on `games` / `game_results`. Those direct writes are unchanged and may still depend on RLS.
- Admin: magic link, and `delete_season` only if `app_metadata.role` is `admin`. The UI for that had been removed from `main` while the SQL and `SUPABASE_SETUP.md` still describe it. It is back, behind the same RPC. The client now keeps the session (`persistSession: true`) so the email link can finish. That is a browser flag, not a change in the Supabase project.
- Empty, offline, and “Supabase did not answer” states. Writes stay disabled until a backend is confirmed. In the example mode, writes stay on the fixture and say so.

The read-only branches `golden-standard-ui` and `fix/single-rules-view` are behind `main` (a four-line diff). Nothing from them was copied.

Fragile spots kept on purpose: game edit/delete still hits the tables directly; player color still follows roster order, so a new name can shift enamel; there is no service worker.

## 2. Design research

Studied for principles, not screens:

- **Board Game Arena UX guidelines.** Score stays glanceable. Player color is identity. Touch targets sit in the 40–48px band. Motion must be skippable. Do not cover the thing the player has to tap.
- **Flip 7 score tracker (Mārtiņš Irbe, 2026) and the Scorekeeper case study.** A score app fails when it feels like a form. Enter what happened; the app does the arithmetic. One obvious action. History in a couple of taps.
- **Sports live-score pattern (Apple Sports / a match table).** One number that matters, a situation line under it, dark UI for a lamp-lit room, no chart replay.
- **Editorial restraint (paper, ink, one accent).** A single surface, hairline rules, type that sounds printed. Not a theme park of resources.

Gold-standard bar used in the gauntlet:

| Moment | If that team designed it |
| --- | --- |
| Score entry | BGA: the names are on screen before any keypad. Flip 7: you are not filling a spreadsheet. |
| Standings | A match table: rank, name, one number, a small gap to the leader. |
| Winner | Apple Sports: the result, then the line, then one button. No confetti. |

Not used as references: Duolingo, the video’s Neuro demo, generic SaaS landing pages.

## 3. Direction

**A score slip on a walnut table.**

The phone is the table (dark, quiet, readable at night). The task sits on one cream slip. Resource color is a 10px dot for each player, never the chrome. Wheat (`#E7B15A`) is the only accent: the leader’s edge and the primary button.

Why this and not the alternatives:

- A full Catan illustration (the current island hero) does not help anyone write down PV.
- A purple “AI product” dashboard fights the table and the group’s language.
- A pure white utility app would work and would also forget whose mesa it is.

Measured tokens, type scale, and states are locked in `design-system.md`.

Type: **Fraunces** for names and titles, **Commissioner** for UI and every score (tabular lining figures). Both are OFL on Google Fonts. Inter, Roboto, Poppins, Space Grotesk, and Arial are not in the stack.

## 4. Major changes

- Bottom dock on the phone (Mesa, Tabla, Anotar, Archivo, Más). From 960px it becomes a rail and the rest of the sections join it. Old hashes still work.
- Score entry is a keypad, not five dropdowns. Players are chips. VP is digits. The order and the season table update before you save.
- Winner screen is the recap (`#/revelar/:id`), with copy-to-clipboard or the system share sheet.
- Standings are one list. The leader has a wheat edge. Everyone else shows the gap.
- The decorative island, count-up numbers, chart draw-on, and pill chrome are gone.
- Example data is the real histórico (73 games, 258 results) parsed from `supabase/seed-history.sql`. It is a fixture, not a write.

## 5. Actual implementation

| Path | Role |
| --- | --- |
| `index.html` | Shell, dock, dialogs |
| `css/app.css` | The system |
| `js/domain.js` | Score, ties, standings |
| `js/repo.js` | Live Supabase or in-memory fixture |
| `js/render.js` | Screens |
| `js/app.js` | Routes, keypad, admin |
| `js/fixtures.js` | Historical example |
| `design-system.md` | Measured tokens |

Screens: Mesa, Anotar / Editar, Ganó (`#/revelar`), La tabla, Partidas, Temporadas, Histórico, Estadísticas, Jugadores, ficha, Reglas, Más. Dialogs: nueva temporada, borrar partida, borrar temporada, acceso de administrador.

## 6. Before → after

| Before | After |
| --- | --- |
| Eight links in a scrolling bar, plus a season control fighting the status | Dock in the thumb zone. Season stays in the top bar. |
| Registering a game is a form of selects and a small number field | Chips, a 48px keypad, live order, live table |
| Home is an illustrated hero and four insight cards | Season name, the leader, one button: Anotar partida |
| Winner is a toast and a jump to the archive | A slip with the name, the PV, the Score Amigos, and “Ver la tabla” |
| Admin delete described in the docs and missing from the page | Back, with the same confirmation (games and results counted) |

## 7. Mobile

- Page inset 16px. Touch floor 48px. Keypad keys 48px (56px keys buried the names on a 700px-tall phone; the system records that).
- Inputs are 16px so iOS does not zoom.
- While anotando, the dock hides. The keypad appears only after someone is marked, fixed above the home indicator.
- Safe areas respected. Checked at 320, 390, and 1280px wide: no horizontal overflow.
- “Anotar partida” on the mesa sits around y=331 on a 780px screen, above the fold.
- Long names wrap (`overflow-wrap`). Chips show the first name; the row shows the full name.

## 8. Interactions and motion

- Press: 1px down, 120ms. Reduced motion removes it.
- Winner name: one 360ms rise of 8px. Reduced motion removes it.
- No looping boats, no chart replay, no count-up.
- Keypad: digits append (two digits, max 30), then focus moves to the next empty player. Minus, plus, and Borrar are there. Hardware keys work when you are not in a field.
- Ties: a row of puestos. Guardar stays disabled until they are unique and inside the tie.
- Share writes a plain-text recap.

## 9. Functionality preserved and tested

Domain tests (`node js/domain.test.mjs`): every multiplier and puesto from 3 to 6 players, including the float-to-`toFixed` case of 3,60 for four players; 73 games and 258 results; positions are 1..n; tie acceptance and rejection; a draft game moves the average.

Render tests (`node js/render.test.mjs`): mesa, tabla (David Rubio, 1,55 in temporada 2), reveal for game 1 (Diego), a ready hint, an unresolved tie.

Chrome walk on `?mock=1` (no request to Supabase or jsDelivr, no page errors):

- Tabla heading and leader number.
- Three players, a 10–10 tie, Guardar disabled, puestos chosen, hint `Gana Camila Espinosa · 10 PV · 2,00` (three players, multiplier 1).
- Reveal shows Camila.
- Chips are inside a 700px-tall viewport before the keypad exists.
- Routes rendered at 320 / 390 / 1280 without horizontal overflow.

Not exercised against live Supabase, on purpose.

## 10. Testing and what is still uncertain

Two critique cycles were judged on rendered UI, not on the code.

**Cycle 1 — fail.** On a 390×844 phone the fixed keypad covered “¿Quién jugó?”. That breaks the BGA rule and the one-ask rule. Fix: the keypad and Guardar stay hidden until at least one player is in. Re-check: chips are on screen at 700px height; after three names, the keypad and the rows coexist. The gap is closed.

**Cycle 2 — fail.** The example warning was a second paper card, and the friends’ names were set in the same grotesque as the buttons, so the table had no voice. Fix: the warning sits on the walnut (foam-dim, wheat rule). Names in lists are Fraunces 18/560. Scores stay Commissioner tabular. Re-check: tabla and reveal render with that split; contrast pairs in `design-system.md` still hold (ink on paper 14.86, foam-dim on table 8.89, ink on wheat 9.37).

**Final pass.** No indigo/violet, no gradient, no glass, no three feature cards, no Inter/Poppins/Space Grotesk. One loose shadow, on the open score slip only. Copy is short and specific (“¿Quién jugó?”, “Hay empate a 10 PV”, “Ver la tabla”). No SaaS verbs.

Still uncertain:

- Live RLS on game update/delete (pre-existing).
- Magic-link return on the real project (the redirect no longer puts the route in the hash, so Supabase can read the token).
- Fonts need a network. Offline, the fallback is Palatino / Avenir Next, not Inter.
- `prefers-reduced-motion` is implemented in CSS and was not flipped on in the browser run.

## 11. Supabase

Read from `schema.sql`, `admin-delete-season.sql`, `seed-history.sql`, and the client in the old `index.html`.

- Tables: seasons, players, games, game_results.
- Views: `game_result_scores`, `season_standings`, `all_time_standings`. The page still computes standings itself, same formula, so it does not need the views to render.
- Writes used: insert player, insert season, `record_game(p_season_id, p_played_at, p_results)`, update game + replace results, delete game, `delete_season` for an admin session.
- The publishable key stays the one already in the repo. No new env, no migration, no SQL run.

Tomorrow, if you want the live check: open the branch with `?live=1` on a network that can reach the project, anotate one partida in a scratch season, confirm it appears in the tabla, then delete it. Do not point this at a second project.

## 12. Product path

The slip is the scorecard. `#/revelar` is the recap and already copies a text block (the share step). Partidas is the diary. Fichas and estadísticas are the next layer of “how this person plays,” still using the same rows and charts. A later social or media layer can hang off the recap text without a new visual language. A later free/premium split can gate history depth or export; nothing in the UI sells it, and there is no paywall.

## 13. Media brand, briefly

The group already has a name, a scoring rule, and 73 games of memory. The recap text is the seed of a channel: one image of the slip after each noche, posted as “la mesa,” not as a Catan ad. The wheat-on-walnut slip is distinctive enough to crop into a story without extra illustration. That is a later edit, not this PR.

## 14. Git

- Branch: `redesign/tabletop-companion`, cut from `main`.
- `main` was not pushed to and not merged.
- `supabase/*.sql` is untouched.
- GitHub Pages deploys only `main`, so this PR does not change the live site.
- Merge only after the live `?live=1` pass above.

## 15. Next iterations

1. Confirm live `record_game` and the admin link on the real project.
2. Pin player enamel to `player_id` so a new name does not recolor the table.
3. If game update/delete fails RLS, add a validated RPC (a schema change — not done tonight) instead of writing the tables from the client.
4. Remember the last roster on this phone so the next partida starts with the same chips.
5. A true offline queue: anotate without signal, send when Supabase answers.
6. Season selector that does not truncate “Navegantes - …” on a 320px screen.
7. Export the temporada as the same plain text the recap already builds.
8. Replace the CDN font request with self-hosted Fraunces and Commissioner so game night works on a bad network.
9. Empty-state photos are unnecessary; if a noche has no games, the sentence is enough. Leave it.
10. Only after the live pass: decide whether the dock labels need a shorter “Anotar” on the smallest phones. They fit at 320px in this run.
