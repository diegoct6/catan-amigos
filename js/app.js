import {draftFromEntry, entryError, esc, inScope, dm} from "./domain.js";
import {fragments, render, shareText} from "./render.js";
import {api, connectLive, mockModel, reloadLive} from "./repo.js";

const DRAFT_KEY = "ca-draft-v1";
const params = new URLSearchParams(location.search);
const forcedMock = params.get("mock") === "1";
const forcedLive = params.get("live") === "1";

const state = {
  season: null,
  f: 0,
  mode: "mock",
  triedSave: false,
  adminUser: null,
  mockAdmin: false,
  justSaved: 0,
  pendingDelete: 0,
  pendingSeason: 0
};

let ctx = {mode: "mock", db: null, M: {seasons: [], players: [], games: []}};
let F = null;
let focusPid = null;
let formKey = "";
let authBound = false;
let toastTimer = 0;
let lastRoute = "";

const $ = (id) => document.getElementById(id);
const viewCtx = () => ({M: ctx.M, state, F, focusPid});

function today() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function parseRoute() {
  const raw = (location.hash || "#/").replace(/^#\/?/, "");
  const [name, id] = raw.split("/");
  const known = ["tabla", "registrar", "editar", "partidas", "revelar", "temporadas", "historico", "estadisticas", "jugadores", "jugador", "reglas", "mas"];
  return {name: known.includes(name) ? name : "mesa", id: +id || 0};
}

function isAdmin() {
  if (ctx.mode === "mock" && state.mockAdmin) return true;
  return !!(state.adminUser && state.adminUser.app_metadata && state.adminUser.app_metadata.role === "admin");
}

function toast(m) {
  const t = $("toast");
  t.hidden = false;
  t.textContent = m;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
}

function setStatus(kind, text) {
  const el = $("status");
  if (!el) return;
  el.classList.toggle("is-live", kind === "live");
  el.classList.toggle("is-off", kind === "off");
  el.innerHTML = `<i></i>${esc(text)}`;
}

function ensureSeason() {
  if (!ctx.M.seasons.some((s) => s.id == state.season)) {
    state.season = ctx.M.seasons.find((s) => s.isActive)?.id || ctx.M.seasons[0]?.id || null;
  }
  if (state.f !== 0 && !ctx.M.seasons.some((s) => s.id == state.f)) state.f = state.season || 0;
}

function blankForm() {
  return {
    id: 0,
    seasonId: state.season || ctx.M.seasons.find((s) => s.isActive)?.id || ctx.M.seasons[0]?.id || 0,
    date: today(),
    rows: [],
    tie: {}
  };
}

function fromGame(g) {
  const rows = g.results.slice().sort((a, b) => a.position - b.position).map((r) => ({
    pid: r.playerId,
    vp: r.vp == null ? "" : String(r.vp)
  }));
  const tie = {};
  const groups = new Map();
  for (const r of g.results) {
    const k = String(r.vp);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  for (const group of groups.values()) {
    if (group.length > 1) group.forEach((r) => { tie[r.playerId] = r.position; });
  }
  return {id: g.id, seasonId: g.seasonId, date: g.date, rows, tie};
}

function readDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !Array.isArray(d.rows)) return null;
    const ids = new Set(ctx.M.players.map((p) => p.id));
    return {
      id: 0,
      seasonId: +d.seasonId || state.season || 0,
      date: d.date || today(),
      rows: d.rows.filter((r) => ids.has(r.pid)).map((r) => ({pid: r.pid, vp: r.vp == null ? "" : String(r.vp)})),
      tie: d.tie || {}
    };
  } catch {
    return null;
  }
}

function persist() {
  if (!F || F.id) return;
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({seasonId: F.seasonId, date: F.date, rows: F.rows, tie: F.tie})); }
  catch { /* private mode */ }
}

function syncForm(route) {
  if (route.name !== "registrar" && route.name !== "editar") return;
  const key = route.name === "editar" ? `e${route.id}` : "new";
  if (key === formKey && F) return;
  formKey = key;
  state.triedSave = false;
  if (route.name === "editar") {
    const g = ctx.M.games.find((x) => x.id == route.id);
    F = g ? fromGame(g) : null;
  } else F = readDraft() || blankForm();
  focusPid = F?.rows.find((r) => r.vp === "")?.pid || F?.rows[0]?.pid || null;
}

