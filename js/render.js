import {
  biggestWin, closestGame, cumulativeAvg, dm, draftFromEntry, enamel, entryError,
  esc, fx, inScope, lr, pc, pname, resolveResults, rng, scoreAmigos, sname,
  standings, withDraft, wr
} from "./domain.js";

const ICONS = {
  mesa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8M7 12h10M8 17h8"/></svg>',
  tabla: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  anotar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  archivo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"/></svg>',
  tempo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>',
  stats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9M12 19V5M19 19v-7"/></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 19c.5-2.5 2-4 4-4s3.5 1.5 4 4M12 19c.5-2.5 2-4 4-4s3.5 1.5 4 4"/></svg>',
  rules: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h9l3 3v13H6zM9 12h6M9 16h6"/></svg>'
};

export function icon(name) {
  return ICONS[name] || "";
}

function dot(M, id) {
  return `<i class="dot" style="--enamel:var(--enamel-${enamel(M.players, id)})" aria-hidden="true"></i>`;
}

function banner(state) {
  if (state.mode !== "mock") return "";
  return `<p class="banner">Ejemplo con el histórico. No se escribe en Supabase. <button type="button" data-act="reconnect">Conectar</button></p>`;
}

function boardList(M, rows, opts = {}) {
  if (!rows?.length) return `<p class="empty">Todavía no hay partidas en esta selección.</p>`;
  const top = rows[0].avg;
  const before = opts.before || null;
  return `<ol class="board">${rows.map((x, i) => {
    let move = "";
    if (before) {
      const was = before.get(String(x.pid));
      if (was == null) move = " · entra";
      else if (was > i) move = ` · sube ${was - i}`;
      else if (was < i) move = ` · baja ${i - was}`;
    }
    return `<li><a class="board-row${i === 0 ? " is-lead" : ""}" href="#/jugador/${x.pid}">
      <span class="rank">${i + 1}</span>
      ${dot(M, x.pid)}
      <span class="who"><span class="name">${esc(x.name)}</span><span class="sub">${x.k} partidas · ${x.w} victorias · PV ${fx(x.avgVp, 1)}${move}</span></span>
      <span class="avg"><b>${fx(x.avg, 2)}</b><small>${i ? "−" + fx(top - x.avg, 2) : "líder"}</small></span>
    </a></li>`;
  }).join("")}</ol>`;
}

function orderList(M, results) {
  const n = results.length;
  const rows = results.slice().sort((a, b) => a.position - b.position);
  return `<ol class="order">${rows.map((r) => `<li class="${r.position === 1 ? "is-win" : ""}">
    <span class="rank">${r.position}</span>
    ${dot(M, r.playerId)}
    <span class="name">${esc(pname(M, r.playerId))}</span>
    <span class="vp">${r.vp ?? "—"} PV</span>
    <b>${fx(scoreAmigos(n, r.position), 2)}</b>
  </li>`).join("")}</ol>`;
}

export function hintFor(ctx) {
  const F = ctx.F;
  if (!F) return "";
  if (!F.seasonId) return "Elige la temporada.";
  if (!F.date) return "Falta la fecha.";
  if (F.rows.length < 3) return `Van ${F.rows.length}. Hacen falta al menos 3.`;
  if (F.rows.some((r) => r.vp === "" || r.vp == null)) return "Marca los PV de cada quien.";
  if (entryError(F)) return "Empate en PV. Elige el puesto.";
  const z = resolveResults(F.rows, F.tie || {});
  const winner = z.out.find((r) => r.pos === 1);
  if (!winner) return "Revisa los PV.";
  return `Gana ${pname(ctx.M, winner.pid)} · ${winner.vp} PV · ${fx(scoreAmigos(F.rows.length, 1), 2)}`;
}

