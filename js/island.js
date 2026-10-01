/**
 * Home island load.
 * Lead 80ms, then each hex 180ms after the previous, drop 720ms with a landing bounce.
 * Last hex settles at introSettleMs() (4040ms for 19 tiles).
 * The boat glides behind during that window, then one 5200ms pass in front, then it leaves.
 * prefers-reduced-motion skips this and paints the settled board.
 */

export const INTRO = {
  hexes: 19,
  leadMs: 80,
  staggerMs: 180,
  dropMs: 720,
  frontMs: 5200
};

export const FRAME = {x: 160, y: 8, w: 640, h: 552};

const HEX = "0,-58 50,-29 50,29 0,58 -50,29 -50,-29";

const TILES = [
  [380, 96, "wood", "2"],
  [480, 96, "grain", "9"],
  [580, 96, "wool", "4"],
  [330, 183, "wool", "10"],
  [430, 183, "brick", "6"],
  [530, 183, "wood", "3"],
  [630, 183, "ore", "11"],
  [280, 270, "grain", "8"],
  [380, 270, "ore", "12"],
  [480, 270, "desert", ""],
  [580, 270, "wool", "5"],
  [680, 270, "brick", "9"],
  [330, 357, "brick", "4"],
  [430, 357, "grain", "10"],
  [530, 357, "wood", "6"],
  [630, 357, "ore", "3"],
  [380, 444, "wool", "11"],
  [480, 444, "wood", "8"],
  [580, 444, "grain", "5"]
];

const MARKS = {
  wood: `<path fill="#143C28" d="M-30 12  -16-20  -2 12h-6l8 14h-22l8-14z"/><path fill="#143C28" d="M2 8 16-24 30 8h-7l8 14H0l8-14z"/><path fill="#184830" d="M-8 16 2-4 12 16H8l4 8H-12l4-8z"/><path stroke="#8A5A3A" stroke-width="3.4" stroke-linecap="round" d="M-16 14v9M18 10v9"/>`,
  grain: `<path d="M-50 18H50V58H-50Z" fill="#D9A41E" opacity=".55"/><g fill="none" stroke-linecap="round"><g stroke="#A56B12" stroke-width="1.8"><path d="M-16 22V-6M0 24V-16M16 22V-2"/></g><g stroke="#FFF6D0" stroke-width="1.5"><path d="M-16 -6  -22 -14M-16 -2 -10 -10M0 -16 -6 -24M0 -10 6 -18M16 -2 10 -10M16 4 22 -4"/></g><g fill="#FFF3C4" stroke="none"><ellipse cx="-16" cy="-12" rx="3" ry="6.5"/><ellipse cx="0" cy="-20" rx="3.2" ry="7"/><ellipse cx="16" cy="-8" rx="3" ry="6"/></g></g>`,
  wool: `<g stroke="#5E7A38" stroke-width="1.5" fill="none" stroke-linecap="round"><path d="M-30 16c6-8 10-8 14 0M-8 18c5-7 9-7 13 0M12 16c5-8 10-8 16 0"/></g><g fill="#F7F1E4"><g transform="translate(-12 2)"><ellipse cx="0" cy="0" rx="13" ry="8"/><circle cx="11" cy="-2" r="6"/><circle cx="15" cy="-6" r="2"/><circle cx="13" cy="-2" r=".9" fill="#2A2118"/><path d="M-7 7v6M-1 7v6M5 7v6" stroke="#E4D3B4" stroke-width="2"/></g><g transform="translate(14 10) scale(.78)"><ellipse cx="0" cy="0" rx="13" ry="8"/><circle cx="11" cy="-2" r="6"/><circle cx="15" cy="-6" r="2"/><circle cx="13" cy="-2" r=".9" fill="#2A2118"/><path d="M-7 7v6M-1 7v6M5 7v6" stroke="#E4D3B4" stroke-width="2"/></g></g>`,
  brick: `<g fill="#C83A30" stroke="#6E120E" stroke-width="1.2">${brickRows()}</g>`,
  ore: `<path fill="#3A454C" d="M-38 22-20 -2-8 10 2-20 16 4 28-10 40 22Z"/><path fill="#E4E7E0" d="M-26 2-20-8-12 4ZM-2-4 2-20 8-2ZM22 0 28-10 34 2Z"/><path fill="#2C353B" d="M-6 22 2 4 12 22Z"/>`,
  desert: `<path d="M-50 20H50V58H-50Z" fill="#C9A15E" opacity=".4"/><g fill="none" stroke="#A8843E" stroke-width="2.2" stroke-linecap="round"><path d="M-32 4Q-6 -12 20 4"/><path d="M-26 16Q4 2 32 16"/><path d="M-18 26Q8 16 34 26"/></g><circle cx="20" cy="-16" r="5.5" fill="#F6E7C2"/><circle cx="-18" cy="-6" r="1.3" fill="#F3E2B8"/><circle cx="2" cy="2" r="1.1" fill="#F3E2B8"/><circle cx="-8" cy="10" r="1.2" fill="#F3E2B8"/>`
};