function syncNav(route) {
  const desk = matchMedia("(min-width: 960px)").matches;
  const groups = {
    mesa: ["mesa"],
    tabla: ["tabla"],
    anotar: ["registrar", "editar"],
    archivo: ["partidas", "revelar"],
    mas: desk ? ["mas"] : ["mas", "temporadas", "historico", "estadisticas", "jugadores", "jugador", "reglas"],
    temporadas: ["temporadas"],
    historico: ["historico"],
    estadisticas: ["estadisticas"],
    jugadores: ["jugadores", "jugador"],
    reglas: ["reglas"]
  };
  document.querySelectorAll("[data-nav]").forEach((a) => {
    a.classList.toggle("is-on", (groups[a.dataset.nav] || []).includes(route.name));
    if (route.name === "mesa" && a.dataset.nav === "mesa") a.classList.add("is-on");
  });
}

function syncSeason() {
  const sel = $("seg");
  if (!sel) return;
  sel.innerHTML = ctx.M.seasons.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
  if (state.season != null) sel.value = String(state.season);
}

function refreshScore() {
  if (!F) return;
  const f = fragments(viewCtx());
  const put = (id, html) => {
    const n = $(id);
    if (n) n.innerHTML = html;
  };
  put("chips", f.chips);
  put("count", f.count);
  put("entry", f.entry);
  put("ties", f.ties);
  put("preview", f.preview);
  put("projection", f.projection);
  const hint = $("save-hint");
  if (hint) hint.textContent = f.hint;
  const err = $("entry-err");
  if (err) err.textContent = f.err;
  const btn = $("save-btn");
  if (btn) {
    btn.disabled = f.saveDisabled;
    btn.textContent = f.saveLabel;
  }
  document.body.classList.toggle("is-keypad", document.body.classList.contains("is-scoring") && !!(F && F.rows.length));
}

function paint(reset) {
  const route = parseRoute();
  syncForm(route);
  const scoring = route.name === "registrar" || route.name === "editar";
  document.body.classList.toggle("is-scoring", scoring);
  document.body.classList.toggle("is-keypad", scoring && !!(F && F.rows.length));
  const y = window.scrollY;
  $("app").innerHTML = render(route, viewCtx());
  syncNav(route);
  syncSeason();
  const key = `${route.name}/${route.id}`;
  if (reset || key !== lastRoute) window.scrollTo(0, 0);
  else window.scrollTo(0, y);
  lastRoute = key;
}

function report(e) {
  const msg = (e && e.message) || "No se pudo completar.";
  if (ctx.mode === "live" && (!navigator.onLine || /fetch|network|Failed|tiempo/i.test(msg))) setStatus("off", "Sin conexión");
  toast(msg);
}

async function afterLiveWrite() {
  if (ctx.mode === "live") ctx.M = await reloadLive(ctx.db);
}

function focusedRow() {
  if (!F?.rows.length) return null;
  if (!focusPid) focusPid = F.rows[0].pid;
  return F.rows.find((r) => r.pid == focusPid) || null;
}

function pushDigit(d) {
  const row = focusedRow();
  if (!row) { toast("Primero elige quién jugó."); return; }
  const cur = row.vp === "" || row.vp == null ? "" : String(row.vp);
  let next = cur + String(d);
  if (next.length > 2) next = String(d);
  if (+next > 30) return;
  row.vp = String(+next);
  if (next.length === 2) {
    const idx = F.rows.findIndex((r) => r.pid == row.pid);
    const nxt = F.rows.slice(idx + 1).find((r) => r.vp === "" || r.vp == null);
    if (nxt) focusPid = nxt.pid;
  }
  state.triedSave = false;
  persist();
  refreshScore();
}

function bump(delta) {
  const row = focusedRow();
  if (!row) { toast("Primero elige quién jugó."); return; }
  const d = +delta;
  const v = row.vp === "" || row.vp == null ? (d > 0 ? 1 : 0) : Math.min(30, Math.max(0, +row.vp + d));
  row.vp = String(v);
  state.triedSave = false;
  persist();
  refreshScore();
}

function backspace() {
  const row = focusedRow();
  if (!row || row.vp === "" || row.vp == null) return;
  const next = String(row.vp).slice(0, -1);
  row.vp = next;
  state.triedSave = false;
  persist();
  refreshScore();
}

function togglePlayer(id) {
  id = +id;
  const i = F.rows.findIndex((r) => r.pid == id);
  if (i >= 0) {
    F.rows.splice(i, 1);
    delete F.tie[id];
    if (focusPid == id) focusPid = F.rows[0]?.pid || null;
  } else if (F.rows.length < 6) {
    F.rows.push({pid: id, vp: ""});
    focusPid = id;
  }
  state.triedSave = false;
  persist();
  refreshScore();
}

