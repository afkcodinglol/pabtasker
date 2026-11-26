/* ==========================================================================
   OSRS Account Builder - interface
   ========================================================================== */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const ICON = {
  grip:'<svg viewBox="0 0 16 16" width="14" height="14"><g fill="currentColor"><circle cx="5" cy="3" r="1.3"/><circle cx="11" cy="3" r="1.3"/><circle cx="5" cy="8" r="1.3"/><circle cx="11" cy="8" r="1.3"/><circle cx="5" cy="13" r="1.3"/><circle cx="11" cy="13" r="1.3"/></g></svg>',
  x:'<svg viewBox="0 0 16 16" width="13" height="13"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  target:'<svg viewBox="0 0 16 16" width="12" height="12"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2.4" fill="currentColor"/></svg>',
  clock:'<svg viewBox="0 0 16 16" width="12" height="12"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5V8l2.5 1.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  warn:'<svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 1.8l6.6 11.7H1.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11.6" r=".9" fill="currentColor"/></svg>',
  undo:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M5 3L2 6l3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 6H10a4 4 0 010 8H6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  up:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M4 9l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  edit:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 13l1-3.5L10.5 3 13 5.5 6.5 12z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  trash:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bolt:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8z" fill="currentColor"/></svg>',
  gear:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M6.9 1.5h2.2l.3 1.7 1.2.5 1.4-1 1.6 1.6-1 1.4.5 1.2 1.7.3v2.2l-1.7.3-.5 1.2 1 1.4-1.6 1.6-1.4-1-1.2.5-.3 1.7H6.9l-.3-1.7-1.2-.5-1.4 1-1.6-1.6 1-1.4-.5-1.2-1.7-.3V6.9l1.7-.3.5-1.2-1-1.4 1.6-1.6 1.4 1 1.2-.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  imp:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  exp:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 10V2M4.5 5.5L8 2l3.5 3.5M2.5 13.5h11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shuffle:'<svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 4.5h2.5c3 0 4 7 7 7H14M2 11.5h2.5c1.2 0 2-1.1 2.7-2.4M9 6.4c.7-1.1 1.5-1.9 2.5-1.9H14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 2.5l2 2-2 2M12 9.5l2 2-2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dice:'<svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="2" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="5.5" cy="5.5" r="1.1" fill="currentColor"/><circle cx="10.5" cy="10.5" r="1.1" fill="currentColor"/><circle cx="8" cy="8" r="1.1" fill="currentColor"/></svg>',
  logo:'<svg viewBox="0 0 32 32" width="30" height="30"><rect x="2" y="2" width="28" height="28" rx="7" fill="#2a2416" stroke="#cfa853" stroke-width="1.5"/><path d="M9 21l6-11 3 6 2-3 3 8z" fill="#cfa853"/><circle cx="21.5" cy="10.5" r="2" fill="#cfa853"/></svg>'
};

const iconUrl = s => `https://oldschool.runescape.wiki/images/${s === 'RUNECRAFT' ? 'Runecraft' : SKILL_LABEL(s)}_icon.png`;
const QP_ICON = 'https://oldschool.runescape.wiki/images/Quest_point_icon.png';
const CB_ICON = 'https://oldschool.runescape.wiki/images/Combat_icon.png';
function skillImg(s, cls){ return `<img src="${iconUrl(s)}" class="${cls || 'sk-xs'}" alt="${SKILL_LABEL(s)}" title="${SKILL_LABEL(s)}" onerror="this.replaceWith(document.createTextNode('${SKILL_LABEL(s)}'))">`; }
function fmtTime(min){
  if(!isFinite(min)) return '?';
  min = Math.round(min);
  if(min < 60) return `${min}m`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/* ---------------- State ---------------- */
const STORE_KEY = 'osrs_account_builder_v2';
const HIST_KEY = 'osrs_account_builder_history';
const DEFAULTS = {mode:'iron', autofill:true, variety:2, capMin:120, questXp:true, enforceRec:true, partner:true,
  defPure:false, wintertodt:true, autoStarter:true, startMode:'fresh', startLevels:{}, goals:{}, includeQuests:true,
  genMode:'replace', skillTab:'projected', libTab:'goals', libSort:'optimal', spread:true, questPref:'questfirst', acquire:true, hardcore:false};
/* How much training time a quest must save, relative to its own time, to be done for XP */
const QUEST_FACTOR = {strict:1, balanced:0.5, questfirst:0.3};
const SAMPLE = ['IRON_STARTER_PART1','QUEST:RUNE_MYSTERIES','QUEST:BIOHAZARD','DIARY:ARDOUGNE_EASY','QUEST:JUNGLE_POTION',
  'QUEST:DORICS_QUEST','QUEST:THE_TOURIST_TRAP','QUEST:THE_DEPTHS_OF_DESPAIR','SKILL:AGILITY:25','SKILL:RUNECRAFTING:50',
  'QUEST:THE_GRAND_TREE','QUEST:RECRUITMENT_DRIVE','QUEST:BIOHAZARD'];

let settings = Object.assign({}, DEFAULTS);
let tasks = [];
let undoStack = [];
let sim = null;
let highlightIdx = -1;

function load(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      settings = Object.assign({}, DEFAULTS, d.settings || {});
      tasks = Array.isArray(d.tasks) ? d.tasks.filter(t => t && t.raw) : [];
      tasks.forEach(t => { t.raw = fixAcquireRaw(t.raw); });
      return;
    }
  }catch(e){}
  tasks = SAMPLE.map(raw => ({raw, why:''}));
}
let saveTimer = null;
function save(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try{ localStorage.setItem(STORE_KEY, JSON.stringify({settings, tasks})); }catch(e){} }, 150);
}
function history(){ try{ return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); }catch(e){ return []; } }
function pushHistory(seq){
  const h = history(); h.unshift(seq.slice(0, 500));
  try{ localStorage.setItem(HIST_KEY, JSON.stringify(h.slice(0, 15))); }catch(e){}
}
function pushUndo(){ undoStack.push(JSON.stringify(tasks)); if(undoStack.length > 60) undoStack.shift(); }
function undo(){
  if(!undoStack.length){ toast('Nothing to undo'); return; }
  tasks = JSON.parse(undoStack.pop());
  renderAll();
  toast('Undone');
}

function opts(extra){
  return Object.assign({mode:settings.mode, variety:settings.variety, capMin:settings.capMin, minChunk:12,
    questXp:settings.questXp, enforceRec:settings.enforceRec, partner:settings.partner, defPure:settings.defPure,
    wintertodt:settings.wintertodt, questUnlock:true, questFactor:QUEST_FACTOR[settings.questPref] || 0.3,
    gatherReqs:settings.mode === 'iron' && settings.acquire, gatherMaxMin:300,
    startCoins:settings.startMode === 'custom' ? 1e6 : 25}, extra || {});
}
function startState(){ return newState(settings.startMode === 'custom' ? settings.startLevels : null); }

/* ---------------- Toasts ---------------- */
function toast(msg, kind){
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.classList.add('out'), 3200);
  setTimeout(() => el.remove(), 3600);
}

/* ---------------- Formatting ---------------- */
function typeBadge(p){
  switch(p.kind){
    case 'QUEST': return p.entry && p.entry.mini ? {label:'MINIQUEST', cls:'b-quest'} : {label:'QUEST', cls:'b-quest'};
    case 'DIARY': return {label:'DIARY', cls:'b-diary'};
    case 'MILESTONE': return {label:'MILESTONE', cls:'b-mile'};
    case 'SKILL': return {label:'SKILL', cls:'b-skill'};
    case 'STARTER': return {label:'STARTER', cls:'b-mile'};
    case 'ACTIVITY': {
      const g = p.key.split(':')[0];
      if(g === 'REPEATING') return {label:'REPEATING', cls:'b-rep'};
      if(g === 'MINIGAME') return {label:'MINIGAME', cls:'b-mini'};
      return {label:g.replace('_', ' '), cls:'b-task'};
    }
    case 'HEADER': return {label:'HEADER', cls:'b-head'};
    default: return {label:'TASK', cls:'b-task'};
  }
}
function prettify(s){ return s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }
function titleText(p){
  if(p.entry && p.kind !== 'ACTIVITY') return p.entry.name;
  if(p.kind === 'SKILL') return p.skill ? `${SKILL_LABEL(p.skill)} ${p.level || ''}` : p.raw;
  if(p.kind === 'ACTIVITY' && p.key === 'ACQUIRE'){
    /* ACQUIRE:Item,min-max(&Item,min-max) -> Gather 10 x Item, or Gather 2-6 x Item (if under 2, up to 6) */
    return 'Gather ' + p.raw.slice(8).split('&').map(part => {
      const m = part.match(/^(.*),\s*(\d+)\s*-\s*(\d+)$/) || part.match(/^(.*),\s*(\d+)$/);
      return m ? `${m[3] && m[3] !== m[2] ? m[2] + '-' + m[3] : m[2]} x ${m[1].trim().replace(/_/g, ' ')}` : part.replace(/_/g, ' ');
    }).join(', ');
  }
  if(p.kind === 'ACTIVITY'){
    const rest = p.raw.slice(p.key.length).replace(/^:/, '');
    return p.entry.name + (rest ? ' ' + rest.replace(/:/g, ' ') : '');
  }
  if(p.kind === 'QUEST' || p.kind === 'DIARY' || p.kind === 'MILESTONE') return prettify(p.id || p.raw);
  return p.raw;
}
function titleHtml(p){
  if(p.kind === 'SKILL' && p.skill) return `<span class="skill-title">${skillImg(p.skill, 'sk-lg')}<span>${SKILL_LABEL(p.skill)}</span><span class="lv">Level ${p.level || '?'}</span></span>`;
  if(p.kind === 'ACTIVITY' && p.skill && p.level) return `<span class="skill-title">${skillImg(p.skill, 'sk-lg')}<span>${esc(p.entry.name)}</span><span class="lv">Level ${p.level}</span></span>`;
  return esc(titleText(p));
}
function missText(m){
  switch(m.t){
    case 'skill': return `${m.need} ${SKILL_LABEL(m.skill)}`;
    case 'qp': return `${m.need} QP`;
    case 'cb': return `Combat ${m.need}`;
    case 'sum': return `Attack + Strength ${m.need}`;
    case 'pre': return DB[m.key] ? DB[m.key].name : m.key;
    case 'any': return `${m.n - m.have} more kudos quests`;
    case 'text': return m.text;
  }
  return '';
}
/* First task index (at or after i) whose end state satisfies the missing requirement, or -1 */
function reachedAt(m, i){
  const ok = S => {
    if(m.t === 'skill') return lvl(S, m.skill) >= m.need;
    if(m.t === 'qp') return S.qp >= m.need;
    if(m.t === 'cb') return combatLevel(S) >= m.need;
    if(m.t === 'sum') return lvl(S, 'ATTACK') + lvl(S, 'STRENGTH') >= m.need;
    if(m.t === 'pre') return S.done.has(m.key);
    return false;
  };
  for(let j = i; j < tasks.length; j++) if(ok(sim.states[j + 1] || sim.end)) return j;
  return -1;
}
function whereNote(m, i){
  if(i === undefined || m.t === 'text' || m.t === 'any') return '';
  const j = reachedAt(m, i);
  return j >= 0 ? `reached after #${j + 1}` : 'not reached anywhere in this list';
}
function missHtml(m, i){
  const w = whereNote(m, i);
  const tail = (have) => `<span class="have">(${[have, w].filter(Boolean).join(', ')})</span>`;
  if(m.t === 'skill') return `${skillImg(m.skill)}<b>${m.need} ${SKILL_LABEL(m.skill)}</b>${tail('have ' + m.have)}`;
  if(m.t === 'qp') return `<img src="${QP_ICON}" class="sk-xs" alt="QP" onerror="this.remove()"><b>${m.need} QP</b>${tail('have ' + m.have)}`;
  if(m.t === 'cb') return `<img src="${CB_ICON}" class="sk-xs" alt="Combat" onerror="this.remove()"><b>Combat ${m.need}</b>${tail('have ' + m.have)}`;
  if(m.t === 'sum') return `<b>Attack + Strength ${m.need}</b>${tail('have ' + m.have)}`;
  if(m.t === 'pre') return `<b>${esc(missText(m))}</b>${w ? `<span class="have">(${w})</span>` : ''}`;
  return esc(missText(m));
}
/* Requirement chips for an entry at a given state */
function reqChips(e, S, max){
  if(!e) return '';
  const o = opts({showRec:true});
  const m = mergedReqs(e, o);
  const chips = [];
  for(const [k, {v, rec}] of Object.entries(m)){
    let ok, label;
    if(k === 'QP'){ ok = S.qp >= v; label = `<img src="${QP_ICON}" class="sk-xs" alt="QP" onerror="this.remove()">${v} QP`; }
    else if(k === 'CB'){ ok = combatLevel(S) >= v; label = `<img src="${CB_ICON}" class="sk-xs" alt="Combat" onerror="this.remove()">${v}`; }
    else if(k === 'ATTSTR'){ ok = lvl(S,'ATTACK') + lvl(S,'STRENGTH') >= v; label = `Att + Str ${v}`; }
    else if(SKILLS.includes(k)){ ok = lvl(S, k) >= v; label = `${skillImg(k)}${v}`; }
    else continue;
    chips.push(`<span class="chip ${ok ? 'ok' : (rec ? 'warn' : 'bad')}" title="${rec ? 'Recommended' : 'Required'}">${label}</span>`);
  }
  for(const p of e.pre){
    const ok = S.done.has(p);
    if(!ok) chips.push(`<span class="chip bad">${esc(DB[p] ? DB[p].name : p)}</span>`);
  }
  if(e.any){ const [n, list] = e.any; const have = list.filter(k => S.done.has(k)).length; if(have < n) chips.push(`<span class="chip bad">${n - have} kudos quests</span>`); }
  if(max && chips.length > max) return chips.slice(0, max).join('') + `<span class="chip">+${chips.length - max}</span>`;
  return chips.join('');
}