export function fragments(ctx) {
  const {M, F, focusPid, state} = ctx;
  const ready = F && !entryError(F);
  const z = F ? resolveResults(F.rows, F.tie || {}) : {out: [], ties: [], ok: true};
  const used = new Set((F?.rows || []).map((r) => r.pid));
  const full = (F?.rows.length || 0) >= 6;
  const chips = (M.players || []).map((p) => {
    const on = used.has(p.id);
    const short = p.name.split(" ")[0];
    return `<button type="button" class="chip${on ? " is-on" : ""}" data-act="toggle-player" data-id="${p.id}" aria-pressed="${on ? "true" : "false"}" title="${esc(p.name)}" ${!on && full ? "disabled" : ""}>${dot(M, p.id)}<span>${esc(short)}</span></button>`;
  }).join("");
  const n = F?.rows.length || 0;
  const count = n < 3 ? `${n} en la mesa · mínimo 3` : `${n} en la mesa`;
  let entry = `<p class="empty">Toca los nombres de quien se sentó.</p>`;
  if (n) {
    const byId = Object.fromEntries(z.out.map((r) => [r.pid, r]));
    entry = `<ol class="entry">${F.rows.map((r) => {
      const info = byId[r.pid];
      const sub = r.vp === "" || r.vp == null
        ? "Sin PV"
        : (ready && info?.pos ? `${info.pos}º · ${fx(scoreAmigos(n, info.pos), 2)}` : "Anotado");
      return `<li><button type="button" class="entry-row${r.pid == focusPid ? " is-on" : ""}" data-act="focus-player" data-id="${r.pid}" aria-label="${esc(pname(M, r.pid))}, ${r.vp === "" ? "sin PV" : r.vp + " PV"}">
        ${dot(M, r.pid)}
        <span class="who"><span class="name">${esc(pname(M, r.pid))}</span><span class="sub">${sub}</span></span>
        <span class="vp">${r.vp === "" || r.vp == null ? "—" : esc(r.vp)}</span>
      </button></li>`;
    }).join("")}</ol>`;
  }
  const openTies = (z.ties || []).filter((t) => !t.ok);
  const ties = openTies.map((t) => `<div class="tie"><p><b>Empate a ${t.G[0].vp} PV.</b> ${t.G.map((r) => esc(pname(M, r.pid))).join(" y ")}. Elige el puesto.</p>
    ${t.G.map((r) => `<label class="tie-row">${esc(pname(M, r.pid))}
      <select data-field="tie" data-pid="${r.pid}" aria-label="Puesto de ${esc(pname(M, r.pid))}">
        <option value="0">Puesto…</option>
        ${Array.from({length: t.hi - t.lo + 1}, (_, k) => t.lo + k).map((p) => `<option value="${p}" ${+F.tie[r.pid] === p ? "selected" : ""}>${p}º</option>`).join("")}
      </select>
    </label>`).join("")}</div>`).join("");
  const preview = ready
    ? `<h2>Así queda</h2>${orderList(M, z.out.map((r) => ({playerId: r.pid, position: r.pos, vp: r.vp})))}`
    : "";
  let projection = "";
  const draft = F ? draftFromEntry(F) : null;
  if (draft && F.seasonId) {
    const cur = standings(M, +F.seasonId);
    const next = standings(withDraft(M, draft), +F.seasonId);
    const before = new Map(cur.map((p, i) => [String(p.pid), i]));
    projection = `<h2>La tabla si la guardas</h2>${boardList(M, next, {before})}`;
  }
  const err = state?.triedSave ? entryError(F) : "";
  return {
    chips, count, entry, ties, preview, projection, hint: hintFor(ctx), err,
    saveLabel: F?.id ? "Guardar cambios" : "Guardar partida",
    saveDisabled: !F || !!entryError(F)
  };
}

function pad() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return `<div class="pad" role="group" aria-label="Puntos de victoria">
    ${nums.map((n) => `<button type="button" data-act="digit" data-d="${n}">${n}</button>`).join("")}
    <button type="button" data-act="bump" data-d="-1" aria-label="Restar uno">−</button>
    <button type="button" data-act="digit" data-d="0">0</button>
    <button type="button" data-act="bump" data-d="1" aria-label="Sumar uno">+</button>
    <button type="button" class="pad-wide" data-act="clear-vp">Borrar</button>
  </div>`;
}

