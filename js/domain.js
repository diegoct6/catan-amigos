// Scoring and standings. Same rules as the production page and supabase/schema.sql.
// Score Amigos = (players − finishing position) × multiplier.
// 3 → 1.0, 4 → 1.2, 5 → 1.3, 6 → 1.5. Last place is 0.

export const MULT = {3: 1, 4: 1.2, 5: 1.3, 6: 1.5};
export const ENAMELS = ["brick", "wool", "water", "grain", "ore", "wood"];

export function scoreAmigos(n, pos) {
  return +((n - pos) * MULT[n]).toFixed(2);
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

export function fx(v, d = 1) {
  return (+v).toFixed(d).replace(".", ",");
}

export function f(v) {
  return String(+(+v).toFixed(2)).replace(".", ",");
}

export function pc(v) {
  return fx(v, 0) + "%";
}

export function dm(d) {
  if (!d) return "—";
  return new Date(d + "T12:00").toLocaleDateString("es-ES", {day: "numeric", month: "short"}).replace(".", "");
}

export function rng(s) {
  if (!s || !s.start || !s.end) return "Fechas por definir";
  const a = new Date(s.start + "T12:00");
  const b = new Date(s.end + "T12:00");
  const m = (d) => d.getDate() + " " + d.toLocaleDateString("es-ES", {month: "short"}).replace(".", "").toUpperCase();
  return m(a) + " — " + m(b) + " " + b.getFullYear();
}

export function pname(M, id) {
  return (M.players.find((p) => p.id == id) || {}).name || "?";
}

export function sname(M, id) {
  return (M.seasons.find((s) => s.id == id) || {}).name || "";
}

export function enamel(players, id) {
  const i = Math.max(0, players.findIndex((p) => p.id == id));
  return ENAMELS[i % 6];
}

export function inScope(games, s) {
  return games.filter((g) => !s || g.seasonId == s);
}

export function playerStats(M, pid, s) {
  const rs = inScope(M.games, s).flatMap((g) => g.results.filter((r) => r.playerId == pid).map((r) => {
    const n = g.results.length;
    return {...r, gameId: g.id, seasonId: g.seasonId, date: g.date, n, sa: scoreAmigos(n, r.position)};
  }));
  const k = rs.length;
  const tot = rs.reduce((a, r) => a + r.sa, 0);
  const vpTot = rs.reduce((a, r) => a + (+r.vp || 0), 0);
  const vpBest = rs.reduce((a, r) => Math.max(a, +r.vp || 0), 0);
  return {
    pid,
    name: pname(M, pid),
    k,
    w: rs.filter((r) => r.position == 1).length,
    last: rs.filter((r) => r.position == r.n).length,
    total: tot,
    avg: k ? tot / k : 0,
    pm: k ? rs.reduce((a, r) => a + r.position, 0) / k : 0,
    avgVp: k ? vpTot / k : 0,
    bestVp: vpBest,
    rs
  };
}

export function standings(M, s) {
  return M.players.map((p) => playerStats(M, p.id, s)).filter((x) => x.k)
    .sort((a, b) => b.avg - a.avg || b.k - a.k || b.total - a.total);
}

export function wr(x) {
  return x.k ? 100 * x.w / x.k : 0;
}

export function lr(x) {
  return x.k ? 100 * x.last / x.k : 0;
}

export function biggestWin(M, scope) {
  return inScope(M.games, scope).map((g) => {
    const r = g.results.slice().sort((a, b) => b.vp - a.vp || a.position - b.position);
    if (r.length < 2) return null;
    const margin = Number(r[0].vp) - Number(r[1].vp);
    return margin > 0 ? {
      game: g,
      winner: pname(M, r[0].playerId),
      runner: pname(M, r[1].playerId),
      winnerVp: r[0].vp,
      runnerVp: r[1].vp,
      margin
    } : null;
  }).filter(Boolean).sort((a, b) => b.margin - a.margin || String(a.game.date).localeCompare(String(b.game.date)))[0] || null;
}

export function closestGame(M, scope) {
  const rows = inScope(M.games, scope).map((g) => {
    const R = g.results.slice().sort((a, b) => b.vp - a.vp);
    return {g, diff: R.length > 1 ? Number(R[0].vp) - Number(R[1].vp) : null};
  }).filter((x) => x.diff !== null).sort((a, b) => a.diff - b.diff || String(a.g.date).localeCompare(String(b.g.date)));
  return rows[0] || null;
}

export function resolveResults(rows, tie = {}) {
  const S = rows.filter((r) => r.pid && r.vp !== "" && r.vp != null)
    .map((r) => ({...r, vp: +r.vp}))
    .sort((a, b) => b.vp - a.vp);
  const out = [];
  const ties = [];
  let i = 0;
  while (i < S.length) {
    let j = i;
    while (j + 1 < S.length && S[j + 1].vp === S[i].vp) j++;
    const G = S.slice(i, j + 1);
    if (G.length === 1) out.push({...G[0], pos: i + 1});
    else {
      const lo = i + 1;
      const hi = j + 1;
      const ps = G.map((r) => +tie[r.pid] || 0);
      const ok = ps.every((p) => p >= lo && p <= hi) && new Set(ps).size === G.length;
      ties.push({G, lo, hi, ok});
      G.forEach((r) => out.push({...r, pos: ok ? +tie[r.pid] : null}));
    }
    i = j + 1;
  }
  return {out: out.sort((a, b) => (a.pos || 99) - (b.pos || 99)), ties, ok: ties.every((t) => t.ok)};
}

export function entryError(F) {
  if (!F.seasonId) return "Elige la temporada.";
  if (!F.date) return "Falta la fecha.";
  const n = F.rows.length;
  if (n < 3 || n > 6) return "Tienen que ser entre 3 y 6 jugadores.";
  if (F.rows.some((r) => !r.pid)) return "Elige a todos los que jugaron.";
  if (new Set(F.rows.map((r) => r.pid)).size < F.rows.length) return "Alguien está repetido.";
  if (F.rows.some((r) => r.vp === "" || r.vp == null || +r.vp < 0 || +r.vp > 30 || !Number.isInteger(+r.vp))) {
    return "Faltan los PV de alguien. Números enteros, de 0 a 30.";
  }
  const z = resolveResults(F.rows, F.tie || {});
  if (!z.ok) return "Hay empate en PV. Falta el puesto de cada uno.";
  return "";
}

export function draftFromEntry(F) {
  const err = entryError(F);
  if (err) return null;
  const z = resolveResults(F.rows, F.tie || {});
  return {
    id: F.id || 0,
    seasonId: +F.seasonId,
    date: F.date,
    results: z.out.map((r) => ({playerId: r.pid, position: r.pos, vp: r.vp}))
  };
}

export function withDraft(M, draft) {
  if (!draft) return M;
  const games = M.games.filter((g) => g.id !== draft.id);
  games.push({
    id: draft.id || 0,
    seasonId: draft.seasonId,
    date: draft.date,
    playerCount: draft.results.length,
    results: draft.results,
    draft: true
  });
  return {...M, games};
}

export function cumulativeAvg(stats) {
  let total = 0;
  return stats.rs.map((r, i) => (total += r.sa) / (i + 1));
}

export function normalizeModel(seasons, players, games) {
  const S = seasons.map((s) => ({
    id: s.id,
    name: s.name,
    start: s.start || s.start_date || null,
    end: s.end || s.end_date || null,
    isActive: !!(s.isActive ?? s.is_active)
  }));
  const P = players.map((p) => ({id: p.id, name: p.name})).sort((a, b) => a.name.localeCompare(b.name, "es"));
  const G = games.map((g) => ({
    id: g.id,
    legacyId: g.legacyId ?? g.legacy_id ?? null,
    seasonId: g.seasonId ?? g.season_id,
    date: g.date ?? g.played_at,
    playerCount: g.playerCount ?? g.player_count ?? (g.results || []).length,
    results: (g.results || []).map((r) => ({
      playerId: r.playerId ?? r.player_id,
      position: r.position,
      vp: r.vp ?? r.victory_points
    })).sort((a, b) => a.position - b.position)
  }));
  for (const s of S) {
    const dates = G.filter((g) => g.seasonId == s.id).map((g) => g.date).filter(Boolean).sort();
    if (!s.start) s.start = dates[0] || null;
    if (!s.end) s.end = dates[dates.length - 1] || null;
  }
  G.sort((x, y) => x.date < y.date ? -1 : x.date > y.date ? 1 : Number(x.id) - Number(y.id));
  return {seasons: S, players: P, games: G};
}