/* ---------------- Board ---------------- */
function renderBoard(){
  const board = $('#board');
  const q = $('#boardSearch').value.trim().toLowerCase();
  $('#boardClear').style.display = q ? 'block' : 'none';
  if(!tasks.length){
    board.innerHTML = `<div class="empty-state"><div class="es-title">No tasks yet</div>
      <div>Pick a goal, quest or diary from the library. With <b>Autofill</b> on, prerequisites, quest points and goal-based training are planned for you.</div>
      <div class="es-sub">Or set skill goals in the panel on the right and press Generate.</div></div>`;
    $('#boardCount').textContent = '0 tasks';
    return;
  }
  const n = tasks.length;
  let html = '', shown = 0;
  tasks.forEach((t, i) => {
    const row = sim.rows[i], p = row.p, S = sim.states[i];
    const b = typeBadge(p);
    const cls = ['card'];
    if(row.dup) cls.push('card-duplicate');
    if(row.issues.length) cls.push('blocked');
    else if(row.redundant) cls.push('redundant');
    if(i === highlightIdx) cls.push('card-highlight');
    const hay = (t.raw + ' ' + titleText(p) + ' ' + (t.why || '')).toLowerCase();
    if(q && !hay.includes(q)) cls.push('hidden'); else shown++;
    const why = t.why ? t.why.split(' | ') : [];
    const chips = (p.entry && !row.redundant && p.kind !== 'STARTER') ? reqChips(p.entry, S, 9) : '';
    const qp = p.entry && p.entry.qp && !row.redundant ? `<span class="qp-chip">+${p.entry.qp} QP</span>` : '';
    const fixable = (p.entry && p.kind !== 'STARTER') || (p.skill && p.level);
    const issues = row.issues.length ? `<div class="issue-line">${ICON.warn}<span>Missing at this position:</span>${row.issues.map(m => `<span class="miss">${missHtml(m, i)}</span>`).join('')}${fixable ? `<button class="fix-btn" title="Plan the missing quests and training directly above this task">Fix here</button>` : ''}</div>` : '';
    const warns = row.warns.length ? `<div class="warn-line">${ICON.warn}<span>Recommended:</span>${row.warns.map(m => `<span class="miss">${missHtml(m, i)}</span>`).join('')}${!row.issues.length && fixable && settings.enforceRec ? `<button class="fix-btn warn" title="Plan the recommended stats directly above this task">Fix here</button>` : ''}</div>` : '';
    const red = row.redundant ? `<div class="muted-line">${esc(row.redundant)}</div>` : '';
    const note = p.entry && p.entry.note && !row.redundant && p.kind !== 'ACTIVITY' && p.kind !== 'STARTER' ? `<span class="note">${esc(p.entry.note)}</span>` : '';
    html += `<div class="${cls.join(' ')}" draggable="true" data-i="${i}">
      <div class="card-left">
        <span class="drag-handle" title="Drag to reorder">${ICON.grip}</span>
        <input type="number" class="order-box" min="1" max="${n}" value="${i + 1}" title="Type a position and press Enter">
        <span class="badge ${b.cls}">${b.label}</span>
        ${row.dup ? '<span class="badge b-dup">DUPLICATE</span>' : ''}
        <div class="card-content">
          <div class="card-title-row"><span class="card-title">${titleHtml(p)}</span><span class="card-raw">${esc(t.raw)}</span></div>
          ${why.length ? `<div class="why-line">${ICON.target}<span>${esc(why[0])}</span>${why[1] ? `<span class="method">${esc(why[1])}</span>` : ''}</div>` : ''}
          ${chips || note ? `<div class="card-meta">${chips}${note}</div>` : ''}
          ${issues}${warns}${red}
        </div>
      </div>
      <div class="card-right">
        ${qp}
        ${row.minutes ? `<span class="time-chip" title="Estimated time">${ICON.clock}${fmtTime(row.minutes)}</span>` : ''}
        <button class="delete-btn" title="Remove this task">${ICON.x}</button>
      </div>
    </div>`;
  });
  board.innerHTML = html;
  $('#boardCount').textContent = q ? `Showing ${shown} of ${n} tasks` : `${n} task${n === 1 ? '' : 's'}`;
  if(highlightIdx >= 0){
    const el = board.querySelector(`.card[data-i="${highlightIdx}"]`);
    if(el && !isVisible(el, board)) el.scrollIntoView({block:'center'});
    highlightIdx = -1;
  }
}
function isVisible(el, cont){ const r = el.getBoundingClientRect(), c = cont.getBoundingClientRect(); return r.top >= c.top && r.bottom <= c.bottom; }

function renderStats(){
  const S = sim.end;
  const quests = tasks.filter((t, i) => sim.rows[i].p.kind === 'QUEST' && !sim.rows[i].redundant).length;
  $('#topStats').innerHTML = `
    <div class="stat"><span class="sv">${tasks.length}</span><span class="sl">tasks</span></div>
    <div class="stat"><span class="sv">${fmtTime(sim.total)}</span><span class="sl">estimated</span></div>
    <div class="stat"><span class="sv">${fmtTime(sim.training)}</span><span class="sl">training</span></div>
    <div class="stat"><span class="sv">${quests}</span><span class="sl">quests</span></div>
    <div class="stat"><span class="sv">${S.qp}</span><span class="sl">quest points</span></div>
    <div class="stat ${sim.issues ? 'bad' : 'good'}"><span class="sv">${sim.issues}</span><span class="sl">unmet</span></div>`;
}

