import assert from "node:assert/strict";
import {FIXTURE} from "./fixtures.js";
import {
  scoreAmigos, esc, resolveResults, entryError, draftFromEntry, withDraft,
  standings, biggestWin, closestGame, normalizeModel, playerStats
} from "./domain.js";

const cases = [
  [3, 1, 2], [3, 2, 1], [3, 3, 0],
  [4, 1, 3.6], [4, 2, 2.4], [4, 3, 1.2], [4, 4, 0],
  [5, 1, 5.2], [5, 2, 3.9], [5, 3, 2.6], [5, 4, 1.3], [5, 5, 0],
  [6, 1, 7.5], [6, 2, 6], [6, 3, 4.5], [6, 4, 3], [6, 5, 1.5], [6, 6, 0]
];
for (const [n, pos, expect] of cases) {
  assert.equal(scoreAmigos(n, pos), expect, `${n} players pos ${pos}`);
}

assert.equal(esc(`<Camila & "Diego">`), "&lt;Camila &amp; &quot;Diego&quot;&gt;");

const M = normalizeModel(FIXTURE.seasons, FIXTURE.players, FIXTURE.games);
assert.equal(M.games.length, 73);
assert.equal(M.games.reduce((a, g) => a + g.results.length, 0), 258);
for (const g of M.games) {
  const positions = g.results.map((r) => r.position).sort((a, b) => a - b);
  assert.deepEqual(positions, Array.from({length: g.playerCount}, (_, i) => i + 1), "positions " + g.id);
  for (const r of g.results) {
    assert.equal(scoreAmigos(g.playerCount, r.position), +((g.playerCount - r.position) * {3: 1, 4: 1.2, 5: 1.3, 6: 1.5}[g.playerCount]).toFixed(2));
  }
}

const g1 = M.games.find((g) => g.legacyId === 1);
const diego = g1.results.find((r) => r.playerId === 4);
assert.equal(diego.position, 1);
assert.equal(scoreAmigos(4, diego.position), 3.6);

const s1 = standings(M, 1);
const s2 = standings(M, 2);
const all = standings(M, 0);
assert.ok(s1.length >= 3 && s2.length >= 3 && all.length === 5);
for (const table of [s1, s2, all]) {
  for (let i = 1; i < table.length; i++) {
    const a = table[i - 1];
    const b = table[i];
    assert.ok(a.avg > b.avg || (a.avg === b.avg && a.k >= b.k));
  }
}
assert.ok(biggestWin(M, 0).margin > 0);
assert.ok(closestGame(M, 2));
assert.equal(closestGame(M, 2).diff >= 0, true);

const tieRows = [
  {pid: 1, vp: "10"},
  {pid: 2, vp: "10"},
  {pid: 3, vp: "7"}
];
let z = resolveResults(tieRows, {});
assert.equal(z.ok, false);
assert.equal(z.ties.length, 1);
assert.equal(z.ties[0].lo, 1);
assert.equal(z.ties[0].hi, 2);
z = resolveResults(tieRows, {1: 2, 2: 2});
assert.equal(z.ok, false);
z = resolveResults(tieRows, {1: 1, 2: 2});
assert.equal(z.ok, true);
assert.deepEqual(z.out.map((r) => [r.pid, r.pos]), [[1, 1], [2, 2], [3, 3]]);

const F = {id: 0, seasonId: 2, date: "2026-10-01", rows: [{pid: 1, vp: "10"}, {pid: 4, vp: "8"}, {pid: 3, vp: "6"}], tie: {}};
assert.equal(entryError(F), "");
assert.equal(entryError({...F, rows: F.rows.slice(0, 2)}), "Tienen que ser entre 3 y 6 jugadores.");
const before = playerStats(M, 1, 2).avg;
const draft = draftFromEntry(F);
const after = playerStats(withDraft(M, draft), 1, 2);
assert.equal(after.k, playerStats(M, 1, 2).k + 1);
assert.ok(after.avg !== before);

console.log("domain ok", {
  season1: s1.map((x) => [x.name, +x.avg.toFixed(2), x.k, x.w]),
  season2: s2.map((x) => [x.name, +x.avg.toFixed(2), x.k, x.w]),
  all: all.map((x) => [x.name, +x.avg.toFixed(2), x.k]),
  blowout: biggestWin(M, 0),
  closest: closestGame(M, 2) && {diff: closestGame(M, 2).diff, date: closestGame(M, 2).g.date}
});