async function save() {
  if (!F) return;
  state.triedSave = true;
  const err = entryError(F);
  if (err) { refreshScore(); return; }
  const draft = draftFromEntry(F);
  const g = {seasonId: +F.seasonId, date: F.date, results: draft.results};
  const btn = $("save-btn");
  if (btn) btn.disabled = true;
  try {
    const editing = F.id;
    const id = editing ? await api.updateGame(ctx, F.id, g) : await api.createGame(ctx, g);
    await afterLiveWrite();
    sessionStorage.removeItem(DRAFT_KEY);
    formKey = "";
    F = null;
    state.justSaved = id;
    state.season = g.seasonId;
    state.f = g.seasonId;
    toast(ctx.mode === "mock" ? "Anotada en el ejemplo." : (editing ? "Cambios guardados." : "Partida guardada."));
    const next = `#/revelar/${id}`;
    if (location.hash === next) paint(true);
    else location.hash = next;
  } catch (e) {
    report(e);
    if (btn) btn.disabled = false;
  }
}

async function addNamed(name) {
  const clean = name.trim();
  if (clean.length < 2 || clean.length > 40) throw new Error("El nombre va entre 2 y 40 caracteres.");
  const row = await api.createPlayer(ctx, clean);
  await afterLiveWrite();
  return ctx.mode === "live" ? ctx.M.players.find((p) => p.name === clean) || row : row;
}

async function addGuest() {
  const input = $("guest-name");
  try {
    const row = await addNamed(input.value);
    const id = row.id;
    if (F && F.rows.length < 6 && !F.rows.some((r) => r.pid == id)) {
      F.rows.push({pid: id, vp: ""});
      focusPid = id;
      persist();
    }
    input.value = "";
    const guest = $("guest");
    if (guest) guest.hidden = true;
    toast(ctx.mode === "mock" ? "Sumado al ejemplo." : "Ya está en la mesa.");
    refreshScore();
  } catch (e) { report(e); }
}

async function addPlayer() {
  const input = $("np");
  const err = $("perr");
  try {
    await addNamed(input.value);
    if (err) err.textContent = "";
    toast(ctx.mode === "mock" ? "Sumado al ejemplo." : "Ya está en la mesa.");
    paint(false);
  } catch (e) {
    if (err) err.textContent = e.message || "No se pudo sumar.";
    else report(e);
  }
}

async function addSeason() {
  const name = $("sn").value.trim();
  const variant = $("sv").value;
  const err = $("serr");
  const prefix = {normal: "Normal", navegantes: "Navegantes", ck: "C&K"}[variant] || "Normal";
  const seasonName = `${prefix} - ${name}`;
  if (name.length < 2 || name.length > 67) { err.textContent = "El nombre va entre 2 y 67 caracteres."; return; }
  try {
    const created = await api.createSeason(ctx, seasonName);
    await afterLiveWrite();
    state.season = created.id;
    state.f = created.id;
    $("dlg-season").close();
    toast(ctx.mode === "mock" ? "Temporada creada en el ejemplo." : "Temporada guardada.");
    paint(true);
  } catch (e) {
    err.textContent = e.code === "23505" ? "Ya existe una temporada con ese nombre." : (e.message || "No se pudo crear.");
  }
}

function askDel(id) {
  const g = ctx.M.games.find((x) => x.id == id);
  if (!g) return;
  state.pendingDelete = id;
  $("del-msg").textContent = `¿Borrar la partida del ${dm(g.date)}? Se van los resultados de los ${g.results.length} jugadores.`;
  $("dlg-del").showModal();
}

async function confirmDel() {
  $("dlg-del").close();
  try {
    await api.deleteGame(ctx, state.pendingDelete);
    await afterLiveWrite();
    toast(ctx.mode === "mock" ? "Borrada del ejemplo." : "Partida borrada.");
    paint(false);
  } catch (e) { report(e); }
}

function askDelSeason(id) {
  if (!isAdmin()) { toast("Solo un administrador puede borrar temporadas."); return; }
  const s = ctx.M.seasons.find((x) => x.id == id);
  if (!s) return;
  const games = inScope(ctx.M.games, id);
  const results = games.reduce((a, g) => a + g.results.length, 0);
  state.pendingSeason = id;
  $("del-season-msg").textContent = games.length
    ? `¿Borrar «${s.name}»? Se eliminan ${games.length} partidas y ${results} resultados. No se puede deshacer.`
    : `¿Borrar «${s.name}»? No tiene partidas. No se puede deshacer.`;
  $("dlg-del-season").showModal();
}

