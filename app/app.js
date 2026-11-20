// Neon Bay Trophy Guide — offline checklist + tracker for GTA VI's 55 PS5 trophies.
// All data comes from data/trophies.json (same origin, no network). Progress lives in
// localStorage and can be exported to a file and imported back. Every guide step in the
// data names its source (see the Sources & Audit tab), and each trophy carries its PSN
// point value: platinum 300, gold 90, silver 30, bronze 15.
const STORE_KEY = 'gta6-trophy-guide-v1';
const KIND_LABELS = {
  all: 'All', story: 'Story', side: 'Side missions', collect: 'Collectibles',
  activity: 'Activities', grind: 'Grind', missable: 'Missable', online: 'Online',
};
const KIND_ORDER = ['all', 'story', 'missable', 'collect', 'activity', 'side', 'grind', 'online'];
const STAGES = [
  { n: 1, title: 'Play the story', desc: 'Chapters 1–4, the final mission, and the six named story missions. All 12 trophies pop automatically — but read the missable warning first: one meditation spot lives in Chapter 1.' },
  { n: 2, title: 'Strangers & side missions', desc: 'Seven side-character strands (Andy, Kenton, Billy, Randy, Tyrone, Bret) plus any 8 stranger strands for the silver. Sweep the map for stranger markers between story beats.' },
  { n: 3, title: 'Activities', desc: 'Start with the Chapter 1 balcony meditation, then work the shooting ranges (42 golds), Top Fun drone races (14 locations), races, fishing and the arcade. Most of these feed the 100% checklist.' },
  { n: 4, title: 'Collectibles & exploration', desc: 'Card sets, WAiNK scans at 100 spots, 100 vehicles, all of Leonida, every garage property and 10 Scooter Bros registrations. Pick things up as you pass them.' },
  { n: 5, title: 'Crime & one-off feats', desc: 'Partner robberies, bank vaults, armored trucks, one operation per gang, Combat Focus kills and the odd hidden moments (showroom smash, Ocean Beach cocktail, the strange event). All retryable in free roam.' },
  { n: 6, title: 'The grind & the platinum', desc: '250 stunts, 50 of the 80 challenges, $250,000 laundered and $100,000 spent — then A Long Road (100% completion) and the platinum, Vice Got a Price!, pops.' },
];

const state = {
  doc: null,
  trophies: [],
  sources: {},
  earned: new Set(),
  spoiler: false,
  kind: 'all',
  query: '',
  earnedOnly: false,
  openId: null,
  view: 'checklist',
};

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const noteEl = $('ioNote');

function pointsFor(t) {
  const scale = state.doc && state.doc.points_scale ? state.doc.points_scale : {};
  return scale[t.grade] ?? 0;
}

function pointsTotal() {
  return state.trophies.reduce((sum, t) => sum + pointsFor(t), 0);
}

function pointsEarned() {
  return state.trophies.reduce((sum, t) => sum + (state.earned.has(t.name) ? pointsFor(t) : 0), 0);
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null');
    if (raw && Array.isArray(raw.earned)) state.earned = new Set(raw.earned);
    if (raw && typeof raw.spoiler === 'boolean') state.spoiler = raw.spoiler;
  } catch { /* a corrupt save starts fresh */ }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ app: 'gta6-trophy-guide', version: 1, earned: [...state.earned], spoiler: state.spoiler }));
}

function isSpoilerHidden(t) {
  return state.spoiler && t.kind === 'story' && !state.earned.has(t.name);
}