function brickRows() {
  let out = "";
  for (let r = 0; r < 5; r++) {
    const y = -28 + r * 12;
    const shift = r % 2 ? -12 : 0;
    for (let c = -2; c <= 2; c++) {
      out += `<rect x="${shift + c * 24 - 11}" y="${y}" width="22" height="10"/>`;
    }
  }
  return out;
}

export function introSettleMs(count = INTRO.hexes) {
  return INTRO.leadMs + Math.max(0, count - 1) * INTRO.staggerMs + INTRO.dropMs;
}

function art(kind, i) {
  const flip = i % 2 ? -1 : 1;
  const dx = (i % 3) - 1;
  return `<g transform="translate(${dx} 0) scale(${flip} 1)">${MARKS[kind]}</g>`;
}

function token(num) {
  if (!num) return "";
  const hot = num === "6" || num === "8" ? " is-hot" : "";
  return `<circle class="number-disc" cx="0" cy="2" r="12"/><text class="number-text${hot}" x="0" y="3">${num}</text>`;
}

function tile([x, y, kind, num], i) {
  return `<g transform="translate(${x} ${y})"><g class="hex-tile" style="--i:${i}"><defs><clipPath id="hex-${i}" clipPathUnits="userSpaceOnUse"><polygon points="${HEX}"/></clipPath></defs><polygon class="hex-shadow" points="${HEX}" transform="translate(0 4)"/><polygon class="tile-face tile-${kind}" points="${HEX}"/><g clip-path="url(#hex-${i})">${art(kind, i)}${token(num)}</g><polygon class="hex-rim" points="${HEX}"/></g></g>`;
}

function boat() {
  return `<g class="island-boat" transform="translate(760 52) rotate(2 90 455)"><g class="boat-bob"><g class="boat-wake" fill="none" stroke="#d6eee5" stroke-width="2.6"><path d="M10 484q40-10 80 0t80 0m-142 12q33-8 66 0t66 0"/></g><path d="M41 456h96l-14 22H56z" fill="#744a30" stroke="#e5c790" stroke-width="2"/><path d="M56 460h72m-58 8h45" stroke="#cba36d" stroke-width="1.8"/><path d="M90 455v-42" stroke="#e6d5b0" stroke-width="3.4"/><path d="M87 417l-24 34h24z" fill="#fff0ce" stroke="#634a32" stroke-width="1.7"/><path d="M96 421l30 30H96z" fill="#dcc99e" stroke="#634a32" stroke-width="1.7"/><path d="M91 407l16 7-16 7z" fill="#c63d30"/></g></g>`;
}

function robber() {
  return `<g class="robber-in" transform="translate(480 270)"><g class="robber-hop"><ellipse class="robber-shadow" cx="0" cy="13" rx="7" ry="2.5"/><path class="robber-body" d="M-4 8q-3-8-1-14l-3-5 8 2 8-3-3 7q2 7 0 13z"/><path class="robber-body" d="M-6-10q0-9 6-10 7 2 7 10L0-13z"/><path class="robber-glint" d="M-2-7h4m-2 0v11"/></g></g>`;
}