function seasonOptions(M, id) {
  if (!M.seasons.length) return `<option value="0">Sin temporadas</option>`;
  return M.seasons.map((s) => `<option value="${s.id}" ${s.id == id ? "selected" : ""}>${esc(s.name)}</option>`).join("");
}

function filterSelect(M, cur) {
  return `<label class="field">Ver
    <select data-field="filter" aria-label="Filtrar por temporada">
      <option value="0" ${cur == 0 ? "selected" : ""}>Todas las temporadas</option>
      ${M.seasons.map((s) => `<option value="${s.id}" ${s.id == cur ? "selected" : ""}>${esc(s.name)}</option>`).join("")}
    </select>
  </label>`;
}

function scoreScreen(ctx, editing) {
  const F = ctx.F;
  const bits = fragments(ctx);
  if (!F) return `${banner(ctx.state)}<section class="screen" data-screen="anotar"><h1>Partida no encontrada</h1><p class="lede">Esa partida no está en la mesa.</p></section>`;
  return `${banner(ctx.state)}<section class="screen" data-screen="${editing ? "editar" : "anotar"}">
    <p class="kicker">${editing ? "Corregir" : "Al cerrar la caja"}</p>
    <h1>${editing ? "Editar la partida" : "Anotar la partida"}</h1>
    <p class="row-acts"><a class="text" href="${editing ? "#/partidas" : "#/"}">Volver</a><button type="button" class="text" data-act="clear-draft">Empezar de cero</button></p>
    <div class="score-grid">
      <div class="slip is-loose">
        <div class="pair">
          <label class="field">Temporada<select data-field="entry-season" aria-label="Temporada de la partida">${seasonOptions(ctx.M, F.seasonId)}</select></label>
          <label class="field">Fecha<input type="date" data-field="entry-date" value="${esc(F.date || "")}" aria-label="Fecha de la partida"></label>
        </div>
        <h2>¿Quién jugó?</h2>
        <div class="chips" id="chips">${bits.chips}</div>
        <p class="count" id="count">${bits.count}</p>
        <p><button type="button" class="text" data-act="toggle-guest">Llegó alguien más</button></p>
        <div id="guest" hidden>
          <label class="field">Nombre<span class="inline"><input id="guest-name" maxlength="40" placeholder="Nombre" autocomplete="name"><button type="button" class="btn" data-act="add-guest">Sumar</button></span></label>
        </div>
        <div id="entry">${bits.entry}</div>
        <div id="ties">${bits.ties}</div>
        <div id="preview">${bits.preview}</div>
        <div id="projection">${bits.projection}</div>
      </div>
      <div class="composer">
        <p id="save-hint" aria-live="polite">${esc(bits.hint)}</p>
        ${pad()}
        <p class="err" id="entry-err" role="alert">${esc(bits.err)}</p>
        <button type="button" class="btn" id="save-btn" data-act="save" ${bits.saveDisabled ? "disabled" : ""}>${bits.saveLabel}</button>
      </div>
    </div>
  </section>`;
}

function form5(M, scope) {
  const L = standings(M, scope);
  const g = inScope(M.games, scope).slice(-5);
  if (!L.length) return `<p class="empty">Todavía no hay partidas.</p>`;
  return `<div class="form5">${L.map((x) => `<div class="form5-row"><span class="name">${esc(x.name)}</span><span class="pips">${g.map((q) => {
    const r = q.results.find((row) => row.playerId == x.pid);
    return r ? `<i class="pip${r.position === 1 ? " is-win" : ""}">${r.position}</i>` : `<i class="pip is-miss">–</i>`;
  }).join("")}</span></div>`).join("")}</div>`;
}