function visibleTrophies() {
  const q = state.query.trim().toLowerCase();
  return state.trophies.filter((t) => {
    if (state.kind === 'online') return false; // the list has no online trophies at all
    if (state.kind === 'missable' && !t.missable) return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && t.kind !== state.kind) return false;
    if (state.earnedOnly && !state.earned.has(t.name)) return false;
    if (q) {
      const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + (t.steps ?? []).map((s) => s.text).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function gradeBadge(t) {
  const span = document.createElement('span');
  span.className = 'tag ' + t.grade;
  span.textContent = t.grade;
  return span;
}

function renderProgress() {
  const total = state.trophies.length;
  const n = state.earned.size;
  const pct = total ? Math.round((100 * n) / total) : 0;
  $('earnedCount').textContent = String(n);
  $('progressFill').style.width = pct + '%';
  $('progressBar').setAttribute('aria-valuenow', String(n));
  $('progressLine').textContent = n === total
    ? 'Platinum earned — Vice Got a Price! You are a Leonida Legend.'
    : `${pct}% to the platinum — Vice Got a Price! (${total - n} to go)`;
  $('pointsLine').textContent = `${pointsEarned().toLocaleString('en-US')} / ${pointsTotal().toLocaleString('en-US')} PSN points`;
  const counts = $('gradeCounts');
  counts.replaceChildren();
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const have = state.trophies.filter((t) => t.grade === g && state.earned.has(t.name)).length;
    const all = state.trophies.filter((t) => t.grade === g).length;
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = `${have}/${all}`;
    li.append(b, document.createTextNode(' ' + g));
    counts.append(li);
  }
}

function renderAudit() {
  const steps = state.trophies.reduce((sum, t) => sum + (t.steps ?? []).length, 0);
  const cited = new Set();
  for (const t of state.trophies) for (const s of t.steps ?? []) cited.add(s.source);
  // The points scale is a source too: it backs the PSN points shown on every card.
  if (state.doc && state.doc.points_scale && state.doc.points_scale.source) cited.add(state.doc.points_scale.source);
  const covered = state.trophies.filter((t) => (t.steps ?? []).length > 0).length;
  const unconfirmed = state.trophies.filter((t) => t.unconfirmed).length;
  $('auditSteps').textContent = String(steps);
  $('auditSources').textContent = String(cited.size);
  $('auditCoverage').textContent = `${covered}/${state.trophies.length}`;
  $('auditPoints').textContent = pointsTotal().toLocaleString('en-US');
  $('auditUnconfirmed').textContent = String(unconfirmed);
  $('auditDate').textContent = state.doc && state.doc.audit ? state.doc.audit.date : '–';
  $('auditNote').textContent = state.doc && state.doc.audit ? state.doc.audit.note : '';
}

function renderSources() {
  const perSource = {};
  for (const t of state.trophies) {
    const seen = new Set();
    for (const s of t.steps ?? []) {
      perSource[s.source] = perSource[s.source] ?? { steps: 0, trophies: 0 };
      perSource[s.source].steps += 1;
      if (!seen.has(s.source)) { perSource[s.source].trophies += 1; seen.add(s.source); }
    }
  }
  const rows = Object.entries(perSource).sort((a, b) => b[1].trophies - a[1].trophies || b[1].steps - a[1].steps);
  const tbody = document.querySelector('#sourceMatrix tbody');
  tbody.replaceChildren();
  for (const [key, v] of rows) {
    const src = state.sources[key] ?? { name: key, date: '', url: '' };
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td');
    if (src.url) {
      const a = document.createElement('a');
      a.href = src.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = src.name;
      nameTd.append(a);
    } else {
      nameTd.textContent = src.name;
    }
    const dateTd = document.createElement('td');
    dateTd.textContent = src.date ?? '';
    const stepsTd = document.createElement('td');
    stepsTd.textContent = String(v.steps);
    const trTd = document.createElement('td');
    trTd.textContent = String(v.trophies);
    tr.append(nameTd, dateTd, stepsTd, trTd);
    tbody.append(tr);
  }
  const scale = state.doc && state.doc.points_scale ? state.doc.points_scale : {};
  const scaleSrc = state.sources[scale.source] ?? null;
  $('pointsNote').textContent = `Bronze ${scale.bronze ?? 15} · Silver ${scale.silver ?? 30} · Gold ${scale.gold ?? 90} · Platinum ${scale.platinum ?? 300} — the standard PSN point values. This set: 1 platinum, 2 gold, 6 silver, 46 bronze = ${pointsTotal().toLocaleString('en-US')} points in total${scaleSrc ? ` (scale: ${scaleSrc.name}).` : '.'}`;
  const list = $('sourceList');
  list.replaceChildren();
  for (const [key, src] of Object.entries(state.sources)) {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = src.name;
    li.append(b, document.createTextNode(` — ${src.role ?? ''} (${src.date ?? ''}). `));
    if (src.url) {
      const a = document.createElement('a');
      a.href = src.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = src.url;
      li.append(a);
    }
    list.append(li);
  }
  const unc = $('unconfirmedList');
  unc.replaceChildren();
  for (const t of state.trophies.filter((x) => x.unconfirmed)) {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = t.name;
    li.append(b, document.createTextNode(` — ${t.description}`));
    unc.append(li);
  }
}

function renderMissableBanner() {
  const pma = state.trophies.find((t) => t.missable);
  const html = pma
    ? `<strong>Missable — read this first:</strong> ${pma.name} is the only trophy any guide flags as possibly missable. One meditation spot is at Jason's house in Chapter 1: after the mission Down to Earth, follow Lucia to the balcony and meditate there before leaving Chapter 1. (Sources: GTABase, PowerPyx, KeenGamer.)`
    : '';
  for (const id of ['missableBanner', 'roadmapMissable']) {
    const el = $(id);
    el.innerHTML = html;
    el.classList.toggle('show', Boolean(html));
  }
}

function sourceLink(key) {
  const src = state.sources[key];
  if (!src) return document.createTextNode(key);
  const a = document.createElement('a');
  a.href = src.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = `${src.name} (${src.date})`;
  return a;
}

function trophyCard(t) {
  const li = document.createElement('li');
  li.className = 'trophy' + (state.earned.has(t.name) ? ' earned' : '');
  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.has(t.name);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(t.name);
    else state.earned.delete(t.name);
    saveState();
    renderAll();
  });
  const title = document.createElement('div');
  title.className = 'trophy-title';
  const h3 = document.createElement('h3');
  if (isSpoilerHidden(t)) {
    const em = document.createElement('span');
    em.className = 'hidden-name';
    em.textContent = 'Hidden story trophy — earn it to reveal the name';
    h3.append(em);
  } else {
    h3.textContent = t.name;
  }
  const desc = document.createElement('p');
  desc.textContent = isSpoilerHidden(t) ? 'Story spoiler hidden until earned.' : t.description;
  const tags = document.createElement('div');
  tags.className = 'tags';
  tags.append(gradeBadge(t));
  if (t.kind !== 'platinum') { // the grade badge already says PLATINUM for the platinum
    const kindTag = document.createElement('span');
    kindTag.className = 'tag kind';
    kindTag.textContent = KIND_LABELS[t.kind] ?? t.kind;
    tags.append(kindTag);
  }
  const pts = document.createElement('span');
  pts.className = 'tag points';
  pts.textContent = `${pointsFor(t)} pts`;
  tags.append(pts);
  if (t.hidden) {
    const h = document.createElement('span');
    h.className = 'tag hidden-t';
    h.textContent = 'Hidden on PS5';
    tags.append(h);
  }
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag missable';
    m.textContent = 'Missable';
    tags.append(m);
  }
  if (t.unconfirmed) {
    const u = document.createElement('span');
    u.className = 'tag unconfirmed';
    u.textContent = 'Method unconfirmed';
    tags.append(u);
  }
  title.append(h3, desc, tags);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'guide-btn';
  const open = state.openId === t.id;
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'Hide guide' : 'Guide + sources';
  btn.addEventListener('click', () => {
    state.openId = open ? null : t.id;
    renderList();
  });
  head.append(box, title, btn);
  li.append(head);
  if (open && !isSpoilerHidden(t)) {
    const detail = document.createElement('div');
    detail.className = 'detail';
    const lab = document.createElement('p');
    lab.className = 'label';
    lab.textContent = 'Guide';
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    detail.append(lab, guide);
    if (t.unconfirmed) {
      const warn = document.createElement('p');
      warn.className = 'unconfirmed-note';
      warn.textContent = 'Method not yet confirmed by any published guide (checked 20 Nov 2026). Nothing here is invented — the steps below are all the sources confirm.';
      detail.append(warn);
    }
    const steps = t.steps ?? [];
    if (steps.length) {
      const stepsLab = document.createElement('p');
      stepsLab.className = 'label';
      stepsLab.textContent = `Cited steps — ${steps.length}`;
      detail.append(stepsLab);
      const ol = document.createElement('ol');
      ol.className = 'steps';
      for (const s of steps) {
        const item = document.createElement('li');
        const txt = document.createElement('span');
        txt.textContent = s.text + ' ';
        const cite = document.createElement('span');
        cite.className = 'cite';
        cite.append(document.createTextNode('— '), sourceLink(s.source));
        item.append(txt, cite);
        ol.append(item);
      }
      detail.append(ol);
    }
    const stage = document.createElement('p');
    stage.className = 'stage-note';
    const stageDef = STAGES.find((s) => s.n === t.stage);
    stage.textContent = `Roadmap: stage ${t.stage} — ${stageDef ? stageDef.title : ''}, step ${t.step}. ${pointsFor(t)} PSN points.` + (t.missable_note ? ' ' + t.missable_note : '');
    detail.append(stage);
    li.append(detail);
  }
  return li;
}

