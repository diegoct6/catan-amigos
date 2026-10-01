# Catan Amigos — design system (tabletop companion)

Locked for the redesign branch. Measured so screens stay consistent. This is an original translation, not a copy of any reference.

Direction: **a score slip on a walnut table.** The phone is the table (dark, quiet, night-friendly). The task sits on one paper slip (cream, ink, hairline rules). Resource color is player identity, not chrome.

## Banned (anti-slop)

- Indigo, violet, or blue-purple gradients
- Glassmorphism, blur panels, neon glow
- Three-column feature marketing grids
- Giant decorative headlines, island illustrations, confetti
- Pill-shaped everything, stacked drop shadows, blob backgrounds
- Inter, Roboto, Arial, system-ui as the chosen voice
- Count-up numbers, looping motion, chart “draw-on” animations

## Color

| Token | Hex | Role |
| --- | --- | --- |
| `--table` | `#241910` | Page ground (walnut) |
| `--rail` | `#1A120E` | Dock / top bar |
| `--foam` | `#F7F1E6` | Primary text on table |
| `--foam-dim` | `#C9B8A2` | Secondary text on table |
| `--hair` | `rgba(247,241,230,.16)` | Hairline on table |
| `--paper` | `#F4E7D0` | Slip surface |
| `--paper-2` | `#EAD9BA` | Pressed / inset row |
| `--ink` | `#1C140F` | Text on paper |
| `--mute` | `#5C4A3A` | Secondary text on paper |
| `--rule` | `#D4C2A4` | Hairline on paper |
| `--lamp` | `#E7B15A` | One accent: primary action, leader mark |
| `--lamp-press` | `#C9923A` | Lamp pressed |
| `--brick` | `#8E3224` | Destructive and win pip only |
| `--sea` | `#2F5E6C` | Focus ring |
| `--field` | `#FBF6EA` | Input fill, a step lighter than the slip so the field is visible |

Contrast (WCAG relative luminance), locked pairs:

| Pair | Ratio |
| --- | --- |
| Ink on paper | 14.86 |
| Mute `#5C4A3A` on paper | 6.89 |
| Brick on paper | 6.53 |
| Sea on paper | 5.85 |
| Ink on lamp | 9.37 |
| Foam on table | 15.29 |
| Foam-dim on table | 8.89 |
| Lamp on table | 8.87 |

Player enamel, stable by roster order (same index rule as production). Used as a 10px dot or a winner’s top rule — never as page background.

| Token | Hex | Resource |
| --- | --- | --- |
| `--enamel-brick` | `#B24A36` | brick |
| `--enamel-wool` | `#6E8B52` | wool |
| `--enamel-water` | `#3F6E80` | water |
| `--enamel-grain` | `#C4922E` | wheat |
| `--enamel-ore` | `#5E6970` | ore |
| `--enamel-wood` | `#8A5A3A` | wood |

No gradients. The only atmosphere is a 7% noise grain on the table.

## Type

Loaded from Google Fonts (OFL):

- **Fraunces** (optical size 9–144) — names, titles, wordmark. Soft ball terminals, reads like type on a box, not a startup.
- **Commissioner** — UI, body, and all scores. Flared grotesque, tabular lining figures, stays clear at 13px on a phone.

Fallbacks, if the network blocks fonts: Fraunces → Iowan Old Style, Palatino. Commissioner → Avenir Next, Segoe UI. Inter / Roboto / Arial are not in the stack.

| Role | Family | Size / line | Weight | Tracking |
| --- | --- | --- | --- | --- |
| Kicker | Commissioner | 12 / 16 | 600 | 0.08em, uppercase |
| Body | Commissioner | 16 / 24 | 500 | 0 |
| Secondary | Commissioner | 13 / 18 | 500 | 0 |
| List name | Fraunces | 18 / 22 | 560 | -0.02em |
| H1 | Fraunces | 32 / 34 | 560 | -0.03em |
| H2 on slip | Fraunces | 22 / 26 | 560 | -0.02em |
| Wordmark | Fraunces | 20 / 24 | 560 | -0.02em |
| Average (tabla) | Commissioner | 28 / 28 | 700 | tabular lining |
| VP on the row | Fraunces | 40 / 40 | 560 | tabular lining |
| Winner name | Fraunces | 48 / 48, 64 / 64 from 400px | 650 | -0.035em |
| Dock label | Commissioner | 11 / 13, 15 / 20 from 960px | 600 | 0.01em |