function home(ctx) {
  const {M, state} = ctx;
  const s = M.seasons.find((x) => x.id == state.season) || M.seasons[0];
  if (!s) return `${banner(state)}<section class="screen" data-screen="mesa"><h1>Catan Amigos</h1><p class="lede">No hay temporadas todavía.</p><p><button type="button" class="btn" data-act="open-season" style="width:auto">Nueva temporada</button></p></section>`;
  const games = inScope(M.games, s.id);
  const last = games[games.length - 1];
  const table = standings(M, s.id);
  const leader = table[0];
  const close = closestGame(M, s.id);
  return `${banner(state)}<section class="screen" data-screen="mesa">
    <p class="kicker">La mesa</p>
    <h1>${esc(s.name)}</h1>
    <p class="lede">${games.length} partidas · ${esc(rng(s))}</p>
    <div class="slip">
      ${leader ? boardList(M, [leader]) : `<p class="empty">Esta temporada todavía no tiene partidas.</p>`}
      <div class="acts"><a class="btn" href="#/registrar">${games.length ? "Anotar partida" : "Anotar la primera"}</a></div>
      <h2>Última partida</h2>
      ${last ? `<p class="sub">${esc(dm(last.date))} · ${last.results.length} jugadores</p>${orderList(M, last.results)}` : `<p class="empty">Cuando anoten una, queda aquí.</p>`}
      <p class="fact">${close ? `Margen más ajustado: <b>${close.diff} PV</b>, el ${esc(dm(close.g.date))}.` : "Aún no hay margen que comparar."}</p>
      <h2>Últimas cinco</h2>
      <p class="sub">El puesto de cada quien. En rojo, quien ganó.</p>
      ${form5(M, s.id)}
    </div>
  </section>`;
}

function tabla(ctx) {
  const {M, state} = ctx;
  const s = M.seasons.find((x) => x.id == state.season);
  const rows = standings(M, state.season);
  return `${banner(state)}<section class="screen" data-screen="tabla">
    <p class="kicker">Score Amigos promedio</p>
    <h1>La tabla</h1>
    <p class="lede">${s ? esc(s.name) : "Elige una temporada arriba."}</p>
    <div class="slip">${boardList(M, rows)}</div>
  </section>`;
}

function reveal(ctx, id) {
  const g = ctx.M.games.find((x) => x.id == id);
  if (!g) return `${banner(ctx.state)}<section class="screen" data-screen="revelar"><h1>Partida no encontrada</h1></section>`;
  const winner = g.results.find((r) => r.position === 1);
  if (!winner) return `${banner(ctx.state)}<section class="screen" data-screen="revelar"><h1>Esta partida no tiene ganador</h1></section>`;
  const n = g.results.length;
  const fresh = ctx.state.justSaved == id;
  return `${banner(ctx.state)}<section class="screen" data-screen="revelar">
    <div class="slip is-loose reveal" style="--enamel:var(--enamel-${enamel(ctx.M.players, winner.playerId)})">
      <p class="kicker">${fresh ? "Quedó anotada" : "La partida"}</p>
      <h1 class="reveal-name">${esc(pname(ctx.M, winner.playerId))}</h1>
      <p class="reveal-score"><b>${winner.vp ?? "—"}</b> PV · <b>${fx(scoreAmigos(n, 1), 2)}</b> Score Amigos</p>
      <p class="sub" style="margin-top:8px">${esc(dm(g.date))} · ${esc(sname(ctx.M, g.seasonId))} · ${n} jugadores</p>
      <div style="margin-top:16px">${orderList(ctx.M, g.results)}</div>
      <div class="acts">
        <a class="btn" href="#/tabla">Ver la tabla</a>
      </div>
      <p class="row-acts">
        <a class="text" href="#/registrar">Anotar otra</a>
        <button type="button" class="text" data-act="share" data-id="${g.id}">Copiar resumen</button>
        <a class="text" href="#/editar/${g.id}">Editar</a>
      </p>
    </div>
  </section>`;
}