async function confirmDelSeason() {
  $("dlg-del-season").close();
  if (!isAdmin()) return;
  try {
    await api.deleteSeason(ctx, state.pendingSeason);
    if (state.season == state.pendingSeason) state.season = null;
    if (state.f == state.pendingSeason) state.f = 0;
    await afterLiveWrite();
    ensureSeason();
    toast(ctx.mode === "mock" ? "Temporada borrada del ejemplo." : "Temporada y sus partidas eliminadas.");
    paint(true);
  } catch (e) { report(e); }
}

async function sendAdmin() {
  const email = $("aemail").value.trim();
  const err = $("aerr");
  if (!email) { err.textContent = "Escribe el correo."; return; }
  if (ctx.mode !== "live" || !ctx.db) { err.textContent = "Hace falta Supabase en línea para enviar el enlace."; return; }
  try {
    const r = await ctx.db.auth.signInWithOtp({
      email,
      options: {emailRedirectTo: location.origin + location.pathname}
    });
    if (r.error) throw r.error;
    $("dlg-admin").close();
    toast("Enlace enviado. Solo una cuenta con permiso puede borrar.");
  } catch (e) { err.textContent = e.message || "No se pudo enviar."; }
}

async function signOut() {
  if (ctx.mode === "mock") {
    state.mockAdmin = false;
    toast("Sesión de ejemplo cerrada.");
    paint(false);
    return;
  }
  if (!ctx.db) return;
  const r = await ctx.db.auth.signOut();
  if (r.error) { toast(r.error.message); return; }
  state.adminUser = null;
  toast("Sesión de administrador cerrada.");
  paint(false);
}

async function share(id) {
  const g = ctx.M.games.find((x) => x.id == id);
  if (!g) return;
  const text = shareText(ctx.M, g);
  try {
    if (navigator.share) {
      await navigator.share({text});
      return;
    }
    await navigator.clipboard.writeText(text);
    toast("Resumen copiado.");
  } catch (e) {
    if (e && e.name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(text);
      toast("Resumen copiado.");
    } catch { toast("No se pudo copiar."); }
  }
}

async function reconnect() {
  if (forcedMock) { toast("Esta vista está fijada en ejemplo (?mock=1)."); return; }
  setStatus("", "Conectando");
  try {
    const live = await connectLive();
    ctx = {mode: "live", db: live.db, M: live.M};
    state.mode = "live";
    ensureSeason();
    await bindAuth();
    setStatus("live", "En línea");
    toast("Conectado. Las lecturas ya vienen de Supabase.");
    paint(false);
  } catch (e) {
    setStatus("off", ctx.mode === "mock" ? "Ejemplo" : "Sin conexión");
    toast(e.message || "No hubo conexión.");
  }
}

async function bindAuth() {
  if (!ctx.db || authBound) return;
  authBound = true;
  try {
    const {data} = await ctx.db.auth.getSession();
    state.adminUser = data?.session?.user || null;
  } catch { /* session is optional */ }
  ctx.db.auth.onAuthStateChange((event, session) => {
    state.adminUser = session?.user || null;
    if (event === "SIGNED_IN") {
      location.hash = "#/temporadas";
      paint(true);
    } else paint(false);
  });
}