Scores always set `font-variant-numeric: lining-nums tabular-nums`.

Inputs are 16px so iOS does not zoom.

## Space

Base unit 4px.

| Token | px | Use |
| --- | --- | --- |
| s1 | 4 | Icon gap, pip gap |
| s2 | 8 | Label to control, row internals |
| s3 | 12 | Related stacks, gap between game slips |
| s4 | 16 | Page inset mobile, slip padding inline |
| s5 | 20 | Slip padding bottom |
| s6 | 24 | Page inset from 720px, section gap |
| s7 | 32 | Break between home blocks |
| s8 | 40 | — reserved |
| s9 | 48 | Minimum touch target |
| s10 | 64 | Dock height, winner score block |

Radius is **2px** on slips, fields, and buttons. Not pills.

## Surfaces and states

- One paper slip per task. Rows inside it, separated by `--rule` hairlines. Do not wrap every row in its own shadow.
- Notes such as the mock warning sit on the walnut (foam-dim text, lamp rule). They are not a second paper card.
- Game archive: one flat slip per partida, 12px apart, **no** drop shadow.
- Shadow is allowed once: the open score slip may use `0 10px 24px rgba(0,0,0,.22)` so it sits on the table. Nothing else shadows.
- Primary button: lamp fill, ink text, min-height 48px, padding 12px 16px, weight 600. Pressed: `--lamp-press` and `translateY(1px)`.
- Quiet button: transparent, ink text, 1px ink border.
- Danger: brick text, 1px brick border, or brick fill with foam text for the confirm action only.
- Disabled: opacity 0.42, no press motion.
- Focus: 2px solid `--sea`, offset 2px. Never removed.
- Selected player chip: ink fill, paper text. Unselected: transparent, ink border.
- Focused score row: inset 2px lamp line.
- Leader row: inset 3px lamp line on the left edge.
- Win pip: brick fill, foam numeral. Other pips: paper-2 fill, ink numeral.

## Layout

- Mobile first. Content column max 720px. Score entry max 840px.
- Below 960px: sticky top bar + fixed bottom dock (Mesa, Tabla, Anotar, Archivo, Más). Dock height 64px plus safe-area inset. Anotar is lamp-filled, not a floating circle.
- From 960px: the dock becomes a left rail, 212px, and the five extra destinations (Temporadas, Histórico, Estadísticas, Jugadores, Reglas) join it. “Más” hides.
- Sticky save bar sits 64px above the dock (0 on desktop) so the thumb can confirm without covering the numpad.
- Numpad is a 3-column grid. Keys are **48px** tall (the touch floor). 56px keys plus five rows buried the player list on a 700px-tall phone, so 48px is the locked size. Gap 8px.
- While a partida is being anotada on a phone, the dock hides. The numpad stays hidden until at least one player is marked, so “¿Quién jugó?” is the first thing on screen. After that, the composer (numpad + Guardar) fixes to the bottom. From 960px the rail stays, the numpad is always in a sticky side column, and the list is not covered.

## Motion

- Press: 120ms, `translateY(1px)` only.
- Winner name: one 360ms rise of 8px, ease `cubic-bezier(.2,.7,.2,1)`, once.
- `prefers-reduced-motion: reduce` kills both. No scroll-jacking, no looping boats, no chart replay.

## Copy

Spanish, as spoken at this table. Short, specific, no marketing verbs (desbloquear, potenciar, experiencia).

Product words that stay: PV, Score Amigos, temporada, partida, paliza.

## Components (reuse — do not restyle per page)

`kicker`, `h1`, `lede`, `slip`, `dot`, `board-row`, `entry-row`, `pad`, `chip`, `btn`, `btn-quiet`, `btn-danger`, `banner`, `toast`, `fact`, `pip`, `stats` dl, dialog.

Pilot screens that define the system: Anotar, La tabla, Ganó la partida. Every later screen uses the same tokens and components.