/* ---------------- Skill window ---------------- */
function renderSkills(){
  const tab = settings.skillTab;
  $$('#skillTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const start = startState();
  const end = sim.end;
  let html = '', total = 0;
  SKILLS.forEach(s => {
    const pl = lvl(end, s), sl = lvl(start, s);
    const goal = settings.goals[s] || 0;
    total += tab === 'start' ? sl : pl;
    let top, bot, cls = '';
    if(tab === 'projected'){ top = pl; bot = goal ? goal : pl; if(goal) cls = pl >= goal ? 'met' : 'short'; }
    else if(tab === 'goals'){ top = pl; bot = `<input class="sk-input" data-skill="${s}" type="number" min="1" max="99" value="${goal || ''}" placeholder="-">`; if(goal) cls = pl >= goal ? 'met' : 'short'; }
    else { top = `<input class="sk-input" data-skill="${s}" type="number" min="1" max="99" value="${sl}">`; bot = sl; }
    html += `<div class="sk ${cls}" data-skill="${s}">
      <img src="${iconUrl(s)}" alt="${SKILL_LABEL(s)}" onerror="this.style.visibility='hidden'">
      <div class="sk-nums"><span class="sk-top">${top}</span><span class="sk-slash"></span><span class="sk-bot">${bot}</span></div></div>`;
  });
  $('#skillGrid').innerHTML = html;
  $('#skillFoot').innerHTML = `<span>Total level: ${total}</span><span>Combat ${combatLevel(tab === 'start' ? start : end)}</span><span>QP ${tab === 'start' ? 0 : end.qp}</span>`;
  const hint = {projected:'Levels at the end of the plan. Click a skill to add training to the end of the list.',
    goals:'Enter target levels, then Generate. Leave blank for no goal. A Defence goal of 1 keeps Defence locked.',
    start:'Starting levels before the first task. Editing switches the start to custom stats.'}[tab];
  $('#skillHint').textContent = hint;
  $('#startModeLabel').textContent = settings.startMode === 'custom' ? 'Custom start' : 'Fresh account';
}

/* ---------------- Library ---------------- */
function entryStatus(e, S){
  if(S.done.has(e.key) && e.type !== 'ACTIVITY') return {cls:'done', text:'Done'};
  if(e.noIron && settings.mode === 'iron') return {cls:'pure', text:'Not for ironmen', title:'Imp beads only drop from imps'};
  if(settings.defPure){ const b = pureBlocked(e.key, S); if(b) return {cls:'pure', text:'Not for pures', title: b === e.key ? 'Gives Defence XP or needs Defence' : `Needs ${DB[b].name}, which gives Defence XP`}; }
  const m = missingReqs(e, S, opts());
  if(!m.length) return {cls:'ready', text:'Ready'};
  return {cls:'locked', text:`${m.length} missing`, title:m.map(missText).join(', ')};
}
function reqSummary(e){
  const parts = [];
  Object.entries(mergedReqs(e, opts({showRec:true}))).forEach(([k, {v}]) => {
    if(SKILLS.includes(k)) parts.push(`<span class="ls">${skillImg(k)}${v}</span>`);
    else if(k === 'QP') parts.push(`<span class="ls">${v} QP</span>`);
    else if(k === 'CB') parts.push(`<span class="ls">Cb ${v}</span>`);
    else if(k === 'ATTSTR') parts.push(`<span class="ls">Att+Str ${v}</span>`);
  });
  return parts.slice(0, 7).join('') + (parts.length > 7 ? `<span class="ls">+${parts.length - 7}</span>` : '');
}
/* ---- Combat XP quest filter ---- */
const COMBAT_XP_SKILLS = ['ATTACK','STRENGTH','DEFENCE','HITPOINTS','RANGED','MAGIC','PRAYER'];
/* Combat XP a quest gives: fixed rewards, plus lamps that can only go on combat skills */
function combatXpOf(e){
  const fixed = {};
  COMBAT_XP_SKILLS.forEach(s => { if(e.xp[s]) fixed[s] = e.xp[s]; });
  let lamp = 0;
  (e.lamps || []).forEach(l => { if(l.skills && l.skills.every(s => COMBAT_XP_SKILLS.includes(s))) lamp += l.xp * l.n; });
  const lampText = !lamp && /combat/i.test(e.lamp || '');
  const total = Object.values(fixed).reduce((a, b) => a + b, 0) + lamp;
  return {fixed, lamp, lampText, total, any: total > 0 || lampText};
}
/* Every prerequisite quest in the chain, recursively */
function prereqChain(k, acc){
  acc = acc || new Set();
  const e = DB[k];
  if(!e) return acc;
  e.pre.forEach(p => { if(!acc.has(p)){ acc.add(p); prereqChain(p, acc); } });
  return acc;
}
/* Requirements still missing at state S: each unmet skill / QP / combat level, plus every
   prerequisite quest in the chain that is not done yet */
function missingCount(e, S){
  let n = missingReqs(e, S, opts()).filter(m => m.t !== 'pre').length;
  prereqChain(e.key).forEach(p => { if(!S.done.has(p)) n++; });
  return n;
}
function totalReqCount(e){
  return Object.keys(mergedReqs(e, opts())).length + prereqChain(e.key).size;
}

function libItems(){
  const tab = settings.libTab;
  const mode = settings.mode;
  if(tab === 'goals') return PRESETS.map((p, i) => ({id:'preset:' + i, name:p.name, sub:p.sub, preset:p}));
  if(tab === 'quests' && settings.libCombat){
    const S = sim.end;
    return Object.values(DB).filter(e => e.type === 'QUEST' && !S.done.has(e.key) && combatXpOf(e).any && !(settings.defPure && pureBlocked(e.key, S)) && !(e.noIron && settings.mode === 'iron'))
      .map(e => ({e, miss:missingCount(e, S), tot:totalReqCount(e), xp:combatXpOf(e).total}))
      .sort((a, b) => a.miss - b.miss || a.tot - b.tot || b.xp - a.xp || a.e.name.localeCompare(b.e.name))
      .map(x => ({id:x.e.key, name:x.e.name, entry:x.e, combat:true, miss:x.miss}));
  }
  if(tab === 'quests'){
    let list = Object.values(DB).filter(e => e.type === 'QUEST');
    list.sort(settings.libSort === 'az' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => guideIdx(a.key, mode) - guideIdx(b.key, mode));
    const rfd = {id:'preset:rfd', name:'Recipe for Disaster (full quest)', sub:'All subquests, ends with Barrows gloves', preset:PRESETS[0], feature:true};
    return [rfd].concat(list.map(e => ({id:e.key, name:e.name, entry:e})));
  }
  if(tab === 'diaries') return Object.values(DB).filter(e => e.type === 'DIARY' || e.type === 'MILESTONE').map(e => ({id:e.key, name:e.name, entry:e}));
  if(tab === 'skills') return SKILLS.filter(s => s !== 'HITPOINTS' || true).map(s => ({id:'skill:' + s, name:SKILL_LABEL(s), skill:s}));
  return Object.values(DB).filter(e => e.type === 'ACTIVITY').map(e => ({id:e.key, name:e.name, entry:e}));
}
function renderLibrary(){
  $$('#libTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === settings.libTab));
  $('#libSortWrap').style.display = settings.libTab === 'quests' ? 'flex' : 'none';
  $$('#libSort button').forEach(b => b.classList.toggle('active', !settings.libCombat && b.dataset.sort === settings.libSort));
  $('#libCombat').classList.toggle('active', !!settings.libCombat);
  const q = $('#libSearch').value.trim().toLowerCase();
  const S = sim.end;
  const o = opts();
  let html = '';
  let idx = 0;
  for(const it of libItems()){
    let sub = it.sub || '', status = null, left = '';
    if(it.entry){
      const e = it.entry;
      status = entryStatus(e, S);
      const bits = [];
      if(e.type === 'QUEST'){ if(e.qp) bits.push(`${e.qp} QP`); bits.push(fmtTime(entryMinutes(e, o))); }
      if(e.type === 'ACTIVITY' && e.note) bits.push(esc(e.note));
      if(e.approx) bits.push('approx. reqs');
      sub = `<span class="lib-bits">${bits.join(' | ')}</span>${reqSummary(e)}`;
      if(it.combat){
        const c = combatXpOf(e);
        const parts = Object.entries(c.fixed).map(([s, x]) => `<span class="ls cxp">${skillImg(s)}${Math.round(x).toLocaleString()}</span>`);
        if(c.lamp) parts.push(`<span class="ls cxp">${Math.round(c.lamp).toLocaleString()} lamp</span>`);
        if(c.lampText) parts.push(`<span class="ls cxp">${esc(e.lamp)}</span>`);
        sub = `<span class="lib-xp">${parts.join('')}</span>` + sub;
        status = it.miss ? {cls:'locked', text:`${it.miss} missing`, title:status.title || ''} : {cls:'ready', text:'Ready'};
        idx++; left = `<span class="lib-idx">${idx}</span>`;
      } else if(e.type === 'QUEST' && settings.libSort === 'optimal'){ idx++; left = `<span class="lib-idx">${idx}</span>`; }
    } else if(it.preset){
      const p = it.preset;
      const targets = p.all ? allQuestKeys() : (p.targets || []);
      const done = targets.length && targets.every(k => S.done.has(k));
      status = done ? {cls:'done', text:'Done'} : {cls:'goal', text:'Goal'};
    } else if(it.skill){
      const s = it.skill, l = lvl(S, s);
      const m = bestMethod(s, l, S, o);
      left = `<img src="${iconUrl(s)}" class="lib-skill-icon" alt="" onerror="this.style.visibility='hidden'">`;
      sub = s === 'HITPOINTS' ? 'Trained through Attack and Strength' : (m ? `${esc(methLabel(m, o))}, about ${Math.round(methRate(m, o) / 1000)}k XP/h` : 'Needs a quest unlock first');
      status = {cls:'lvl', text:`Lv ${l}`};
    }
    const hay = (it.name + ' ' + (it.sub || '') + ' ' + (it.entry ? it.entry.key : '')).toLowerCase();
    if(q && !hay.includes(q)) continue;
    html += `<div class="lib-item${it.feature ? ' feature' : ''}" data-id="${esc(it.id)}">
      ${left}
      <div class="lib-main"><div class="lib-name">${esc(it.name)}</div><div class="lib-sub">${sub}</div></div>
      ${status ? `<span class="status ${status.cls}" title="${esc(status.title || '')}">${status.text}</span>` : ''}
    </div>`;
  }
  $('#libList').innerHTML = html || '<div class="lib-empty">Nothing matches that search.</div>';
}
function allQuestKeys(){ return Object.values(DB).filter(e => e.type === 'QUEST' && (settings.partner || !e.partner) && !(e.noIron && settings.mode === 'iron')).map(e => e.key); }

/* ---------------- Render all ---------------- */
function renderAll(){
  sim = simulate(tasks, startState(), opts());
  renderBoard();
  renderStats();
  renderSkills();
  renderLibrary();
  renderToolbar();
  save();
}
function renderToolbar(){
  $('#autofillToggle').checked = settings.autofill;
  $('#pureToggle').checked = !!settings.defPure;
  $$('#modeSeg button').forEach(b => b.classList.toggle('active', b.dataset.mode === (isHardcore() ? 'hcim' : settings.mode)));
  $('#varietySel').value = String(settings.variety);
  $('#capSel').value = String(settings.capMin);
  $('#includeQuests').checked = settings.includeQuests;
  $$('#genSeg button').forEach(b => b.classList.toggle('active', b.dataset.gen === settings.genMode));
}

/* ---------------- Planning actions ---------------- */
/* Skills of the training tasks just before position `pos` (most recent last), for spacing */
function recentSkills(pos){
  const out = [];
  for(let k = Math.max(0, pos - 12); k < pos && k < tasks.length; k++){ const p = sim.rows[k].p; out.push(p.skill && p.level ? p.skill : null); }
  return out;
}
/* ---- Hardcore ironman opener ----
   Hardcore accounts start every plan with 9 Magic and Witch's House (6,325 Hitpoints XP) before
   anything else. Opener tasks are flagged (hc) and always stay at the front of the list. */
const isHardcore = () => settings.mode === 'iron' && !!settings.hardcore;
function emitOpener(P){
  const from = P.out.length;
  P.addSkill('MAGIC', 9, 'Hardcore opener: 9 Magic');
  P.achieve([{key:'QUEST:WITCHS_HOUSE', why:"Hardcore opener: Witch's House"}]);
  for(let i = from; i < P.out.length; i++) P.out[i].hc = true;
}
/* index of the last opener task (everything up to it is the opener), or -1 */
function openerEnd(list){ for(let i = list.length - 1; i >= 0; i--) if(list[i].hc) return i; return -1; }
function spread(list, start, recent){
  list = assignLamps(list, start, opts());
  if(settings.spread){
    const h = openerEnd(list);
    if(h >= 0){
      /* the opener stays in front; only the rest is reordered */
      const head = list.slice(0, h + 1);
      const mid = simulate(head, start, opts()).end;
      list = head.concat(spreadTraining(list.slice(h + 1), mid, opts(), []));
    } else list = spreadTraining(list, start, opts(), recent);
  }
  if(!settings.acquire) return list;
  list = addAcquires(list, start, opts());
  /* gathering XP (chopping for Firemaking, mining for bars) can cover later training: drop it */
  const s2 = simulate(list, start, opts());
  return list.filter((t, i) => !(s2.rows[i].p.kind === 'SKILL' && s2.rows[i].redundant && t.why));
}
/* Add or remove the ironman ACQUIRE tasks on the current list */
function refreshAcquires(on){
  const before = tasks.length;
  const next = on ? addAcquires(tasks, startState(), opts()) : addAcquires(tasks, startState(), opts({mode:'main'}));
  if(next.length === before) return 0;
  pushUndo();
  tasks = next;
  renderAll();
  return next.length - before;
}
/* targets: [{key, raw?, why}] for quests/diaries/milestones;
   skills: [{skill, level, why}]; acts: [{key, raw, why}] for activities */
function planAndInsert({targets = [], skills = [], acts = [], label, at = null, starter = true}){
  const atEnd = at === null || at >= tasks.length;
  const pos = atEnd ? tasks.length : at;
  const start = atEnd ? sim.end : sim.states[pos];
  let newTasks, mins = 0;
  if(!settings.autofill){
    newTasks = targets.map(t => ({raw:t.raw || DB[t.key].raw, why:''}))
      .concat(skills.map(s => ({raw:`SKILL:${RAW_SKILL(s.skill)}:${s.level}`, why:''})))
      .concat(acts.map(a => ({raw:a.raw, why:''})));
  } else {
    const useStarter = starter && atEnd && !tasks.length && settings.mode === 'iron' && settings.startMode === 'fresh' && settings.autoStarter;
    const useOpener = atEnd && !tasks.length && isHardcore();
    const build = rng => {
      const P = createPlanner(start, opts({rng}));
      if(useOpener) emitOpener(P);
      if(useStarter) P.emit('IRON_STARTER_PART1', 'Ironman starter route: early quests, Wintertodt and blackjacking requirements');
      if(targets.length) P.achieve(targets);
      skills.forEach(s => P.addSkill(s.skill, s.level, s.why));
      acts.forEach(a => { P.S.done.delete(a.key); P.addActivity(a.key, a.raw, a.why); });
      return P;
    };
    const P = bestPlan(build, settings.variety, history());
    newTasks = spread(P.out, start, recentSkills(pos));
    if(P.skipped && P.skipped.size){ const names = [...P.skipped.keys()].map(k => DB[k].name); setTimeout(() => toast(`Pure: skipped ${names.length} quest${names.length === 1 ? '' : 's'} that give or need Defence XP: ${names.slice(0, 4).join(', ')}${names.length > 4 ? ' and more' : ''}`, 'warn'), 50); }
    mins = P.minutes;
    if(settings.variety && newTasks.length > 3) pushHistory(newTasks.map(t => t.raw));
  }
  if(!newTasks.length){ toast(`${label}: already complete at that point in the plan`); return; }
  pushUndo();
  tasks.splice(pos, 0, ...newTasks);
  highlightIdx = pos;
  renderAll();
  const earlier = sim.rows.slice(0, pos).filter(r => r.issues.length).length;
  toast((settings.autofill
    ? `${label}: added ${newTasks.length} task${newTasks.length === 1 ? '' : 's'} (about ${fmtTime(mins)})`
    : `${label}: added`) + (earlier ? `. ${earlier} earlier task${earlier === 1 ? ' is' : 's are'} still blocked: use Fix here on ${earlier === 1 ? 'it' : 'them'} or Optimize` : ''),
    earlier ? 'warn' : '');
}

function onLibClick(id){
  if(id.startsWith('preset:')){
    const p = id === 'preset:rfd' ? PRESETS[0] : PRESETS[+id.split(':')[1]];
    const targets = (p.all ? allQuestKeys() : (p.targets || [])).map(k => ({key:k, why:`Goal: ${p.name}`}));
    const skills = (p.skills || []).map(([s, l]) => ({skill:s, level:l, why:`Goal: ${p.name}`}));
    const acts = (p.extra ? p.extra.split('|') : []).map(raw => ({key:parseRaw(raw).key, raw, why:`Goal: ${p.name}`}));
    if(!settings.autofill && p.all){ toast('Turn Autofill on to add every quest at once'); return; }
    if(settings.defPure && targets.length && !p.all){
      const blocked = targets.map(t => [t.key, pureBlocked(t.key, sim.end)]).filter(([, b]) => b);
      if(blocked.length === targets.length){
        const [k, b] = blocked[0];
        toast(b === k ? `${p.name}: ${DB[k].name} gives Defence XP, not possible on a pure`
          : `${p.name}: needs ${DB[b].name}, which gives Defence XP, not possible on a pure`, 'warn');
        return;
      }
    }
    planAndInsert({targets, skills, acts, label:p.name});
    return;
  }
  if(id.startsWith('skill:')){
    const s = id.split(':')[1];
    openParam({title:`Train ${SKILL_LABEL(s)}`, desc: settings.autofill
      ? 'Training is split at gear and method milestones and capped at the max task length. Quest unlocks are added when they save time.'
      : 'Adds a single SKILL task.', kind:'level', value:Math.min(99, lvl(sim.end, s) + 10),
      onOk: v => {
        if(s === 'HITPOINTS' && !settings.autofill){ toast('Hitpoints has no backend task; turn Autofill on to train it through combat'); return; }
        planAndInsert({skills:[{skill:s, level:+v, why:`Goal: ${v} ${SKILL_LABEL(s)}`}], label:`${SKILL_LABEL(s)} ${v}`});
      }});
    return;
  }
  const e = DB[id];
  if(!e) return;
  if(e.type === 'ACTIVITY'){
    if(e.key === 'IRON_STARTER_PART1'){ planAndInsert({acts:[{key:e.key, raw:'IRON_STARTER_PART1', why:''}], label:e.name}); return; }
    if(!e.param){ planAndInsert({acts:[{key:e.key, raw:e.key, why:`Goal: ${e.name}`}], label:e.name}); return; }
    openParam({title:e.name, desc:e.note || '', kind:e.param, value:e.defaultParam, options:e.options,
      onOk: v => {
        const raw = `${e.key}:${v}`;
        planAndInsert({acts:[{key:e.key, raw, why:`Goal: ${e.name} ${v}`}], label:e.name});
      }});
    return;
  }
  if(sim.end.done.has(e.key)){ toast(`${e.name} is already in the plan`); return; }
  if(e.noIron && settings.mode === 'iron'){ toast(`${e.name} is not possible on an ironman: imp beads only drop from imps`, 'warn'); return; }
  if(settings.defPure && settings.autofill){ const b = pureBlocked(e.key, sim.end); if(b){ toast(b === e.key ? `${e.name} gives Defence XP: not added on a pure` : `${e.name} needs ${DB[b].name}, which gives Defence XP: not added on a pure`, 'warn'); return; } }
  planAndInsert({targets:[{key:e.key, why:`Goal: ${e.name}`}], label:e.name});
}

/* Plan whatever a blocked task is missing, directly above it, from the account state at that position */
function fixRow(i){
  const t = tasks[i], p = sim.rows[i].p, S = sim.states[i];
  let replace = false;
  const P = createPlanner(S, opts({variety:0}));
  if(p.entry && (p.kind === 'QUEST' || p.kind === 'DIARY' || p.kind === 'MILESTONE')){
    P.achieve([{key:p.key, raw:t.raw, why:t.why}]);
    for(let k = P.out.length - 1; k >= 0; k--) if(P.out[k].raw === t.raw){ P.out.splice(k, 1); break; }
  } else if(p.kind === 'ACTIVITY'){
    P.S.done.delete(p.key); P.addActivity(p.key, t.raw, t.why); replace = true;
  } else if(p.skill && p.level){
    P.addSkill(p.skill, p.level, t.why || `Goal: ${p.level} ${SKILL_LABEL(p.skill)}`); replace = true;
  } else return;
  if(!P.out.length){ toast('Nothing could be planned for this task'); return; }
  P.out = spread(P.out, S, recentSkills(i));
  pushUndo();
  const wasRedundant = new Set(tasks.filter((x, k) => sim.rows[k].redundant));
  if(replace) tasks.splice(i, 1, ...P.out); else tasks.splice(i, 0, ...P.out);
  /* Later tasks that the fix made redundant (repeated quests, training already reached) are removed */
  const end = i + P.out.length;
  const fresh = simulate(tasks, startState(), opts());
  tasks = tasks.filter((x, k) => {
    if(k < end || wasRedundant.has(x)) return true;
    const r = fresh.rows[k];
    if(!r.redundant) return true;
    return !(r.p.kind === 'QUEST' || r.p.kind === 'DIARY' || r.p.kind === 'MILESTONE' || r.p.kind === 'SKILL');
  });
  highlightIdx = i;
  renderAll();
  const left = sim.rows[i + P.out.length - (replace ? 1 : 0)];
  toast(`Planned ${P.out.length} task${P.out.length === 1 ? '' : 's'} above #${i + 1}${left && left.issues.length ? '; some requirements still need attention' : ''}`);
}

/* Quests whose XP (including lamps) toward the goal skills saves at least half the time they,
   their prerequisites and any extra training they need cost. Greedy: best value first, then
   re-evaluated with that XP credited, so overlapping rewards are not double counted. */
function pickXpQuests(P, goalMap, o){
  if(o.defPure){ goalMap = Object.assign({}, goalMap); delete goalMap.DEFENCE; }
  const T = cloneState(P.S);
  const picks = [];
  const chosen = new Set();
  const goalOf = s => Math.max(goalMap[s] || 0, lvl(T, s));
  for(let round = 0; round < 60; round++){
    let best = null;
    for(const e of Object.values(DB)){
      if(e.type !== 'QUEST' || T.done.has(e.key) || chosen.has(e.key) || P.excluded(e.key, true)) continue;
      let saved = 0, lampSkill = null;
      const gains = [];
      for(const [s, x] of Object.entries(e.xp)){
        const need = Math.max(0, xpFor(goalMap[s] || 0) - T.xp[s]);
        if(!need) continue;
        const use = Math.min(x, need);
        saved += xpMinutes(T, s, use, o);
        gains.push(`+${Math.round(use).toLocaleString()} ${SKILL_LABEL(s)}`);
      }
      if(e.lamps && e.lamps.length){
        let bl = null;
        for(const s of Object.keys(goalMap)){
          const lx = lampGainFor(e, s, T, o);
          if(!lx) continue;
          const use = Math.min(lx, Math.max(0, xpFor(goalMap[s]) - T.xp[s] - (e.xp[s] || 0)));
          if(use <= 0) continue;
          const sv = xpMinutes(T, s, use, o);
          if(!bl || sv > bl.sv) bl = {s, sv, use};
        }
        if(bl){ saved += bl.sv; lampSkill = bl.s; gains.push(`+${Math.round(bl.use).toLocaleString()} ${SKILL_LABEL(bl.s)} from lamps`); }
      }
      if(!saved) continue;
      const c = P.closure(e.key, '', new Map());
      let cost = 0, ok = true;
      const needMax = {};
      for(const k of c.keys()){
        if(P.excluded(k, true)){ ok = false; break; }
        if(T.done.has(k) || chosen.has(k)) continue;
        cost += entryMinutes(DB[k], o);
        for(const [s, {v}] of Object.entries(mergedReqs(DB[k], o))) if(SKILLS.includes(s)) needMax[s] = Math.max(needMax[s] || 0, v);
      }
      if(!ok) continue;
      /* training beyond what the goals already require counts against the quest */
      for(const [s, v] of Object.entries(needMax)){
        const g = goalOf(s);
        if(v > g){
          /* the closure's own quests give XP first (Druidic Ritual for Herblore and so on) */
          const C = cloneState(T); for(const k of c.keys()) if(!C.done.has(k)) applyTask(C, parseRaw(DB[k].raw));
          const t = reqTrainMinutes(C, s, v, o) - (g > lvl(C, s) ? reqTrainMinutes(C, s, g, o) : 0);
          if(!isFinite(t)){ ok = false; break; }
          cost += Math.max(0, t) * REQ_TRAIN_WEIGHT;
        }
      }
      if(!ok || saved < cost * (o.questFactor === undefined ? 0.5 : o.questFactor)) continue;
      const ratio = saved / Math.max(1, cost);
      if(!best || ratio > best.ratio) best = {e, c, ratio, lampSkill, why:`Quest XP toward your goals: ${gains.join(', ')}`};
    }
    if(!best) break;
    chosen.add(best.e.key);
    picks.push({key:best.e.key, why:best.why, raw: best.lampSkill ? lampRaw(best.e, best.lampSkill) : undefined});
    for(const k of best.c.keys()){
      if(T.done.has(k)) continue;
      T.done.add(k); chosen.add(k);
      for(const [s, x] of Object.entries(DB[k].xp)) T.xp[s] += x;
    }
    if(best.lampSkill) T.xp[best.lampSkill] += lampGain(best.e, best.lampSkill, T);
  }
  return picks;
}

/* Generate from the skill goals */
function generateFromGoals(){
  const goals = Object.entries(settings.goals).filter(([, v]) => v > 0);
  if(!goals.length){ toast('Enter at least one goal level in the Goals tab'); settings.skillTab = 'goals'; renderSkills(); return; }
  const replace = settings.genMode === 'replace';
  const start = replace ? startState() : sim.end;
  const variety = Math.max(1, settings.variety);
  const cap = {};
  SKILLS.forEach(s => cap[s] = Math.max(settings.goals[s] || 0, lvl(start, s)));
  const lockDef = settings.goals.DEFENCE === 1;
  const capState = newState(cap);
  const useStarter = replace && settings.mode === 'iron' && settings.startMode === 'fresh' && settings.autoStarter && settings.includeQuests;
  const build = rng => {
    const o = opts({rng, variety, capLevels:cap, capCombat:combatLevel(capState), defPure:settings.defPure || lockDef,
      questXp:settings.includeQuests, questUnlock:settings.includeQuests});
    const P = createPlanner(start, o);
    if(replace && isHardcore()) emitOpener(P);
    if(useStarter) P.emit('IRON_STARTER_PART1', 'Ironman starter route');
    if(settings.includeQuests){
      const picks = pickXpQuests(P, Object.fromEntries(goals), o);
      if(picks.length) P.achieve(picks);
    }
    const jobs = goals.filter(([s, v]) => v > lvl(P.S, s) && !(s === 'DEFENCE' && (lockDef || settings.defPure)))
      .map(([s, v]) => s === 'HITPOINTS' ? {special:'hp', target:v, why:`Goal: ${v} Hitpoints`} : {skill:s, target:v, why:`Goal: ${v} ${SKILL_LABEL(s)}`});
    P.trainMany(jobs);
    return P;
  };
  const P = bestPlan(build, variety, history());
  if(!P.out.length){ toast('Those goals are already met'); return; }
  const gen = spread(P.out, start, replace ? [] : recentSkills(tasks.length));
  pushHistory(gen.map(t => t.raw));
  pushUndo();
  if(replace) tasks = gen.slice(); else tasks.push(...gen);
  highlightIdx = replace ? 0 : tasks.length - gen.length;
  renderAll();
  toast(`Generated ${P.out.length} tasks, about ${fmtTime(P.minutes)}`);
}

/* ---------------- Optimize ---------------- */
function buildOptimized(){
  const start = startState();
  const items = tasks.map(t => ({t, p:parseRaw(t.raw)}));
  const hasStarter = items.some(i => i.p.kind === 'STARTER');
  const goals = [], skillGoals = [], anchors = [];
  const seen = new Set();
  let last = null;
  items.forEach(({t, p}, i) => {
    if(p.kind === 'STARTER' || t.hc) return;
    if(p.entry && (p.kind === 'QUEST' || p.kind === 'DIARY' || p.kind === 'MILESTONE')){
      if(!seen.has(p.key)){ seen.add(p.key); goals.push({key:p.key, raw:t.raw, why:t.why && !t.why.startsWith('Required') && !t.why.startsWith('Quest') ? t.why : 'From your list'}); }
      last = p.key; return;
    }
    if((p.kind === 'SKILL' || p.kind === 'ACTIVITY') && p.skill && p.level){ skillGoals.push({skill:p.skill, level:p.level, methodId:p.methodId, i}); return; }
    anchors.push({raw:t.raw, why:t.why || '', after:last});
  });
  const flushed = new Set();
  const flush = (P, key) => anchors.forEach((a, ai) => { if(!flushed.has(ai) && a.after === key){ flushed.add(ai); P.out.push({raw:a.raw, why:a.why}); applyTask(P.S, parseRaw(a.raw)); } });
  const maxPer = {}, goalMap = {};
  skillGoals.forEach(g => {
    const k = g.skill + '|' + (g.methodId || '');
    if(!maxPer[k] || g.level > maxPer[k].level) maxPer[k] = g;
    goalMap[g.skill] = Math.max(goalMap[g.skill] || 0, g.level);
  });
  /* Quests may only need levels the current list reaches anyway */
  const cap = {};
  SKILLS.forEach(sk => cap[sk] = Math.max(goalMap[sk] || 0, lvl(sim.end, sk), lvl(start, sk)));
  const o = opts({variety:0, capLevels:cap, capCombat:combatLevel(newState(cap)), onEmit:(p, P) => { if(p.key) flush(P, p.key); }});
  const P = createPlanner(start, o);
  if(isHardcore()) emitOpener(P);
  if(hasStarter) P.emit('IRON_STARTER_PART1', tasks.find(t => parseRaw(t.raw).kind === 'STARTER').why || 'Ironman starter route');
  flush(P, null);
  const xpQuests = settings.includeQuests && Object.keys(goalMap).length
    ? pickXpQuests(P, goalMap, o).filter(x => !goals.some(g => g.key === x.key)) : [];
  P.achieve(goals.concat(xpQuests));
  const jobs = Object.values(maxPer).sort((a, b) => a.i - b.i).filter(g => lvl(P.S, g.skill) < g.level)
    .map(g => g.skill === 'HITPOINTS' ? {special:'hp', target:g.level, why:`Your goal: ${g.level} Hitpoints`}
      : {skill:g.skill, target:g.level, why:`Your goal: ${g.level} ${SKILL_LABEL(g.skill)}`, forced:g.methodId || undefined});
  P.trainMany(jobs);
  anchors.forEach((a, ai) => { if(!flushed.has(ai)) P.out.push({raw:a.raw, why:a.why}); });
  return spread(P.out, start, []);
}
function lisIndices(seq){
  const n = seq.length, tails = [], prev = new Array(n), tailIdx = [];
  for(let i = 0; i < n; i++){
    let lo = 0, hi = tails.length;
    while(lo < hi){ const mid = (lo + hi) >> 1; if(tails[mid] < seq[i]) lo = mid + 1; else hi = mid; }
    tails[lo] = seq[i]; tailIdx[lo] = i; prev[i] = lo ? tailIdx[lo - 1] : -1;
  }
  const keep = new Set();
  let k = tailIdx[tails.length - 1];
  while(k !== undefined && k >= 0){ keep.add(k); k = prev[k]; }
  return keep;
}
let pendingOptimized = null;
function openOptimize(){
  if(!tasks.length){ toast('Add some tasks first'); return; }
  const before = sim;
  const newTasks = buildOptimized();
  const after = simulate(newTasks, startState(), opts());
  const norm = r => r.trim().toUpperCase();
  const pos = new Map();
  tasks.forEach((t, i) => { const k = norm(t.raw); if(!pos.has(k)) pos.set(k, []); pos.get(k).push(i); });
  const used = new Array(tasks.length).fill(false);
  const matchNew = newTasks.map(t => { const qd = pos.get(norm(t.raw)); if(qd && qd.length){ const i = qd.shift(); used[i] = true; return i; } return -1; });
  const added = [], removed = [], moved = [];
  newTasks.forEach((t, j) => { if(matchNew[j] < 0) added.push({j, t, p:after.rows[j].p}); });
  tasks.forEach((t, i) => {
    if(used[i]) return;
    const r = before.rows[i];
    let why = 'Not needed for your goals';
    if(r.dup) why = 'Duplicate of an earlier task';
    else if(r.redundant) why = r.redundant;
    else if(settings.defPure && (r.p.skill === 'DEFENCE' || (r.p.entry && pureBlocked(r.p.key)))) why = 'Gives Defence XP (pure)';
    else if(r.p.kind === 'SKILL' || (r.p.kind === 'ACTIVITY' && r.p.skill)) why = 'Replaced by goal-based training or quest XP';
    removed.push({i, t, p:r.p, why});
  });
  const common = []; newTasks.forEach((t, j) => { if(matchNew[j] >= 0) common.push({j, i:matchNew[j]}); });
  const keep = lisIndices(common.map(c => c.i));
  common.forEach((c, ci) => { if(!keep.has(ci)) moved.push({from:c.i, to:c.j, t:newTasks[c.j], p:after.rows[c.j].p}); });
  pendingOptimized = newTasks;

  const metric = (label, a, b, fmt, lowerBetter = true, oldPartial = false) => {
    const fa = fmt(a) + (oldPartial ? '+' : ''), fb = fmt(b);
    if(oldPartial && b > a) lowerBetter = null;
    const better = lowerBetter === null ? false : lowerBetter ? b < a : b > a;
    const worse = lowerBetter === null ? false : lowerBetter ? b > a : b < a;
    return `<div class="metric"><div class="m-label">${label}</div><div class="m-vals"><span class="m-old">${fa}</span><span class="m-arrow">${ICON.down}</span><span class="m-new ${better ? 'good' : worse ? 'bad' : ''}">${fb}</span></div></div>`;
  };
  const id = x => String(x);
  const rowHtml = (tag, cls, name, why, pos) => `<div class="chg"><span class="chg-tag ${cls}">${tag}</span><span class="chg-name">${name}</span>${pos ? `<span class="chg-pos">${pos}</span>` : ''}<span class="chg-why">${esc(why)}</span></div>`;
  const nameOf = (p) => esc(titleText(p));
  const groupHtml = (title, cls, list, render) => list.length ? `<details class="chg-group" open><summary><span class="dot ${cls}"></span>${title}<span class="cnt">${list.length}</span></summary><div class="chg-list">${list.map(render).join('')}</div></details>` : '';
  const quests = list => list.filter(x => x.p.kind !== 'SKILL' && !(x.p.kind === 'ACTIVITY' && x.p.skill));
  const skillsL = list => list.filter(x => x.p.kind === 'SKILL' || (x.p.kind === 'ACTIVITY' && x.p.skill));
  const nothing = !added.length && !removed.length && !moved.length;
  const body = nothing ? `<div class="opt-empty">Your list already follows the optimal order. No changes suggested.</div>` : `
    <div class="metrics">
      ${metric('Tasks', before.rows.length, after.rows.length, id, null)}
      ${metric('Estimated time', before.total, after.total, fmtTime, true, before.untimed > 0)}
      ${metric('Training time', before.training, after.training, fmtTime, true, before.untimed > 0)}
      ${metric('Unmet requirements', before.issues, after.issues, id)}
    </div>
    ${before.untimed ? `<div class="desc">The current list has ${before.untimed} task${before.untimed > 1 ? 's' : ''} the bot cannot train with its current unlocks, so its time estimate is incomplete.</div>` : ''}
    <div class="opt-groups">
      ${groupHtml('Added quests and tasks', 'add', quests(added), x => rowHtml('ADD', 'add', nameOf(x.p), x.t.why || 'Prerequisite', '#' + (x.j + 1)))}
      ${groupHtml('Added training', 'add', skillsL(added), x => rowHtml('ADD', 'add', nameOf(x.p), (x.t.why || '').split(' | ')[0], '#' + (x.j + 1)))}
      ${groupHtml('Reordered', 'move', moved, x => rowHtml('MOVE', 'move', nameOf(x.p), x.t.why ? x.t.why.split(' | ')[0] : 'Optimal quest order', `#${x.from + 1} to #${x.to + 1}`))}
      ${groupHtml('Removed', 'rem', removed, x => rowHtml('DROP', 'rem', nameOf(x.p), x.why, '#' + (x.i + 1)))}
    </div>
    <details class="chg-group preview"><summary><span class="dot"></span>Resulting list<span class="cnt">${newTasks.length}</span></summary>
      <ol class="preview-list">${newTasks.map((t, j) => `<li class="${matchNew[j] < 0 ? 'p-add' : moved.some(m => m.to === j) ? 'p-move' : ''}"><span class="p-raw">${esc(t.raw)}</span></li>`).join('')}</ol>
    </details>`;
  $('#optBody').innerHTML = body;
  $('#optSub').textContent = `Based on the OSRS Wiki optimal quest guide${settings.mode === 'iron' ? ' (Ironman)' : ''}, training split at goals and capped at ${fmtTime(settings.capMin)} per task.`;
  $('#optQuests').checked = settings.includeQuests;
  $('#optApply').style.display = nothing ? 'none' : '';
  openModal('#optModal');
}
function applyOptimize(){
  if(!pendingOptimized) return;
  pushUndo();
  tasks = pendingOptimized;
  pendingOptimized = null;
  closeModal('#optModal');
  renderAll();
  toast('Optimized list applied. Undo is available.');
}

/* ---------------- Modals ---------------- */
function openModal(sel){ $(sel).classList.remove('modal-hidden'); }
function closeModal(sel){ $(sel).classList.add('modal-hidden'); }
let paramCb = null;
function openParam({title, desc, kind, value, options, onOk}){
  $('#paramTitle').textContent = title;
  $('#paramDesc').textContent = desc || '';
  const wrap = $('#paramField');
  if(kind === 'level' || kind === 'number'){
    const extra = options ? `<select id="paramOpt" class="modal-input"><option value="">Use level</option>${options.map(x => `<option>${x}</option>`).join('')}</select>` : '';
    wrap.innerHTML = `<label class="modal-label">${kind === 'level' ? 'Target level' : 'Target'}</label><input id="paramInput" class="modal-input" type="number" min="1" max="${kind === 'level' ? 99 : 99999}" value="${esc(value)}">${extra}`;
  } else if(kind === 'option'){
    wrap.innerHTML = `<label class="modal-label">Option</label><select id="paramInput" class="modal-input">${options.map(x => `<option ${x === value ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
  } else {
    wrap.innerHTML = `<label class="modal-label">Value</label><input id="paramInput" class="modal-input" type="text" value="${esc(value)}">`;
  }
  paramCb = () => {
    const opt = $('#paramOpt') && $('#paramOpt').value;
    let v = opt || $('#paramInput').value.trim();
    if(!v) return;
    if(kind === 'level' && !opt){ v = Math.max(1, Math.min(99, parseInt(v, 10) || 1)); }
    closeModal('#paramModal');
    onOk(v);
  };
  openModal('#paramModal');
  setTimeout(() => { const i = $('#paramInput'); i.focus(); if(i.select) i.select(); }, 20);
}

let editIdx = -1;
function reqPreview(raw, S){
  const p = parseRaw(raw);
  if(p.entry && p.kind !== 'STARTER'){
    const chips = reqChips(p.entry, S);
    const pres = p.entry.pre.map(k => `<span class="chip ${S.done.has(k) ? 'ok' : 'bad'}">${esc(DB[k].name)}</span>`).join('');
    return (chips + pres) || 'No requirements.';
  }
  if(p.kind === 'SKILL' && p.skill && p.level){
    const m = trainMinutes(S, p.skill, p.level, opts());
    return `Currently ${lvl(S, p.skill)} ${SKILL_LABEL(p.skill)}. Estimated ${fmtTime(m)} to reach ${p.level}.`;
  }
  return 'No requirements known for this task.';
}
function openEdit(i){
  editIdx = i;
  $('#editInput').value = tasks[i].raw;
  $('#editWhy').value = tasks[i].why || '';
  $('#editReqs').innerHTML = reqPreview(tasks[i].raw, sim.states[i]);
  openModal('#editModal');
  setTimeout(() => { $('#editInput').focus(); $('#editInput').select(); }, 20);
}
function saveEdit(){
  const v = $('#editInput').value.trim();
  if(!v || editIdx < 0) return;
  pushUndo();
  tasks[editIdx] = {raw:v, why:$('#editWhy').value.trim()};
  highlightIdx = editIdx;
  closeModal('#editModal');
  renderAll();
}
let insertAt = 0;
function openInsert(i, dir){
  insertAt = dir === 'above' ? i : i + 1;
  $('#insertTitle').textContent = `Insert task ${dir === 'above' ? 'above' : 'below'} #${i + 1}`;
  $('#insertInput').value = '';
  $('#insertNote').textContent = settings.autofill ? 'Autofill is on: missing prerequisites and training are inserted with it.' : 'Autofill is off: only this task is inserted.';
  $('#insertReqs').innerHTML = 'Type a task to see its requirements.';
  openModal('#insertModal');
  setTimeout(() => $('#insertInput').focus(), 20);
}
function confirmInsert(){
  const raw = $('#insertInput').value.trim();
  if(!raw) return;
  closeModal('#insertModal');
  const p = parseRaw(raw);
  if(settings.autofill){
    if(p.entry && (p.kind === 'QUEST' || p.kind === 'DIARY' || p.kind === 'MILESTONE')){ planAndInsert({targets:[{key:p.key, raw, why:''}], label:p.entry.name, at:insertAt}); return; }
    if(p.kind === 'SKILL' && p.skill && p.level){ planAndInsert({skills:[{skill:p.skill, level:p.level, why:`Goal: ${p.level} ${SKILL_LABEL(p.skill)}`}], label:titleText(p), at:insertAt}); return; }
    if(p.kind === 'ACTIVITY'){ planAndInsert({acts:[{key:p.key, raw, why:''}], label:p.entry.name, at:insertAt}); return; }
  }
  pushUndo();
  tasks.splice(insertAt, 0, {raw, why:''});
  highlightIdx = insertAt;
  renderAll();
}

/* Import / export */
function parseLines(text){
  return text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('//'))
    .map(l => l.replace(/^[-*]\s+/, '').replace(/^:\w+:\s*/, '').replace(/\s+-\s+(QUEST|DIARY|SKILL)/, ' $1').trim())
    .map(l => { const a = l.match(/(ACQUIRE:.+)$/i); if(a) return fixAcquireRaw(a[1].trim());   /* item names have spaces */
      const m = l.match(/((?:QUEST|DIARY|SKILL|MINIGAME|REPEATING|MILESTONE|HUNTER_FARM):[^\s]+)/i); return m ? m[1] : l; });
}
function doImport(mode){
  const lines = parseLines($('#importText').value);
  if(!lines.length){ toast('Paste a task list first'); return; }
  pushUndo();
  const list = lines.map(raw => ({raw, why:''}));
  if(mode === 'replace') tasks = list; else tasks.push(...list);
  closeModal('#importModal');
  renderAll();
  toast(`Loaded ${list.length} tasks`);
}
function openExport(){
  $('#exportText').value = tasks.map(t => t.raw).join('\n');
  openModal('#exportModal');
}

/* Context menu */
let ctxIdx = -1;
function openCtx(e, i){
  ctxIdx = i;
  const m = $('#ctxMenu');
  m.style.display = 'block';
  const w = 210, h = 170;
  let x = e.clientX, y = e.clientY;
  if(x + w > innerWidth) x = innerWidth - w - 8;
  if(y + h > innerHeight) y = innerHeight - h - 8;
  m.style.left = x + 'px'; m.style.top = y + 'px';
}
function closeCtx(){ $('#ctxMenu').style.display = 'none'; }

/* Tooltip */
function showTip(html, x, y){
  const t = $('#tip');
  t.innerHTML = html; t.style.display = 'block';
  const r = t.getBoundingClientRect();
  t.style.left = Math.min(x + 14, innerWidth - r.width - 8) + 'px';
  t.style.top = Math.min(y + 14, innerHeight - r.height - 8) + 'px';
}
function hideTip(){ $('#tip').style.display = 'none'; }

/* ---------------- Events ---------------- */
function moveTask(from, to){
  to = Math.max(0, Math.min(tasks.length - 1, to));
  if(from === to){ renderAll(); return; }
  pushUndo();
  const [t] = tasks.splice(from, 1);
  tasks.splice(to, 0, t);
  highlightIdx = to;
  renderAll();
}

function bind(){
  const board = $('#board');
  board.addEventListener('click', e => {
    const card = e.target.closest('.card'); if(!card) return;
    const i = +card.dataset.i;
    if(e.target.closest('.delete-btn')){ pushUndo(); tasks.splice(i, 1); renderAll(); return; }
    if(e.target.closest('.fix-btn')){ fixRow(i); return; }
    if(e.target.closest('.order-box, .drag-handle')) return;
    openEdit(i);
  });
  board.addEventListener('change', e => {
    if(!e.target.classList.contains('order-box')) return;
    const i = +e.target.closest('.card').dataset.i;
    const v = parseInt(e.target.value, 10);
    if(isNaN(v)) { renderAll(); return; }
    moveTask(i, v - 1);
  });
  board.addEventListener('keydown', e => { if(e.target.classList.contains('order-box') && e.key === 'Enter') e.target.blur(); });
  board.addEventListener('mousedown', e => {
    const card = e.target.closest('.card'); if(!card) return;
    card.draggable = !e.target.closest('input, button');
  });
  board.addEventListener('contextmenu', e => {
    const card = e.target.closest('.card'); if(!card) return;
    e.preventDefault(); openCtx(e, +card.dataset.i);
  });
  let dragFrom = null, dropT = null;
  const clearDrop = () => $$('.drop-before, .drop-after').forEach(x => x.classList.remove('drop-before', 'drop-after'));
  board.addEventListener('dragstart', e => {
    const c = e.target.closest('.card'); if(!c) return;
    dragFrom = +c.dataset.i; c.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try{ e.dataTransfer.setData('text/plain', String(dragFrom)); }catch(err){}
  });
  board.addEventListener('dragover', e => {
    if(dragFrom === null) return;
    e.preventDefault();
    const br = board.getBoundingClientRect();
    if(e.clientY < br.top + 50) board.scrollTop -= 14; else if(e.clientY > br.bottom - 50) board.scrollTop += 14;
    const c = e.target.closest('.card');
    clearDrop();
    if(!c) return;
    const r = c.getBoundingClientRect();
    const after = e.clientY > r.top + r.height / 2;
    c.classList.add(after ? 'drop-after' : 'drop-before');
    dropT = {i:+c.dataset.i, after};
  });
  board.addEventListener('drop', e => {
    e.preventDefault();
    if(dragFrom === null || !dropT) return;
    let to = dropT.i + (dropT.after ? 1 : 0);
    if(to > dragFrom) to--;
    const f = dragFrom; dragFrom = null; dropT = null; clearDrop();
    moveTask(f, to);
  });
  board.addEventListener('dragend', () => { dragFrom = null; dropT = null; clearDrop(); $$('.dragging').forEach(x => x.classList.remove('dragging')); });

  $('#boardSearch').addEventListener('input', renderBoard);
  $('#boardClear').addEventListener('click', () => { $('#boardSearch').value = ''; renderBoard(); });

  /* Library */
  $('#libTabs').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; settings.libTab = b.dataset.tab; renderLibrary(); save(); });
  $('#libSort').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; settings.libSort = b.dataset.sort; settings.libCombat = false; renderLibrary(); save(); });
  $('#libCombat').addEventListener('click', () => { settings.libCombat = !settings.libCombat; renderLibrary(); save();
    if(settings.libCombat) toast('Showing quests with combat XP, fewest missing requirements first'); });
  $('#libSearch').addEventListener('input', renderLibrary);
  $('#libList').addEventListener('click', e => { const it = e.target.closest('.lib-item'); if(it) onLibClick(it.dataset.id); });
  $('#libList').addEventListener('mousemove', e => {
    const it = e.target.closest('.lib-item');
    if(!it){ hideTip(); return; }
    const e2 = DB[it.dataset.id];
    if(!e2 || e2.type === 'ACTIVITY'){ hideTip(); return; }
    const S = sim.end;
    const xp = Object.entries(e2.xp).map(([s, x]) => `${skillImg(s)}${x.toLocaleString()}`).join(' ');
    const pres = e2.pre.length ? e2.pre.map(k => `<span class="${S.done.has(k) ? 'ok' : 'bad'}">${esc(DB[k].name)}</span>`).join(', ') : 'None';
    showTip(`<div class="tip-title">${esc(e2.name)}</div>
      <div class="tip-row"><span>Requirements</span><div>${reqChips(e2, S) || 'None'}</div></div>
      <div class="tip-row"><span>Quests</span><div>${pres}</div></div>
      ${xp ? `<div class="tip-row"><span>XP reward</span><div>${xp}</div></div>` : ''}
      ${e2.lamp ? `<div class="tip-row"><span>Reward</span><div>${esc(e2.lamp)}</div></div>` : ''}
      ${e2.note ? `<div class="tip-row"><span>Note</span><div>${esc(e2.note)}</div></div>` : ''}
      <div class="tip-foot">Click to add${settings.autofill ? ' with prerequisites and training' : ' as a single task'}</div>`, e.clientX, e.clientY);
  });
  $('#libList').addEventListener('mouseleave', hideTip);

  /* Toolbar */
  $('#autofillToggle').addEventListener('change', e => { settings.autofill = e.target.checked; save(); renderLibrary(); toast(settings.autofill ? 'Autofill on: goals load full optimized task lists' : 'Autofill off: clicks add single tasks'); });
  $('#modeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return;
    const wasHc = isHardcore();
    settings.mode = b.dataset.mode === 'hcim' ? 'iron' : b.dataset.mode;
    settings.hardcore = b.dataset.mode === 'hcim';
    renderAll();
    if(isHardcore() && !wasHc) applyOpener();
    if(!isHardcore() && wasHc && tasks.some(t => t.hc)){ tasks.forEach(t => delete t.hc); save(); toast('Hardcore off: the opener tasks are now normal tasks'); }
    if(settings.acquire){ const d = refreshAcquires(settings.mode === 'iron'); if(d) toast(d > 0 ? `Added ${d} ACQUIRE tasks for quest items` : `Removed ${-d} ACQUIRE tasks (main account)`); } });
  $('#varietySel').addEventListener('change', e => { settings.variety = +e.target.value; save(); });
  $('#capSel').addEventListener('change', e => { settings.capMin = +e.target.value; save(); });
  $('#undoBtn').addEventListener('click', undo);
  $('#importBtn').addEventListener('click', () => { $('#importText').value = ''; openModal('#importModal'); setTimeout(() => $('#importText').focus(), 20); });
  $('#exportBtn').addEventListener('click', openExport);
  $('#clearBtn').addEventListener('click', () => { if(!tasks.length) return; pushUndo(); tasks = []; renderAll(); toast('List cleared. Undo is available.'); });
  $('#optimizeBtn').addEventListener('click', openOptimize);
  $('#shuffleBtn').addEventListener('click', shuffleList);
  $('#settingsBtn').addEventListener('click', () => {
    ['questXp','enforceRec','partner','wintertodt','autoStarter','spread','acquire'].forEach(k => $('#set_' + k).checked = !!settings[k]);
    $('#set_questPref').value = settings.questPref;
    openModal('#settingsModal');
  });
  ['questXp','enforceRec','partner','wintertodt','autoStarter','spread'].forEach(k => $('#set_' + k).addEventListener('change', e => { settings[k] = e.target.checked; renderAll(); }));
  $('#set_acquire').addEventListener('change', e => {
    settings.acquire = e.target.checked; save();
    const d = refreshAcquires(settings.acquire && settings.mode === 'iron');
    toast(settings.acquire ? (settings.mode === 'iron' ? `Quest item gathering on: ${d > 0 ? 'added ' + d + ' ACQUIRE tasks' : 'no gatherable items in this list'}` : 'Quest item gathering on (applies to ironman lists)')
      : `Quest item gathering off${d < 0 ? ': removed ' + (-d) + ' ACQUIRE tasks' : ''}`); });
  $('#pureToggle').addEventListener('change', e => { settings.defPure = e.target.checked; renderAll();
    toast(settings.defPure ? 'Pure on: no Defence training, no Defence XP from quests or lamps' : 'Pure off'); });
  $('#set_questPref').addEventListener('change', e => { settings.questPref = e.target.value; save(); });

  /* Skill window */
  $('#skillTabs').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; settings.skillTab = b.dataset.tab; renderSkills(); save(); });
  $('#skillGrid').addEventListener('change', e => {
    const inp = e.target.closest('.sk-input'); if(!inp) return;
    const s = inp.dataset.skill; let v = parseInt(inp.value, 10);
    if(settings.skillTab === 'goals'){
      if(isNaN(v) || v <= 0) delete settings.goals[s]; else settings.goals[s] = Math.max(1, Math.min(99, v));
      renderSkills(); save();
    } else if(settings.skillTab === 'start'){
      if(isNaN(v)) v = s === 'HITPOINTS' ? 10 : 1;
      settings.startLevels[s] = Math.max(1, Math.min(99, v));
      settings.startMode = 'custom';
      renderAll();
    }
  });
  $('#skillGrid').addEventListener('keydown', e => {
    if(!e.target.classList.contains('sk-input') || (e.key !== 'Enter' && e.key !== 'Tab')) return;
    if(e.key === 'Enter'){ e.preventDefault(); e.target.blur(); }
  });
  $('#skillGrid').addEventListener('click', e => {
    if(settings.skillTab !== 'projected') return;
    const t = e.target.closest('.sk'); if(!t) return;
    onLibClick('skill:' + t.dataset.skill);
  });
  $('#skillGrid').addEventListener('mousemove', e => {
    const t = e.target.closest('.sk'); if(!t){ hideTip(); return; }
    const s = t.dataset.skill, S = sim.end, xp = Math.floor(S.xp[s]), l = lvl(S, s);
    const goal = settings.goals[s];
    const nxt = l < 99 ? `${(xpFor(l + 1) - xp).toLocaleString()} XP to level ${l + 1}` : 'Max level';
    let g = '';
    if(goal && goal > l){ const m = trainMinutes(S, s, goal, opts()); g = `<div class="tip-row"><span>Goal ${goal}</span><div>${isFinite(m) ? 'about ' + fmtTime(m) + ' of training' : 'needs a quest unlock or combat training'}</div></div>`; }
    else if(goal) g = `<div class="tip-row"><span>Goal ${goal}</span><div class="ok">Reached</div></div>`;
    const m = bestMethod(s, l, S, opts());
    showTip(`<div class="tip-title">${skillImg(s)} ${SKILL_LABEL(s)}</div>
      <div class="tip-row"><span>XP</span><div>${xp.toLocaleString()}</div></div>
      <div class="tip-row"><span>Next</span><div>${nxt}</div></div>
      <div class="tip-row"><span>Method</span><div>${m ? esc(methLabel(m, opts())) + ', ' + Math.round(methRate(m, opts()) / 1000) + 'k/h' : (s === 'HITPOINTS' ? 'Trained with combat' : 'Needs unlock')}</div></div>${g}`, e.clientX, e.clientY);
  });
  $('#skillGrid').addEventListener('mouseleave', hideTip);
  $('#includeQuests').addEventListener('change', e => { settings.includeQuests = e.target.checked; save(); });
  $('#genSeg').addEventListener('click', e => { const b = e.target.closest('button'); if(!b) return; settings.genMode = b.dataset.gen; renderToolbar(); save(); });
  $('#generateBtn').addEventListener('click', generateFromGoals);
  $('#goalFillBtn').addEventListener('click', () => {
    const v = parseInt($('#goalFill').value, 10); if(!v) return;
    SKILLS.forEach(s => { if(s === 'DEFENCE' && settings.goals.DEFENCE === 1) return; settings.goals[s] = Math.max(1, Math.min(99, v)); });
    settings.skillTab = 'goals'; renderSkills(); save();
  });
  $('#goalClearBtn').addEventListener('click', () => { settings.goals = {}; renderSkills(); save(); });
  $('#startResetBtn').addEventListener('click', () => { settings.startMode = 'fresh'; settings.startLevels = {}; renderAll(); toast('Start reset to a fresh account'); });
  $('#startFromPlanBtn').addEventListener('click', () => {
    const S = sim.end; settings.startLevels = {}; SKILLS.forEach(s => settings.startLevels[s] = lvl(S, s));
    settings.startMode = 'custom'; renderAll(); toast('Start levels copied from the end of the plan');
  });

  /* Modals */
  $$('[data-close]').forEach(b => b.addEventListener('click', () => closeModal('#' + b.dataset.close)));
  $$('.modal-backdrop').forEach(m => m.addEventListener('mousedown', e => { if(e.target === m) m.classList.add('modal-hidden'); }));
  $('#paramOk').addEventListener('click', () => paramCb && paramCb());
  $('#paramModal').addEventListener('keydown', e => { if(e.key === 'Enter') paramCb && paramCb(); });
  $('#editSave').addEventListener('click', saveEdit);
  $('#editInput').addEventListener('input', () => { $('#editReqs').innerHTML = reqPreview($('#editInput').value, sim.states[editIdx] || sim.end); });
  $('#editModal').addEventListener('keydown', e => { if(e.key === 'Enter') saveEdit(); });
  $('#insertOk').addEventListener('click', confirmInsert);
  $('#insertInput').addEventListener('input', () => { $('#insertReqs').innerHTML = reqPreview($('#insertInput').value, sim.states[insertAt] || sim.end); });
  $('#insertInput').addEventListener('keydown', e => { if(e.key === 'Enter') confirmInsert(); });
  $('#importReplace').addEventListener('click', () => doImport('replace'));
  $('#importAppend').addEventListener('click', () => doImport('append'));
  $('#exportCopy').addEventListener('click', () => {
    const v = $('#exportText').value;
    (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast('Copied to clipboard'))
      .catch(() => { $('#exportText').select(); document.execCommand('copy'); toast('Copied to clipboard'); });
  });
  $('#exportDownload').addEventListener('click', () => {
    const blob = new Blob([$('#exportText').value], {type:'text/plain'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tasklist.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('#optApply').addEventListener('click', applyOptimize);
  $('#optQuests').addEventListener('change', e => { settings.includeQuests = e.target.checked; renderToolbar(); save(); openOptimize(); });

  /* Context menu */
  $('#ctxAbove').addEventListener('click', () => openInsert(ctxIdx, 'above'));
  $('#ctxBelow').addEventListener('click', () => openInsert(ctxIdx, 'below'));
  $('#ctxEdit').addEventListener('click', () => openEdit(ctxIdx));
  $('#ctxDelete').addEventListener('click', () => { pushUndo(); tasks.splice(ctxIdx, 1); renderAll(); });
  $('#ctxTop').addEventListener('click', () => moveTask(ctxIdx, 0));
  document.addEventListener('click', closeCtx);
  window.addEventListener('resize', closeCtx);
  document.addEventListener('scroll', closeCtx, true);
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closeCtx(); $$('.modal-backdrop').forEach(m => m.classList.add('modal-hidden')); hideTip(); }
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); undo(); }
  });

  /* Autocomplete */
  const opts2 = Object.values(DB).map(e => `<option value="${esc(e.raw)}">${esc(e.name)}</option>`).join('')
    + SKILLS.filter(s => s !== 'HITPOINTS').map(s => `<option value="SKILL:${RAW_SKILL(s)}:">${SKILL_LABEL(s)} training</option>`).join('');
  $('#taskList').innerHTML = opts2;
}

