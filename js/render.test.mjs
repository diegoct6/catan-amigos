import assert from "node:assert/strict";
import {FIXTURE} from "./fixtures.js";
import {normalizeModel, entryError} from "./domain.js";
import {fragments, render, shareText} from "./render.js";

const M = normalizeModel(FIXTURE.seasons, FIXTURE.players, FIXTURE.games);
const state = {season: 2, f: 2, mode: "mock", triedSave: false, adminUser: null, mockAdmin: false, justSaved: 0};
const base = {M, state, F: null, focusPid: null};

const home = render({name: "mesa"}, base);
assert.match(home, /Anotar partida/);
assert.match(home, /data-screen="mesa"/);
assert.doesNotMatch(home, /Inter|Poppins|Space Grotesk|glass|linear-gradient/i);

const tabla = render({name: "tabla"}, base);
assert.match(tabla, /David Rubio/);
assert.match(tabla, /1,55/);
assert.match(tabla, /La tabla/);

const g1 = M.games.find((g) => g.id === 1);
const reveal = render({name: "revelar", id: 1}, {...base, state: {...state, justSaved: 1}});
assert.match(reveal, /Diego Cuartas/);
assert.match(reveal, /Ver la tabla/);
assert.match(shareText(M, g1), /Diego Cuartas ganó/);

const F = {id: 0, seasonId: 2, date: "2026-10-01", rows: [{pid: 1, vp: "10"}, {pid: 4, vp: "8"}, {pid: 3, vp: "7"}], tie: {}};
assert.equal(entryError(F), "");
const bits = fragments({M, state, F, focusPid: 1});
assert.match(bits.hint, /Gana Camila Espinosa/);
assert.match(bits.hint, /2,00/);
assert.match(bits.projection, /La tabla si la guardas/);
assert.equal(bits.saveDisabled, false);

const tie = fragments({
  M, state, focusPid: 1,
  F: {id: 0, seasonId: 2, date: "2026-10-01", rows: [{pid: 1, vp: "10"}, {pid: 4, vp: "10"}, {pid: 3, vp: "6"}], tie: {}}
});
assert.match(tie.ties, /Empate a 10 PV/);
assert.match(tie.hint, /Empate/);
assert.equal(tie.saveDisabled, true);

const empty = render({name: "mesa"}, {M: {seasons: [], players: [], games: []}, state: {...state, season: null}, F: null, focusPid: null});
assert.match(empty, /No hay temporadas/);

console.log("render ok");
