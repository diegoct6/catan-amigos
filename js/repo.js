// Live reads/writes use the existing public Supabase client.
// Mock mode never calls the network and never writes production.
// This file does not change schema, RLS, auth settings, or env.

import {FIXTURE} from "./fixtures.js";
import {normalizeModel} from "./domain.js";

export const SUPABASE_URL = "https://rejeouhijlpimnwxyxjp.supabase.co";
export const SUPABASE_KEY = "sb_publishable_YpZvFglWUEW_iM1XzEHz4Q_SsuIsFrg";

export function mockModel() {
  return normalizeModel(structuredClone(FIXTURE.seasons), structuredClone(FIXTURE.players), structuredClone(FIXTURE.games));
}

function renorm(M) {
  return normalizeModel(M.seasons, M.players, M.games);
}

async function fetchAll(db) {
  const [seasons, players, games] = await Promise.all([
    db.from("seasons").select("*").order("name"),
    db.from("players").select("*").order("name"),
    db.from("games").select("id,legacy_id,season_id,played_at,player_count,game_results(position,player_id,victory_points,players(name))").order("played_at", {ascending: true}).limit(2000)
  ]);
  if (seasons.error) throw seasons.error;
  if (players.error) throw players.error;
  if (games.error) throw games.error;
  const mapped = (games.data || []).map((g) => ({
    id: g.id,
    legacyId: g.legacy_id,
    seasonId: g.season_id,
    date: g.played_at,
    playerCount: g.player_count,
    results: (g.game_results || []).map((x) => ({
      playerId: x.player_id,
      position: x.position,
      vp: x.victory_points
    }))
  }));
  return normalizeModel(seasons.data || [], players.data || [], mapped);
}

export async function connectLive() {
  const {createClient} = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {persistSession: true, detectSessionInUrl: true, autoRefreshToken: true}
  });
  const M = await Promise.race([
    fetchAll(db),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase no respondió a tiempo")), 12000))
  ]);
  return {mode: "live", db, M};
}

export async function reloadLive(db) {
  return fetchAll(db);
}

function nextId(rows) {
  return Math.max(0, ...rows.map((r) => Number(r.id) || 0)) + 1;
}

export const api = {
  async createPlayer(ctx, name) {
    if (ctx.mode !== "live") {
      if (ctx.M.players.some((p) => p.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"))) {
        throw new Error("Ese jugador ya está en la mesa.");
      }
      const row = {id: nextId(ctx.M.players), name};
      ctx.M.players.push(row);
      ctx.M = renorm(ctx.M);
      return row;
    }
    const r = await ctx.db.from("players").insert({name}).select("*").single();
    if (r.error) throw r.error;
    return r.data;
  },
  async createSeason(ctx, name) {
    if (ctx.mode !== "live") {
      if (ctx.M.seasons.some((s) => s.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"))) {
        const err = new Error("Ya existe una temporada con ese nombre.");
        err.code = "23505";
        throw err;
      }
      const row = {id: nextId(ctx.M.seasons), name, isActive: true, start: null, end: null};
      ctx.M.seasons.push(row);
      ctx.M = renorm(ctx.M);
      return row;
    }
    const r = await ctx.db.from("seasons").insert({name, is_active: true}).select("*").single();
    if (r.error) throw r.error;
    return r.data;
  },
  async createGame(ctx, g) {
    if (ctx.mode !== "live") {
      const id = nextId(ctx.M.games);
      ctx.M.games.push({
        id,
        legacyId: null,
        seasonId: g.seasonId,
        date: g.date,
        playerCount: g.results.length,
        results: g.results.map((x) => ({playerId: x.playerId, position: x.position, vp: x.vp}))
      });
      ctx.M = renorm(ctx.M);
      return id;
    }
    const r = await ctx.db.rpc("record_game", {
      p_season_id: g.seasonId,
      p_played_at: g.date,
      p_results: g.results.map((x) => ({player_id: x.playerId, position: x.position, victory_points: x.vp}))
    });
    if (r.error) throw r.error;
    return r.data;
  },
  async updateGame(ctx, id, g) {
    if (ctx.mode !== "live") {
      const game = ctx.M.games.find((x) => x.id == id);
      if (!game) throw new Error("Partida no encontrada");
      game.seasonId = g.seasonId;
      game.date = g.date;
      game.playerCount = g.results.length;
      game.results = g.results.map((x) => ({playerId: x.playerId, position: x.position, vp: x.vp}));
      ctx.M = renorm(ctx.M);
      return id;
    }
    const u = await ctx.db.from("games").update({
      season_id: g.seasonId,
      played_at: g.date,
      player_count: g.results.length
    }).eq("id", id);
    if (u.error) throw u.error;
    const d = await ctx.db.from("game_results").delete().eq("game_id", id);
    if (d.error) throw d.error;
    const i = await ctx.db.from("game_results").insert(g.results.map((x) => ({
      game_id: id,
      player_id: x.playerId,
      position: x.position,
      victory_points: x.vp
    })));
    if (i.error) throw i.error;
    return id;
  },
  async deleteGame(ctx, id) {
    if (ctx.mode !== "live") {
      ctx.M.games = ctx.M.games.filter((g) => g.id != id);
      ctx.M = renorm(ctx.M);
      return;
    }
    const r = await ctx.db.from("games").delete().eq("id", id);
    if (r.error) throw r.error;
  },
  async deleteSeason(ctx, id) {
    if (ctx.mode !== "live") {
      ctx.M.seasons = ctx.M.seasons.filter((s) => s.id != id);
      ctx.M.games = ctx.M.games.filter((g) => g.seasonId != id);
      ctx.M = renorm(ctx.M);
      return;
    }
    const r = await ctx.db.rpc("delete_season", {p_season_id: id});
    if (r.error) throw r.error;
  }
};