load();
bind();
renderAll();

/* ---------------- Shopping list ---------------- */
function buildShoppingList(){
  const o = opts();
  const questItems = new Map(), questRows = [], gear = [];
  const supplies = new Map(), tools = new Map(), reach = {};
  const addSup = (name, qty, src) => {
    const a = supplies.get(name) || {name, qty:0, src:new Set()};
    a.qty += qty; a.src.add(src); supplies.set(name, a);
  };
  tasks.forEach((t, i) => {
    const r = sim.rows[i], p = r.p;
    if(r.redundant) return;
    if(p.kind === 'QUEST' && p.entry){
      const items = QUEST_ITEMS[p.entry.id] || [];
      questRows.push({name:p.entry.name, items, gear:QUEST_GEAR[p.entry.id] || ''});
      items.forEach(it => {
        const tool = TOOL_ITEMS.has(it.name);
        const a = questItems.get(it.name) || {name:it.name, qty:0, tool, quests:[]};
        a.qty = tool ? Math.max(a.qty, it.qty) : a.qty + it.qty;
        a.quests.push(p.entry.name);
        questItems.set(it.name, a);
      });
      if(QUEST_GEAR[p.entry.id]) gear.push({quest:p.entry.name, text:QUEST_GEAR[p.entry.id]});
      return;
    }
    if(!(p.skill && p.level) || (p.kind !== 'SKILL' && p.kind !== 'ACTIVITY')) return;
    const S = sim.states[i];
    const startXp = S.xp[p.skill];
    if(xpFor(p.level) <= startXp) return;
    const rr = reach[p.skill] || (reach[p.skill] = {from:lvl(S, p.skill), to:0});
    rr.from = Math.min(rr.from, lvl(S, p.skill)); rr.to = Math.max(rr.to, p.level);
    for(let l = lvlOf(startXp); l < p.level; l++){
      const lo = Math.max(startXp, XP[l]), hi = XP[l + 1];
      if(hi <= lo) continue;
      const m = p.methodId ? methodById(p.methodId, l) : bestMethod(p.skill, l, S, o, false, p.kind === 'SKILL');
      if(!m) continue;
      const def = SUPPLIES[p.skill + '|' + m.label];
      if(!def) continue;
      const gain = hi - lo, src = `${SKILL_LABEL(p.skill)}: ${methLabel(m, o)}`;
      (def.items || []).forEach(([n, per, a, b]) => { if(a !== undefined && !(l >= a && l < (b || 99))) return; addSup(n, gain / per, src); });
      const rate = methRate(m, o);
      if(rate) (def.hourly || []).forEach(([n, ph]) => addSup(n, gain / rate * ph, src));
      (def.tools || []).forEach(n => { if(!tools.has(n)) tools.set(n, src); });
    }
  });
  const upgrades = [];
  Object.entries(TOOL_UPGRADES).forEach(([s, full]) => {
    const rr = reach[s];
    if(!rr) return;
    /* ironmen stop at steel (bought with ACQUIRE); better tools are not worth the coins */
    const list = settings.mode === 'iron' ? full.filter(([lv]) => lv <= 6) : full;
    let current = null;
    list.forEach(([lv, n]) => { if(lv <= rr.from) current = [lv, n]; else if(lv <= rr.to) upgrades.push({name:n, lvl:lv, skill:s}); });
    if(current) upgrades.unshift({name:current[1], lvl:current[0], skill:s, now:true});
  });
  upgrades.sort((x, y) => x.skill.localeCompare(y.skill) || (y.now ? 1 : 0) - (x.now ? 1 : 0) || x.lvl - y.lvl);
  return {questItems:[...questItems.values()], questRows, gear, supplies:[...supplies.values()], tools:[...tools.entries()], upgrades};
}
function openShopping(){
  if(!tasks.length){ toast('Add some tasks first'); return; }
  const L = buildShoppingList();
  const fmtQ = n => Math.ceil(n).toLocaleString();
  const byName = (a, b) => a.name === 'Coins' ? -1 : b.name === 'Coins' ? 1 : a.name.localeCompare(b.name);
  const consumables = L.questItems.filter(x => !x.tool).sort(byName);
  const qtools = L.questItems.filter(x => x.tool).sort(byName);
  const sup = L.supplies.filter(x => x.qty >= 0.5).sort((a, b) => a.name.localeCompare(b.name));
  const extraTools = L.tools.filter(([n]) => !L.upgrades.some(u => u.name === n || u.name.endsWith(' ' + n.toLowerCase())));
  const row = (qty, name, note, tag) => `<div class="shop-row"><span class="shop-qty">${qty}</span><span class="shop-name">${esc(name)}${tag ? `<span class="shop-tag">${tag}</span>` : ''}</span><span class="shop-note" title="${esc(note)}">${esc(note)}</span></div>`;
  const forQ = q => q.length > 3 ? `${q.slice(0, 3).join(', ')} +${q.length - 3} more` : q.join(', ');
  const iron = settings.mode === 'iron';
  let html = `<div class="shop-summary">
      <div class="metric"><div class="m-label">Quests</div><div class="m-new">${L.questRows.length}</div></div>
      <div class="metric"><div class="m-label">Quest items</div><div class="m-new">${consumables.length + qtools.length}</div></div>
      <div class="metric"><div class="m-label">Skilling supplies</div><div class="m-new">${sup.length}</div></div>
      <div class="metric"><div class="m-label">Tools and upgrades</div><div class="m-new">${extraTools.length + L.upgrades.length}</div></div>
    </div>`;
  html += `<div class="shop-section"><div class="shop-h">Quest items<span>${L.questRows.length} quest${L.questRows.length === 1 ? '' : 's'} not yet done in this list</span></div>`;
  if(!L.questRows.length) html += '<div class="desc">No quests in the list.</div>';
  else {
    const acqTag = x => settings.mode === 'iron' && settings.acquire && ACQUIRE_ITEMS[x.name] ? 'ACQUIRE' : '';
    html += `<div class="shop-list">${consumables.map(x => row(fmtQ(x.qty), x.name, forQ(x.quests), acqTag(x))).join('') || '<div class="desc">No consumable items.</div>'}</div>`;
    if(qtools.length) html += `<div class="shop-sub">Tools and equipment (one of each)</div><div class="shop-list">${qtools.map(x => row(fmtQ(x.qty), x.name, forQ(x.quests), 'KEEP')).join('')}</div>`;
    if(L.gear.length) html += `<div class="shop-sub">Also bring</div><div class="shop-list">${L.gear.map(g => row('', g.text, g.quest)).join('')}</div>`;
    html += `<details class="chg-group shop-detail"><summary><span class="dot"></span>Items by quest<span class="cnt">${L.questRows.length}</span></summary><div class="chg-list shop-byq">${
      L.questRows.map(q => `<div class="shop-q"><b>${esc(q.name)}</b><span>${q.items.length ? q.items.map(it => `${it.qty > 1 ? it.qty.toLocaleString() + ' x ' : ''}${esc(it.name)}`).join(', ') : 'No items'}${q.gear ? `; bring: ${esc(q.gear)}` : ''}</span></div>`).join('')}</div></details>`;
  }
  html += `</div><div class="shop-section"><div class="shop-h">Skilling supplies<span>${iron ? 'Ironman: gather or make these; gp-free methods need none' : 'Estimated from the XP each training task covers'}</span></div>`;
  html += sup.length ? `<div class="shop-list">${sup.map(x => row(fmtQ(x.qty), x.name, [...x.src].join(', '))).join('')}</div>`
    : '<div class="desc">The training in this list needs no supplies (gp-free methods, or no training).</div>';
  if(extraTools.length || L.upgrades.length){
    html += `<div class="shop-sub">Tools and upgrades</div><div class="shop-list">${
      L.upgrades.map(u => row(u.now ? 'now' : `at ${u.lvl}`, u.name, `${SKILL_LABEL(u.skill)} ${u.now ? '(current level)' : 'upgrade'}`, 'KEEP')).join('')
      + extraTools.map(([n, src]) => row('1', n, src, 'KEEP')).join('')}</div>`;
  }
  html += `<div class="desc shop-foot">Quest items come from each quest's wiki "Items required" list (items handed out during the quest are left out). Supply amounts are estimates from XP per action, rounded up.</div></div>`;
  $('#shopBody').innerHTML = html;
  $('#shopBody').dataset.text = shoppingText(L, consumables, qtools, sup, extraTools);
  openModal('#shopModal');
}
function shoppingText(L, consumables, qtools, sup, extraTools){
  const lines = ['QUEST ITEMS'];
  consumables.forEach(x => lines.push(`${Math.ceil(x.qty)} x ${x.name}`));
  if(qtools.length){ lines.push('', 'QUEST TOOLS (one of each)'); qtools.forEach(x => lines.push(x.name)); }
  if(L.gear.length){ lines.push('', 'ALSO BRING'); L.gear.forEach(g => lines.push(`${g.text} (${g.quest})`)); }
  lines.push('', 'SKILLING SUPPLIES');
  sup.forEach(x => lines.push(`${Math.ceil(x.qty)} x ${x.name}`));
  if(extraTools.length || L.upgrades.length){
    lines.push('', 'SKILLING TOOLS AND UPGRADES');
    L.upgrades.forEach(u => lines.push(`${u.name} (${SKILL_LABEL(u.skill)} ${u.now ? 'now' : u.lvl})`));
    extraTools.forEach(([n]) => lines.push(n));
  }
  return lines.join('\n');
}
$('#shopBtn').addEventListener('click', openShopping);
$('#shopCopy').addEventListener('click', () => {
  const v = $('#shopBody').dataset.text || '';
  (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => toast('Shopping list copied'))
    .catch(() => { const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('Shopping list copied'); });
});