const handlers = {
  digit: (el) => pushDigit(el.dataset.d),
  bump: (el) => bump(el.dataset.d),
  "clear-vp": () => {
    const row = focusedRow();
    if (!row) return;
    row.vp = "";
    state.triedSave = false;
    persist();
    refreshScore();
  },
  "focus-player": (el) => { focusPid = +el.dataset.id; refreshScore(); },
  "toggle-player": (el) => togglePlayer(el.dataset.id),
  "toggle-guest": () => {
    const g = $("guest");
    if (!g) return;
    g.hidden = !g.hidden;
    if (!g.hidden) $("guest-name")?.focus();
  },
  "add-guest": () => addGuest(),
  "add-player": () => addPlayer(),
  save: () => save(),
  "clear-draft": () => {
    if (F?.id) {
      const g = ctx.M.games.find((x) => x.id == F.id);
      F = g ? fromGame(g) : blankForm();
    } else {
      sessionStorage.removeItem(DRAFT_KEY);
      F = blankForm();
    }
    focusPid = F.rows[0]?.pid || null;
    state.triedSave = false;
    paint(false);
  },
  "open-season": () => {
    $("sn").value = "";
    $("sv").value = "normal";
    $("serr").textContent = "";
    $("dlg-season").showModal();
    $("sn").focus();
  },
  "add-season": () => addSeason(),
  "close-dialog": (el) => el.closest("dialog")?.close(),
  "ask-del": (el) => askDel(+el.dataset.id),
  "confirm-del": () => confirmDel(),
  "ask-del-season": (el) => askDelSeason(+el.dataset.id),
  "confirm-del-season": () => confirmDelSeason(),
  "pick-season": (el) => {
    state.season = +el.dataset.id;
    state.f = state.season;
    paint(false);
  },
  "open-admin": () => {
    if (ctx.mode !== "live") { toast("El enlace de administrador necesita Supabase en línea."); return; }
    $("aerr").textContent = "";
    $("dlg-admin").showModal();
    $("aemail").focus();
  },
  "send-admin": () => sendAdmin(),
  "sign-out": () => signOut(),
  "mock-admin": () => {
    state.mockAdmin = true;
    toast("Borrado de ejemplo activado. No toca Supabase.");
    paint(false);
  },
  share: (el) => share(+el.dataset.id),
  reconnect: () => reconnect()
};

document.body.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const fn = handlers[el.dataset.act];
  if (!fn) return;
  e.preventDefault();
  fn(el);
});

document.body.addEventListener("change", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  if (t.dataset.field === "entry-date" && F) { F.date = t.value; persist(); refreshScore(); }
  if (t.dataset.field === "entry-season" && F) { F.seasonId = +t.value; persist(); refreshScore(); }
  if (t.dataset.field === "tie" && F) { F.tie[+t.dataset.pid] = +t.value; state.triedSave = false; persist(); refreshScore(); }
  if (t.dataset.field === "filter") { state.f = +t.value; paint(true); }
});

document.body.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select")) {
    if (e.key === "Enter" && e.target.id === "guest-name") { e.preventDefault(); addGuest(); }
    if (e.key === "Enter" && e.target.id === "np") { e.preventDefault(); addPlayer(); }
    if (e.key === "Enter" && e.target.id === "sn") { e.preventDefault(); addSeason(); }
    return;
  }
  if (!document.body.classList.contains("is-scoring")) return;
  if (/^[0-9]$/.test(e.key)) { e.preventDefault(); pushDigit(e.key); }
  else if (e.key === "Backspace") { e.preventDefault(); backspace(); }
  else if (e.key === "+" || e.key === "=") bump(1);
  else if (e.key === "-" || e.key === "_") bump(-1);
});

$("seg").addEventListener("change", () => {
  state.season = +$("seg").value;
  state.f = state.season;
  paint(true);
});

addEventListener("hashchange", () => {
  const route = parseRoute();
  if (route.name !== "revelar") state.justSaved = 0;
  paint(true);
});

addEventListener("offline", () => { if (ctx.mode === "live") setStatus("off", "Sin conexión"); });
addEventListener("online", () => {
  if (ctx.mode !== "live" || !ctx.db) return;
  setStatus("", "Conectando");
  reloadLive(ctx.db).then((M) => { ctx.M = M; ensureSeason(); setStatus("live", "En línea"); paint(false); }).catch(() => setStatus("off", "Sin conexión"));
});

async function boot() {
  $("app").innerHTML = `<p class="loading">Cargando la mesa…</p>`;
  setStatus("", "Conectando");
  try {
    if (forcedMock) throw new Error("mock");
    const live = await connectLive();
    ctx = {mode: "live", db: live.db, M: live.M};
    state.mode = "live";
    setStatus("live", "En línea");
    await bindAuth();
  } catch (e) {
    if (forcedLive && !forcedMock) {
      ctx = {mode: "dead", db: null, M: {seasons: [], players: [], games: []}};
      state.mode = "dead";
      setStatus("off", "Sin conexión");
      $("app").innerHTML = `<section class="screen" data-screen="error"><h1>Sin conexión</h1><p class="lede">Supabase no respondió. No se guardó nada.</p><p class="sub">${esc(e.message || "")}</p><p><button type="button" class="btn" style="width:auto" data-act="reconnect">Reintentar</button></p></section>`;
      return;
    }
    ctx = {mode: "mock", db: null, M: mockModel()};
    state.mode = "mock";
    setStatus("", "Ejemplo");
  }
  ensureSeason();
  paint(true);
}

boot();