function games(ctx) {
  const list = inScope(ctx.M.games, ctx.state.f).slice().reverse();
  return `${banner(ctx.state)}<section class="screen" data-screen="partidas">
    <p class="kicker">Archivo</p>
    <h1>Partidas</h1>
    <p class="lede">Puesto, PV y Score Amigos.</p>
    <div class="slip" style="margin-bottom:12px">${filterSelect(ctx.M, ctx.state.f)}</div>
    ${list.length ? `<div class="stack">${list.map((g) => `<article class="slip game">
      <header class="game-head"><h2>${esc(dm(g.date))}</h2><p class="sub">${esc(sname(ctx.M, g.seasonId))} · ${g.results.length}</p></header>
      ${orderList(ctx.M, g.results)}
      <div class="row-acts"><a class="text" href="#/revelar/${g.id}">Ver</a><a class="text" href="#/editar/${g.id}">Editar</a><button type="button" class="text danger" data-act="ask-del" data-id="${g.id}">Borrar</button></div>
    </article>`).join("")}</div>` : `<div class="slip"><p class="empty">No hay partidas en esta selección.</p></div>`}
  </section>`;
}

function blowLine(x) {
  if (!x) return "Todavía no hay una paliza con diferencia de PV.";
  return `Mayor paliza: ${esc(x.winner)} · +${x.margin} PV frente a ${esc(x.runner)} (${x.winnerVp}–${x.runnerVp}), el ${esc(dm(x.game.date))}.`;
}

function seasons(ctx) {
  const {M, state} = ctx;
  const admin = isAdmin(state);
  const current = M.seasons.find((s) => s.id == state.season) || M.seasons[0];
  return `${banner(state)}<section class="screen" data-screen="temporadas">
    <p class="kicker">Archivo</p>
    <h1>Temporadas</h1>
    <p class="lede">Cada etapa, con su tabla.</p>
    <div class="slip">
      <ul class="seasons">${M.seasons.map((s) => {
        const games = inScope(M.games, s.id);
        const table = standings(M, s.id);
        const champ = table[0];
        return `<li class="${s.id == current?.id ? "is-on" : ""}">
          <button type="button" class="season-pick-row" data-act="pick-season" data-id="${s.id}">
            <span>${esc(s.name)}</span>
            <span class="sub">${games.length} partidas · ${esc(rng(s))}${champ ? ` · ${esc(champ.name)} lidera` : ""}</span>
          </button>
          <p class="blow">${blowLine(biggestWin(M, s.id))}</p>
          ${admin ? `<button type="button" class="text danger" data-act="ask-del-season" data-id="${s.id}">Borrar temporada</button>` : ""}
        </li>`;
      }).join("")}</ul>
      <div class="acts"><button type="button" class="btn-quiet" data-act="open-season">Nueva temporada</button></div>
      <p class="sub" style="margin-top:12px">${adminStatus(state)}</p>
    </div>
    ${current ? `<div class="slip stack"><h2>${esc(current.name)}</h2>${boardList(M, standings(M, current.id))}</div>` : ""}
  </section>`;
}

function isAdmin(state) {
  if (state.mode === "mock" && state.mockAdmin) return true;
  return !!(state.adminUser && state.adminUser.app_metadata && state.adminUser.app_metadata.role === "admin");
}

function adminStatus(state) {
  if (isAdmin(state)) {
    const who = state.mode === "mock" && state.mockAdmin ? "Administrador de ejemplo. " : "";
    return `${who}<button type="button" class="text" data-act="sign-out">Cerrar sesión de administrador</button>`;
  }
  return `<button type="button" class="text" data-act="open-admin">Acceso de administrador</button>${state.mode === "mock" ? ` <button type="button" class="text" data-act="mock-admin">Probar el borrado en el ejemplo</button>` : ""}`;
}

function historical(ctx) {
  return `${banner(ctx.state)}<section class="screen" data-screen="historico">
    <p class="kicker">Toda la mesa</p>
    <h1>Histórico</h1>
    <p class="lede">Todas las partidas, juntas.</p>
    <div class="slip">
      <p class="blow">${blowLine(biggestWin(ctx.M, 0))}</p>
      ${boardList(ctx.M, standings(ctx.M, 0))}
    </div>
  </section>`;
}