/* ---------------- Shuffle ----------------
   Moves tasks a few places at a time and keeps a move only if the list stays valid and efficient:
   no new unmet requirements or redundant tasks, total time within 1% of the current list, and no new
   back-to-back training of one skill. Gather / coin tasks stay attached to the task they are for,
   and the ironman starter stays first. */
function shuffleList(){
  if(tasks.length < 3){ toast('Add some tasks first'); return; }
  const start = startState(), o = opts();
  const isGather = t => { const w = t.why || ''; return w.startsWith(ACQUIRE_WHY) || w.startsWith(COIN_WHY); };
  const b2b = s => s.rows.filter((r, i) => i && r.p.skill && r.p.level && s.rows[i - 1].p.skill === r.p.skill && s.rows[i - 1].p.level).length;
  const measure = list => { const s = simulate(list, start, o); return {issues:s.issues, red:s.rows.filter(r => r.redundant).length, total:s.total, b2b:b2b(s)}; };
  const m0 = measure(tasks);
  /* blocks: each task with the gather tasks right before it */
  const blocks = [];
  let cur = [];
  tasks.forEach(t => { cur.push(t); if(!isGather(t)){ blocks.push(cur); cur = []; } });
  if(cur.length) blocks.push(cur);
  const locked = b => b.some(t => parseRaw(t.raw).kind === 'STARTER');
  const hEnd = openerEnd(tasks);
  let seen = 0;
  blocks.forEach(b => { b.inOpener = seen <= hEnd; seen += b.length; });
  let order = blocks.slice();
  const want = Math.max(3, Math.round(blocks.length * 0.1));
  let moved = 0;
  const t0 = performance.now();
  for(let tries = 0; tries < want * 30 && moved < want && performance.now() - t0 < 2500; tries++){
    const i = Math.floor(Math.random() * order.length);
    if(locked(order[i])) continue;
    const d = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 4));
    const j = i + d;
    if(j < 0 || j >= order.length || locked(order[j]) || order[i].inOpener !== order[j].inOpener) continue;
    const cand = order.slice();
    const [b] = cand.splice(i, 1);
    cand.splice(j, 0, b);
    const m = measure(cand.flat());
    if(m.issues > m0.issues || m.red > m0.red || m.total > m0.total * 1.01 + 5 || (settings.spread && m.b2b > m0.b2b)) continue;
    order = cand;
    moved++;
  }
  if(!moved){ toast('No safe reorder found: this list is already tightly ordered'); return; }
  let next = order.flat();
  if(settings.acquire && settings.mode === 'iron') next = addAcquires(next, start, o);
  const changed = next.filter((t, i) => t !== tasks[i]).length;
  pushUndo();
  tasks = next;
  renderAll();
  const m1 = measure(tasks);
  const dt = m1.total - m0.total;
  toast(`Shuffled: ${changed} task${changed === 1 ? '' : 's'} changed position, time ${dt <= 0 ? 'unchanged' : '+' + fmtTime(dt)}. Undo restores the old order.`);
}


/* Switching an existing list to Hardcore: put the opener in front and drop what it replaces */
function applyOpener(){
  if(!tasks.length){ toast('Hardcore: new plans start with 9 Magic and Witch\'s House'); return; }
  if(tasks.some(t => t.hc)) return;
  const start = startState();
  const P = createPlanner(start, opts({variety:0}));
  emitOpener(P);
  const keys = new Set(P.out.map(t => parseRaw(t.raw).key).filter(Boolean));
  const rest = tasks.filter(t => { const p = parseRaw(t.raw); return !(p.kind === 'QUEST' && keys.has(p.key)); });
  let list = P.out.concat(rest);
  if(settings.acquire) list = addAcquires(list, start, opts());
  const s2 = simulate(list, start, opts());
  list = list.filter((t, i) => !(s2.rows[i].p.kind === 'SKILL' && s2.rows[i].redundant && !t.hc));
  pushUndo();
  tasks = list;
  highlightIdx = 0;
  renderAll();
  toast('Hardcore: 9 Magic and Witch\'s House now come first. Undo is available.');
}