function renderList() {
  const visible = visibleTrophies();
  listEl.replaceChildren(...visible.map(trophyCard));
  const total = state.trophies.length;
  const shown = visible.length;
  let meta = `Showing ${shown} of ${total} trophies`;
  if (state.kind === 'online') meta = 'No online trophies — all 55 are single-player and offline (PlayStation FAQ via HowToVideoGame).';
  else if (state.kind === 'missable') meta += ' · only 1 trophy is flagged as possibly missable';
  if (state.earnedOnly) meta += ' · earned only';
  if (state.query.trim()) meta += ` · matching “${state.query.trim()}”`;
  $('listMeta').textContent = meta;
  $('emptyState').hidden = visible.length > 0;
}

function renderRoadmap() {
  const ol = $('stageList');
  ol.replaceChildren();
  for (const s of STAGES) {
    const items = state.trophies.filter((t) => t.stage === s.n).sort((a, b) => a.step - b.step);
    const done = items.filter((t) => state.earned.has(t.name)).length;
    const li = document.createElement('li');
    li.className = 'stage';
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = String(s.n);
    const h3 = document.createElement('h3');
    h3.textContent = s.title;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${done}/${items.length} earned`;
    head.append(num, h3, count);
    const desc = document.createElement('p');
    desc.className = 'stage-desc';
    desc.textContent = s.desc;
    const ul = document.createElement('ul');
    ul.className = 'stage-trophies';
    for (const t of items) {
      const row = document.createElement('li');
      if (state.earned.has(t.name)) row.className = 'earned';
      const step = document.createElement('span');
      step.className = 'step';
      step.textContent = String(t.step);
      const nm = document.createElement('span');
      nm.className = 't-name';
      nm.textContent = isSpoilerHidden(t) ? 'Hidden story trophy' : t.name;
      const gr = document.createElement('span');
      gr.className = 't-grade';
      gr.textContent = t.grade;
      row.append(step, nm, gr);
      if (t.missable) {
        const flag = document.createElement('span');
        flag.className = 't-flag';
        flag.textContent = 'MISSABLE';
        row.append(flag);
      }
      ul.append(row);
    }
    li.append(head, desc, ul);
    ol.append(li);
  }
}

function renderChips() {
  const wrap = $('kindChips');
  wrap.replaceChildren();
  for (const k of KIND_ORDER) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = KIND_LABELS[k];
    b.setAttribute('aria-pressed', String(state.kind === k));
    b.addEventListener('click', () => {
      state.kind = k;
      renderChips();
      renderList();
    });
    wrap.append(b);
  }
}

function setView(view) {
  state.view = view;
  $('tabChecklist').setAttribute('aria-selected', String(view === 'checklist'));
  $('tabRoadmap').setAttribute('aria-selected', String(view === 'roadmap'));
  $('tabSources').setAttribute('aria-selected', String(view === 'sources'));
  $('viewChecklist').hidden = view !== 'checklist';
  $('viewRoadmap').hidden = view !== 'roadmap';
  $('viewSources').hidden = view !== 'sources';
  if (view === 'roadmap') renderRoadmap();
  if (view === 'sources') renderSources();
}

function renderAll() {
  renderProgress();
  renderAudit();
  renderMissableBanner();
  renderList();
  if (state.view === 'roadmap') renderRoadmap();
  if (state.view === 'sources') renderSources();
}

function exportProgress() {
  const data = { app: 'gta6-trophy-guide', version: 1, exportedAt: new Date().toISOString(), earned: [...state.earned].sort() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  noteEl.textContent = `Exported ${state.earned.size} earned trophies to gta6-trophy-progress.json.`;
}

async function importProgress(file) {
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('bad file');
    const known = new Set(state.trophies.map((t) => t.name));
    const good = names.filter((n) => typeof n === 'string' && known.has(n));
    state.earned = new Set(good);
    saveState();
    renderAll();
    noteEl.textContent = `Imported ${good.length} earned trophies${names.length - good.length ? ` (${names.length - good.length} unknown names skipped)` : ''}.`;
  } catch {
    noteEl.textContent = 'Import failed: that file is not a trophy-progress export from this guide.';
  }
}

async function init() {
  loadState();
  const doc = await (await fetch('data/trophies.json')).json();
  state.doc = doc;
  state.trophies = doc.trophies;
  state.sources = doc.sources ?? {};
  $('spoilerToggle').checked = state.spoiler;
  $('spoilerToggle').addEventListener('change', (e) => {
    state.spoiler = e.target.checked;
    saveState();
    renderAll();
  });
  $('search').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderList();
  });
  $('earnedOnly').addEventListener('change', (e) => {
    state.earnedOnly = e.target.checked;
    renderList();
  });
  $('exportBtn').addEventListener('click', exportProgress);
  $('importFile').addEventListener('change', (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    state.earned.clear();
    saveState();
    renderAll();
    noteEl.textContent = 'Progress reset — all 55 trophies unmarked.';
  });
  $('tabChecklist').addEventListener('click', () => setView('checklist'));
  $('tabRoadmap').addEventListener('click', () => setView('roadmap'));
  $('tabSources').addEventListener('click', () => setView('sources'));
  renderChips();
  renderAll();
}

init();