function lineChart(series) {
  const W = 700, H = 260, L = 58, R = 24, T = 16, B = 32;
  const n = Math.max(1, ...series.map((s) => s.pts.length));
  const vals = series.flatMap((s) => s.pts.filter((v) => v != null));
  if (!vals.length) return "";
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const pad = Math.max((rawMax - rawMin) * .16, .12);
  const low = Math.max(0, Math.floor((rawMin - pad) * 10) / 10);
  const high = Math.ceil((rawMax + pad) * 10) / 10;
  const span = Math.max(high - low, .2);
  const step = span <= .6 ? .1 : span <= 1.2 ? .2 : Math.ceil(span / 4 * 10) / 10;
  const X = (i) => L + i * (W - L - R) / Math.max(n - 1, 1);
  const Y = (v) => H - B - (v - low) * (H - T - B) / span;
  const ticks = [];
  for (let v = Math.ceil(low / step) * step; v <= high + .0001; v += step) ticks.push(+v.toFixed(2));
  const grid = ticks.map((v) => {
    const y = Y(v);
    return `<line class="grid" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text x="${L - 8}" y="${y + 4}" text-anchor="end">${fx(v, 1)}</text>`;
  }).join("");
  const labels = [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i)
    .map((i) => `<text x="${X(i)}" y="${H - 8}" text-anchor="middle">${i + 1}</text>`).join("");
  const paths = series.map((s) => {
    const pts = s.pts.map((v, i) => v == null ? null : {x: X(i), y: Y(v), v, i}).filter(Boolean);
    if (!pts.length) return "";
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="var(--enamel-${s.c})" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="var(--enamel-${s.c})"><title>${esc(s.name)} · ${p.i + 1}: ${fx(p.v, 2)}</title></circle>`).join("")}`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Score Amigos promedio acumulado">${grid}${labels}${paths}</svg>`;
}

const BARS = [
  ["Score Amigos total", (x) => x.total, (v) => fx(v, 2)],
  ["Score Amigos promedio", (x) => x.avg, (v) => fx(v, 2)],
  ["Victorias", (x) => x.w, (v) => fx(v, 0)],
  ["Porcentaje de victorias", (x) => wr(x), (v) => pc(v), 100],
  ["Partidas jugadas", (x) => x.k, (v) => fx(v, 0)],
  ["Posición media", (x) => x.pm, (v) => fx(v, 2), 6],
  ["Porcentaje de últimos puestos", (x) => lr(x), (v) => pc(v), 100]
];

function stats(ctx) {
  const {M, state} = ctx;
  const rows = standings(M, state.f);
  const games = inScope(M.games, state.f);
  return `${banner(state)}<section class="screen" data-screen="estadisticas">
    <p class="kicker">Números</p>
    <h1>Estadísticas</h1>
    <p class="lede">${games.length} partidas en esta selección.</p>
    <div class="slip" style="margin-bottom:12px">${filterSelect(M, state.f)}</div>
    ${rows.length ? `<div class="slip">${BARS.map(([title, fn, fm, mx]) => `<h2>${title}</h2>${rows.map((x) => {
      const m = mx || Math.max(...rows.map(fn), 1);
      const color = enamel(M.players, x.pid);
      return `<div class="bar"><span>${esc(x.name.split(" ")[0])}</span><span class="bar-track"><i style="width:${Math.max(0, 100 * fn(x) / m)}%;background:var(--enamel-${color})"></i></span><b>${fm(fn(x))}</b></div>`;
    }).join("")}`).join("")}
      <h2>Cómo viene el promedio</h2>
      <p class="sub">Después de cada partida que jugó, no de las que se sentó fuera.</p>
      ${rows.map((x) => {
        const pts = cumulativeAvg(x);
        return `<section class="evo"><h3>${dot(M, x.pid)}${esc(x.name)}</h3><p class="sub">Ahora ${fx(pts[pts.length - 1] || 0, 2)} · ${pts.length} partidas</p>${lineChart([{c: enamel(M.players, x.pid), name: x.name, pts}])}</section>`;
      }).join("")}
    </div>` : `<div class="slip"><p class="empty">No hay partidas en esta selección.</p></div>`}
  </section>`;
}

function players(ctx) {
  const {M, state} = ctx;
  return `${banner(state)}<section class="screen" data-screen="jugadores">
    <p class="kicker">La gente</p>
    <h1>Jugadores</h1>
    <p class="lede">Toca un nombre para ver su ficha.</p>
    <div class="slip" style="margin-bottom:12px">${filterSelect(M, state.f)}</div>
    <div class="slip">
      ${boardList(M, standings(M, state.f).length ? standings(M, state.f) : []) || ""}
      ${M.players.filter((p) => !standings(M, state.f).some((x) => x.pid == p.id)).map((p) => `<p class="sub" style="margin-top:8px">${esc(p.name)} todavía no juega en esta selección.</p>`).join("")}
      <h2>Sumar jugador</h2>
      <label class="field">Nombre<span class="inline"><input id="np" maxlength="40" placeholder="Nombre"><button type="button" class="btn" data-act="add-player">Sumar</button></span></label>
      <p class="err" id="perr" role="alert"></p>
    </div>
  </section>`;
}

function player(ctx, id) {
  const p = ctx.M.players.find((x) => x.id == id);
  if (!p) return `${banner(ctx.state)}<section class="screen"><h1>Jugador no encontrado</h1></section>`;
  const x = standings(ctx.M, ctx.state.f).find((row) => row.pid == id) || {
    pid: id, name: p.name, k: 0, w: 0, last: 0, total: 0, avg: 0, pm: 0, avgVp: 0, bestVp: 0, rs: []
  };
  const all = standings(ctx.M, ctx.state.f);
  const pos = all.findIndex((row) => row.pid == id) + 1;
  const pts = cumulativeAvg(x);
  const metrics = x.k ? [
    [fx(x.avg, 2), "Score promedio"],
    [fx(x.total, 2), "Score total"],
    [String(x.k), "Partidas"],
    [String(x.w), "Victorias"],
    [pc(wr(x)), "De victorias"],
    [fx(x.pm, 2), "Posición media"],
    [pc(lr(x)), "Últimos puestos"],
    [fx(x.avgVp, 1), "PV promedio"],
    [String(x.bestVp), "Récord de PV"]
  ] : [];
  return `${banner(ctx.state)}<section class="screen" data-screen="jugador">
    <p class="kicker">${x.k ? `Puesto ${pos} de ${all.length}` : "Sin partidas aquí"}</p>
    <h1>${esc(p.name)}</h1>
    <p class="lede">${dot(ctx.M, id)} ${x.k ? `${fx(x.avg, 2)} de Score Amigos promedio` : "Nada anotado en esta selección."}</p>
    <div class="slip" style="margin-bottom:12px">${filterSelect(ctx.M, ctx.state.f)}</div>
    ${x.k ? `<div class="slip">
      <dl class="stats">${metrics.map(([v, l]) => `<div><dd>${v}</dd><dt>${l}</dt></div>`).join("")}</dl>
      <h2>Cómo viene</h2>
      ${lineChart([{c: enamel(ctx.M.players, id), name: p.name, pts}])}
      <h2>Últimas partidas</h2>
      <ul class="recent">${x.rs.slice(-8).reverse().map((r) => `<li>
        <span class="rank${r.position === 1 ? " is-win" : ""}">${r.position}</span>
        ${dot(ctx.M, id)}
        <span class="who"><span class="name">${esc(dm(r.date))}</span><span class="sub">${esc(sname(ctx.M, r.seasonId))} · ${r.n} jugadores</span></span>
        <span class="vp">${r.vp ?? "—"} PV</span>
        <b>${fx(r.sa, 2)}</b>
      </li>`).join("")}</ul>
    </div>` : `<div class="slip"><p class="empty">Cuando juegue en esta selección, la ficha se llena sola.</p></div>`}
  </section>`;
}

function rules(ctx) {
  const ex = [1, 2, 3, 4].map((p) => scoreAmigos(4, p));
  return `${banner(ctx.state)}<section class="screen" data-screen="reglas">
    <p class="kicker">La cuenta</p>
    <h1>Reglas</h1>
    <p class="lede">Los PV deciden la partida. El Score Amigos decide la temporada.</p>
    <div class="slip">
      <h2>Score Amigos</h2>
      <p>(Jugadores − puesto) × multiplicador. El último puesto suma 0,00.</p>
      <table class="table-wrap">
        <thead><tr><th>Jugadores</th><th>Multiplicador</th></tr></thead>
        <tbody>
          <tr><td>3</td><td>1,00</td></tr>
          <tr><td>4</td><td>1,20</td></tr>
          <tr><td>5</td><td>1,30</td></tr>
          <tr><td>6</td><td>1,50</td></tr>
        </tbody>
      </table>
      <h2>Ejemplo con 4</h2>
      <ol class="order">${ex.map((v, i) => `<li class="${i ? "" : "is-win"}"><span class="rank">${i + 1}</span><i class="dot" aria-hidden="true"></i><span class="name">(4 − ${i + 1}) × 1,20</span><span class="vp"></span><b>${fx(v, 2)}</b></li>`).join("")}</ol>
      <h2>PV</h2>
      <p>Lo que se cuenta en el tablero. Ordena la partida. No entra directo a la tabla.</p>
      <h2>Score Amigos</h2>
      <p>Sale del puesto y de cuántos jugaron. La tabla ordena por el promedio.</p>
    </div>
  </section>`;
}

function mas(ctx) {
  const items = [
    ["#/temporadas", "Temporadas", "Las etapas de la mesa"],
    ["#/historico", "Histórico", "Todas las partidas, juntas"],
    ["#/estadisticas", "Estadísticas", "Promedios, victorias, palizas"],
    ["#/jugadores", "Jugadores", "Quien se sienta"],
    ["#/reglas", "Reglas", "De los PV al Score Amigos"]
  ];
  return `${banner(ctx.state)}<section class="screen" data-screen="mas">
    <p class="kicker">Más</p>
    <h1>La mesa, aparte</h1>
    <div class="slip">
      <ul class="menu">${items.map(([href, t, d]) => `<li><a href="${href}"><span>${t}</span><small>${d}</small></a></li>`).join("")}
        <li><button type="button" data-act="open-season"><span>Nueva temporada</span><small>Normal, Navegantes o C&amp;K</small></button></li>
      </ul>
      <p style="margin-top:12px">${adminStatus(ctx.state)}</p>
    </div>
  </section>`;
}

export function render(route, ctx) {
  switch (route.name) {
    case "registrar": return scoreScreen(ctx, false);
    case "editar": return scoreScreen(ctx, true);
    case "tabla": return tabla(ctx);
    case "revelar": return reveal(ctx, route.id);
    case "partidas": return games(ctx);
    case "temporadas": return seasons(ctx);
    case "historico": return historical(ctx);
    case "estadisticas": return stats(ctx);
    case "jugadores": return players(ctx);
    case "jugador": return player(ctx, route.id);
    case "reglas": return rules(ctx);
    case "mas": return mas(ctx);
    default: return home(ctx);
  }
}

export function shareText(M, g) {
  const n = g.results.length;
  const rows = g.results.slice().sort((a, b) => a.position - b.position);
  const winner = rows[0];
  const lines = rows.map((r) => `${r.position}. ${pname(M, r.playerId)} · ${r.vp ?? "—"} PV · ${fx(scoreAmigos(n, r.position), 2)}`);
  return `${pname(M, winner.playerId)} ganó · ${winner.vp ?? "—"} PV · ${fx(scoreAmigos(n, 1), 2)} Score Amigos\n${lines.join("\n")}\n${sname(M, g.seasonId)} · ${dm(g.date)}`;
}