export function islandMarkup({settled = false} = {}) {
  const mode = settled ? "is-settled" : "is-intro";
  const intro = settled ? "open" : "lock";
  const {x, y, w, h} = FRAME;
  return `<div class="island-world ${mode}" data-intro="${intro}" data-settle-ms="${introSettleMs()}" data-front-ms="${INTRO.frontMs}" style="--vw:${w};--vh:${h};--lead:${INTRO.leadMs}ms;--stagger:${INTRO.staggerMs}ms;--drop:${INTRO.dropMs}ms" aria-hidden="true"><svg class="island-svg" viewBox="${x} ${y} ${w} ${h}" pointer-events="none"><defs><pattern id="wave-lines" width="140" height="72" patternUnits="userSpaceOnUse"><path d="M0 18q30-10 60 0t60 0M-24 48q30-10 60 0t60 0" fill="none" stroke="#C5E4DC" stroke-width="1.6"/></pattern></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#143848"/><rect x="${x}" y="468" width="${w}" height="92" fill="#1E5670"/><rect class="water-grain" x="${x}" y="${y}" width="${w}" height="${h}"/><ellipse cx="480" cy="292" rx="250" ry="186" fill="#0E2A36" opacity=".42"/><g class="map-cloud" fill="#F6F0DF" opacity=".28"><ellipse cx="280" cy="52" rx="72" ry="12"/><ellipse cx="312" cy="44" rx="28" ry="15"/></g><g class="map-cloud alt" fill="#F6F0DF" opacity=".2"><ellipse cx="640" cy="70" rx="84" ry="11"/><ellipse cx="674" cy="62" rx="30" ry="14"/></g>${boat()}<g class="island-board">${TILES.map(tile).join("")}${robber()}</g></svg></div>`;
}

let phase = "idle";
let run = 0;

export function noteIslandRoute(name) {
  if (name !== "mesa") {
    phase = "idle";
    run += 1;
  }
}

export function islandIsSettled(reduceMotion) {
  return !!reduceMotion || phase === "done";
}

function sample(keys, u) {
  let i = 1;
  while (i < keys.length - 1 && keys[i].t < u) i += 1;
  const a = keys[i - 1];
  const b = keys[i];
  const f = Math.min(1, Math.max(0, (u - a.t) / (b.t - a.t || 1)));
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    r: a.r + (b.r - a.r) * f
  };
}

function boatKeys() {
  const settle = introSettleMs();
  const total = settle + INTRO.frontMs;
  const s = settle / total;
  const front = 1 - s;
  return {
    total,
    settle,
    keys: [
      {t: 0, x: 760, y: 52, r: 2},
      {t: s, x: -50, y: 46, r: -1.6},
      {t: s + front * 0.16, x: 140, y: 18, r: -0.3},
      {t: s + front * 0.68, x: 470, y: -32, r: 0.8},
      {t: 1, x: 990, y: -6, r: 1.7}
    ]
  };
}

export function mountIslandIntro(reduceMotion) {
  const world = document.querySelector(".island-world");
  if (!world) return;
  if (reduceMotion || phase === "done") {
    phase = "done";
    world.classList.remove("is-intro", "is-front");
    world.classList.add("is-settled");
    world.dataset.intro = "open";
    return;
  }
  const token = ++run;
  phase = "playing";
  const boatEl = world.querySelector(".island-boat");
  const board = world.querySelector(".island-board");
  const tiles = world.querySelectorAll(".hex-tile");
  const last = tiles[tiles.length - 1];
  const {keys, total, settle} = boatKeys();
  let framed = false;
  let finished = false;

  const toFront = () => {
    if (token !== run || !world.isConnected || framed) return;
    framed = true;
    world.classList.remove("is-intro");
    world.classList.add("is-front");
    if (boatEl && board) board.after(boatEl);
  };

  const finish = () => {
    if (token !== run || finished) return;
    finished = true;
    phase = "done";
    if (!world.isConnected) return;
    world.classList.remove("is-intro", "is-front");
    world.classList.add("is-settled");
    world.dataset.intro = "open";
  };

  let t0 = null;
  const step = (now) => {
    if (token !== run || !boatEl?.isConnected) return;
    const time = (document.timeline && document.timeline.currentTime != null)
      ? document.timeline.currentTime
      : now;
    if (t0 == null) t0 = time;
    const elapsed = time - t0;
    const u = Math.min(1, Math.max(0, elapsed / total));
    const p = sample(keys, u);
    boatEl.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.r.toFixed(2)} 90 455)`);
    if (elapsed >= settle) toFront();
    if (u < 1) requestAnimationFrame(step);
    else finish();
  };
  if (boatEl) requestAnimationFrame(step);

  const onEnd = (ev) => {
    if (ev.target !== last) return;
    toFront();
  };
  last?.addEventListener("animationend", onEnd);
}
