/* ==========================================================================
   OSRS Account Builder - simulation and planning engine
   ========================================================================== */
'use strict';

/* ---------------- XP ---------------- */
const XP = [0, 0];
(function(){ let pts = 0; for(let l = 1; l < 99; l++){ pts += Math.floor(l + 300 * Math.pow(2, l / 7)); XP[l + 1] = Math.floor(pts / 4); } })();
function xpFor(l){ return XP[Math.max(1, Math.min(99, l))]; }
function lvlOf(xp){ for(let l = 99; l > 1; l--) if(xp >= XP[l]) return l; return 1; }

const SKILL_LABEL = s => s === 'RUNECRAFT' ? 'Runecraft' : s.charAt(0) + s.slice(1).toLowerCase();
const RAW_SKILL = s => s === 'RUNECRAFT' ? 'RUNECRAFTING' : s;
/* XP a quest's lamps can put into skill s at state S */
function lampGain(e, s, S){
  let t = 0;
  for(const l of (e && e.lamps) || []) if((!l.skills || l.skills.includes(s)) && lvl(S, s) >= l.min) t += l.xp * l.n;
  return t;
}
/* Quests that unlock a skill with no training method yet (ironmen have their own list) */
function unlockKeys(m, o){ return (o.mode === 'iron' && m.iunlock && m.iunlock.length) ? m.iunlock : m.unlock; }
/* Pure accounts: anything that gives Defence XP or needs Defence above 1 */
function pureBad(e){
  if(!e) return false;
  if((e.xp.DEFENCE || 0) > 0) return true;
  for(const r of [e.req, e.ireq, e.rec, e.irec]) if(r && (r.DEFENCE || 0) > 1) return true;
  return false;
}
/* The task, or an unfinished quest it depends on, would give Defence XP */
function pureBlocked(k, S, seen){
  seen = seen || new Set();
  if(seen.has(k)) return null;
  seen.add(k);
  const e = DB[k];
  if(!e || (S && S.done.has(k))) return null;
  if(pureBad(e)) return k;
  for(const p of e.pre){ const b = pureBlocked(p, S, seen); if(b) return b; }
  return null;
}
/* Ironman defaults: Client of Kourend's two lamps (1,000 XP) take Magic from 1 to 9 on their own,
   so X Marks the Spot's lamp goes on Slayer. A lamp suffix typed by hand is kept. */
const IRON_LAMP_SKILL = {X_MARKS_THE_SPOT:'SLAYER', CLIENT_OF_KOUREND:'MAGIC'};
function fixedLampSkill(e, o){ return (o && o.mode === 'iron' && e && IRON_LAMP_SKILL[e.id]) || null; }
/* lampGain, respecting the fixed ironman choices */
function lampGainFor(e, s, S, o){ const f = fixedLampSkill(e, o); return f && f !== s ? 0 : lampGain(e, s, S); }
/* Task string that tells the backend which skill to use the lamps on */
function lampRaw(e, s){ return `${e.raw}:${s === 'RUNECRAFT' ? 'RC' : s}`; }

/* ---------------- RNG ---------------- */
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, rng){ for(let i = arr.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

/* ---------------- State ---------------- */
function newState(levels){
  const xp = {};
  SKILLS.forEach(s => xp[s] = 0);
  xp.HITPOINTS = XP[10];
  if(levels) Object.entries(levels).forEach(([s, l]) => { if(s in xp && l) xp[s] = Math.max(xp[s], XP[Math.max(1, Math.min(99, l))]); });
  return {xp, done:new Set(), qp:0, items:{}};
}
/* items: bank stock of gathered items (lowercase backend name -> amount), for ACQUIRE min-max */
function cloneState(S){ return {xp:{...S.xp}, done:new Set(S.done), qp:S.qp, items:{...(S.items || {})}}; }
function lvl(S, s){ return lvlOf(S.xp[s]); }
function combatLevel(S){
  const L = s => lvl(S, s);
  const base = 0.25 * (L('DEFENCE') + L('HITPOINTS') + Math.floor(L('PRAYER') / 2));
  const melee = 0.325 * (L('ATTACK') + L('STRENGTH'));
  const range = 0.325 * Math.floor(L('RANGED') * 1.5);
  const mage = 0.325 * Math.floor(L('MAGIC') * 1.5);
  return Math.floor(base + Math.max(melee, range, mage));
}
function raise(S, s, l){
  const t = xpFor(l), before = S.xp[s];
  if(t > before){ S.xp[s] = t; if(COMBAT_TRAIN.has(s)) S.xp.HITPOINTS += (t - before) / 3; }
}
function applyStarter(S){
  STARTER.quests.forEach(id => { const k = 'QUEST:' + id; if(!S.done.has(k)){ S.done.add(k); S.qp += (DB[k] ? DB[k].qp : 0); } });
  Object.entries(STARTER.levels).forEach(([s, l]) => { if(S.xp[s] < XP[l]) S.xp[s] = XP[l]; });
  S.done.add('IRON_STARTER_PART1');
}

/* ---------------- Parsing ---------------- */
function parseRaw(raw){
  const r = (raw || '').trim();
  const U = r.toUpperCase();
  const parts = U.split(':');
  if(U === 'IRON_STARTER_PART1') return {kind:'STARTER', key:'IRON_STARTER_PART1', entry:DB.IRON_STARTER_PART1, raw:r};
  if(parts[0] === 'QUEST' || parts[0] === 'DIARY' || parts[0] === 'MILESTONE'){
    let id = parts[1] || '';
    if(QUEST_ALIAS[id]) id = QUEST_ALIAS[id];
    const key = parts[0] + ':' + id;
    return {kind:parts[0], key, entry:DB[key] || null, raw:r, id, lampSkill:(parts[2] && SKILL_ALIASES[parts[2]]) || null};
  }
  if(parts[0] === 'SKILL'){
    const s = SKILL_ALIASES[parts[1]] || null;
    const l = parseInt(parts[2], 10);
    return {kind:'SKILL', skill:s, level: isNaN(l) ? null : Math.max(1, Math.min(99, l)), raw:r, mod:parts[3] || ''};
  }
  for(let n = parts.length; n >= 1; n--){
    const k = parts.slice(0, n).join(':');
    const e = DB[k];
    if(e && e.type === 'ACTIVITY'){
      const p = {kind:'ACTIVITY', key:k, entry:e, raw:r, group:e.group};
      if(e.skill){
        const lv = parseInt(parts[n], 10);
        if(!isNaN(lv)){
          p.level = Math.max(1, Math.min(99, lv)); p.skill = e.skill; p.methodId = e.method;
          if(k === 'MINIGAME:LIBRARY' && parts[n + 1] === 'RC'){ p.skill = 'RUNECRAFT'; p.methodId = 'LIB_RC'; }
        }
      }
      return p;
    }
  }
  if(!U.includes(':')) return {kind:'HEADER', raw:r};
  return {kind:'OTHER', raw:r};
}

/* ---------------- Requirements ---------------- */
function mergedReqs(e, o){
  const out = {};
  const add = (obj, rec) => Object.entries(obj || {}).forEach(([k, v]) => {
    if(!out[k] || v > out[k].v) out[k] = {v, rec};
  });
  add(e.req, false);
  if(o.mode === 'iron') add(e.ireq, false);
  if(o.enforceRec || o.showRec){ add(e.rec, true); if(o.mode === 'iron') add(e.irec, true); }
  return out;
}
/* Returns a list of unmet requirements. Types: skill, qp, cb, sum, pre, any */
function missingReqs(e, S, o){
  const out = [];
  if(!e) return out;
  const m = mergedReqs(e, o);
  for(const [k, {v, rec}] of Object.entries(m)){
    if(k === 'QP'){ if(S.qp < v) out.push({t:'qp', need:v, have:S.qp, rec}); }
    else if(k === 'CB'){ const c = combatLevel(S); if(c < v) out.push({t:'cb', need:v, have:c, rec}); }
    else if(k === 'ATTSTR'){ const h = lvl(S,'ATTACK') + lvl(S,'STRENGTH'); if(h < v) out.push({t:'sum', need:v, have:h, rec}); }
    else if(SKILLS.includes(k)){ const h = lvl(S, k); if(h < v) out.push({t:'skill', skill:k, need:v, have:h, rec}); }
  }
  for(const p of e.pre) if(!S.done.has(p)) out.push({t:'pre', key:p});
  if(e.any){ const [n, list] = e.any; const have = list.filter(k => S.done.has(k)).length; if(have < n) out.push({t:'any', n, have, list}); }
  return out;
}

/* ---------------- Methods and time ---------------- */
function methRate(m, o){ return o.mode === 'iron' ? m.irate : m.rate; }
function methLabel(m, o){ return (o.mode === 'iron' && m.ilabel) ? m.ilabel : m.label; }
function methodUsable(m, l, S, o, ignoreQuests){
  if(!(m.from <= l && l < m.to)) return false;
  if(!methRate(m, o)) return false;
  if(m.toggle === 'wintertodt' && !o.wintertodt) return false;
  for(const [k, v] of Object.entries(m.req)) if(lvl(S, k) < v) return false;
  if(!ignoreQuests && m.pre.some(p => !S.done.has(p))) return false;
  return true;
}
/* Alternatives are only picked for variety; 'main' alternatives are the default on ironmen */
function isAlt(m, o){ return m.alt === true || (m.alt === 'main' && o.mode !== 'iron'); }
/* plainOnly: only methods a plain SKILL:X task uses (minigame methods need their own task string) */
/* Ironmen take a gp-free method over one that needs gp whenever one is usable, even if slower */
function methodBetter(m, best, o){
  if(!best) return true;
  if(o.mode === 'iron' && m.gp !== best.gp) return !m.gp;
  return methRate(m, o) > methRate(best, o);
}
function bestMethod(s, l, S, o, ignoreQuests, plainOnly){
  let best = null;
  for(const m of (METHODS[s] || [])){
    if(isAlt(m, o)) continue;
    if(plainOnly && m.raw) continue;
    if(!methodUsable(m, l, S, o, ignoreQuests)) continue;
    if(methodBetter(m, best, o)) best = m;
  }
  return best;
}
function trainMinutes(S, s, target, o, methodId){
  const cur = S.xp[s], goal = xpFor(target);
  if(goal <= cur) return 0;
  let t = 0;
  for(let l = lvlOf(cur); l < target; l++){
    const lo = Math.max(cur, XP[l]), hi = XP[l + 1];
    if(hi <= lo) continue;
    const m = methodId ? methodById(methodId, l) : bestMethod(s, l, S, o, false, true);
    const r = m ? methRate(m, o) : 0;
    if(!r) return Infinity;
    t += (hi - lo) / r * 60;
  }
  return t;
}
function entryMinutes(e, o){
  if(!e) return 0;
  if(e.type === 'ACTIVITY') return 0;
  const base = LEN_MIN[e.len] || 30;
  return Math.round(base * (o.mode === 'iron' ? 1.3 : 1));
}
function taskMinutes(S, p, o){
  if(p.kind === 'QUEST' || p.kind === 'DIARY' || p.kind === 'MILESTONE'){
    if(!p.entry || S.done.has(p.key)) return 0;
    return entryMinutes(p.entry, o);
  }
  if(p.kind === 'STARTER') return S.done.has('IRON_STARTER_PART1') ? 0 : 600;
  if((p.kind === 'SKILL' || p.kind === 'ACTIVITY') && p.skill && p.level) return trainMinutes(S, p.skill, p.level, o, p.methodId);
  return 0;
}
function applyTask(S, p){
  switch(p.kind){
    case 'STARTER': applyStarter(S); break;
    case 'QUEST': case 'DIARY': case 'MILESTONE':
      if(p.entry && !S.done.has(p.key)){
        S.done.add(p.key); S.qp += p.entry.qp || 0;
        for(const [s, x] of Object.entries(p.entry.xp)) S.xp[s] += x;
        if(p.lampSkill){ const g = lampGain(p.entry, p.lampSkill, S); if(g) S.xp[p.lampSkill] += g; }
        if(p.kind === 'QUEST' && typeof consumeQuestItems === 'function') consumeQuestItems(S, p.entry);
      }
      break;
    case 'ACTIVITY':
      S.done.add(p.key);
      if(p.skill && p.level) raise(S, p.skill, p.level);
      if(p.key === 'ACQUIRE' && typeof acquireXp === 'function') acquireXp(S, p.raw);
      break;
    case 'SKILL':
      if(p.skill && p.level && lvl(S, p.skill) < p.level && typeof consumeTraining === 'function') consumeTraining(S, p.skill, xpFor(p.level) - S.xp[p.skill]);
      if(p.skill && p.level) raise(S, p.skill, p.level);
      break;
  }
}

/* ---------------- Guide order ---------------- */
const GUIDE_IDX = {iron:{}, main:{}};
GUIDE_IRON.forEach((k, i) => GUIDE_IDX.iron[normKey(k)] = i);
GUIDE_MAIN.forEach((k, i) => GUIDE_IDX.main[normKey(k)] = i);
const GUIDE_FALLBACK = {iron:{}, main:{}};
function guideIdx(k, mode){
  const g = GUIDE_IDX[mode];
  if(k in g) return g[k];
  const f = GUIDE_FALLBACK[mode];
  if(k in f) return f[k];
  f[k] = 400;
  const e = DB[k];
  if(e && e.pre.length) f[k] = Math.max(...e.pre.map(p => guideIdx(p, mode))) + 0.5;
  return f[k];
}

/* ---------------- Simulation ---------------- */
function simulate(tasks, start, o){
  const S = cloneState(start);
  const rows = [], states = [];
  let total = 0, training = 0, issues = 0, warns = 0, untimed = 0;
  const seen = new Map();
  tasks.forEach(t => {
    states.push(cloneState(S));
    const p = parseRaw(t.raw);
    const row = {p, issues:[], warns:[], redundant:'', minutes:0, dup:false};
    const ku = t.raw.trim().toUpperCase();
    if(seen.has(ku) && !ku.startsWith('ACQUIRE:')) row.dup = true;   /* the same gather task may repeat before several quests */
    seen.set(ku, true);
    if(p.entry && p.kind !== 'STARTER'){
      if((p.kind === 'QUEST' || p.kind === 'DIARY' || p.kind === 'MILESTONE') && S.done.has(p.key)) row.redundant = 'Already completed earlier';
      else {
        const miss = missingReqs(p.entry, S, Object.assign({}, o, {showRec:true}));
        row.issues = miss.filter(m => !m.rec);
        row.warns = miss.filter(m => m.rec);
      }
    } else if(p.kind === 'STARTER' && S.done.has('IRON_STARTER_PART1')) row.redundant = 'Starter already applied';
    if(p.skill && p.level){
      const cur = lvl(S, p.skill);
      if(cur >= p.level){ if(p.kind === 'SKILL') row.redundant = `Already level ${cur}`; }
      else {
        if(p.kind === 'SKILL' && COMBAT_TRAIN.has(p.skill) === false && !METHODS[p.skill].length)
          row.issues.push({t:'text', text:'No supported training method for this skill'});
        const plain = p.kind === 'SKILL';
        const best = bestMethod(p.skill, cur, S, o, false, plain), any = bestMethod(p.skill, cur, S, o, true, plain);
        if(!p.methodId && !best){
          const zero = (METHODS[p.skill] || []).find(m => m.from <= cur && cur < m.to && m.unlock.length);
          if(zero) row.issues.push({t:'text', text:`No training method below ${zero.to}: use ${unlockKeys(zero, o).map(k => DB[k].name).join(' / ')}`});
          else if(any) row.issues.push({t:'text', text:`Needs ${any.pre.filter(k => !S.done.has(k)).map(k => DB[k].name).join(', ')} for ${any.label}`});
          else if(METHODS[p.skill] && METHODS[p.skill].length) row.issues.push({t:'text', text:'No supported training method at this level'});
        } else if(!p.methodId && best && any && any !== best && methRate(any, o) > methRate(best, o) * 1.25){
          row.warns.push({t:'text', text:`Faster with ${any.pre.filter(k => !S.done.has(k)).map(k => DB[k].name).join(', ')} (${any.label})`});
        }
        /* a minigame task string would train this faster */
        if(plain){
          const mg = bestMethod(p.skill, cur, S, o);
          const gpFree = o.mode === 'iron' && best && best.gp && mg && !mg.gp;
          if(mg && mg.raw && (!best || gpFree || methRate(mg, o) > methRate(best, o) * 1.25))
            row.warns.push({t:'text', text:`${gpFree ? 'No-gp method' : 'Faster'}: ${mg.raw.replace('{L}', p.level)} (${mg.label}); Optimize will switch it`});
          else if(o.mode === 'iron' && best && best.isuffix && ':' + p.mod !== best.isuffix)
            row.warns.push({t:'text', text:`Add ${best.isuffix} to use the ${best.label.toLowerCase()} (no gp); Optimize will add it`});
        }
        if(p.methodId){
          const mm = METHOD_BY_ID[p.methodId];
          if(mm && mm.pre.some(k => !S.done.has(k))) row.issues.push(...mm.pre.filter(k => !S.done.has(k)).map(k => ({t:'pre', key:k})));
        }
      }
    }
    if(o.mode === 'iron' && p.entry && p.entry.noIron && !row.redundant) row.issues.push({t:'text', text:'Not possible on an ironman: imp beads only drop from imps'});
    if(o.defPure){
      const pureMsg = text => row.issues.push({t:'text', text});
      if(p.entry && p.kind !== 'STARTER' && !row.redundant){
        if((p.entry.xp.DEFENCE || 0) > 0) pureMsg(`Gives ${p.entry.xp.DEFENCE.toLocaleString()} Defence XP (pure)`);
        else if(pureBad(p.entry)) pureMsg('Needs Defence above 1 (pure)');
      }
      if(p.skill === 'DEFENCE') pureMsg('Trains Defence (pure)');
      if(p.lampSkill === 'DEFENCE') pureMsg('Lamp XP on Defence (pure)');
      if(/:(DEFENCE|DEF)\s*$/.test(p.raw.toUpperCase()) && p.kind !== 'SKILL' && p.key !== 'ACQUIRE' && p.lampSkill !== 'DEFENCE') pureMsg('Uses the Defence combat style (pure)');
      if(p.kind === 'QUEST' && p.key === 'QUEST:MONKEY_MADNESS_I' && /TAKEXP/i.test(p.raw)) pureMsg('Monkey Madness I XP reward can include Defence (pure)');
    }
    row.minutes = taskMinutes(S, p, o);
    if(!isFinite(row.minutes)){
      row.minutes = 0; untimed++;
      if(p.skill && p.level && !row.issues.length && !p.methodId){
        for(let l = lvl(S, p.skill); l < p.level; l++){
          if(bestMethod(p.skill, l, S, o)) continue;
          const any = bestMethod(p.skill, l, S, o, true);
          const need = any ? any.pre.filter(k => !S.done.has(k)).map(k => DB[k].name) : [];
          row.issues.push({t:'text', text: need.length ? `Needs ${need.join(', ')} to train past ${l} (${any.label})` : `No supported method past level ${l}`});
          break;
        }
      }
    }
    if(p.skill && p.level) training += row.minutes;
    if(p.skill && p.level && o.capMin && row.minutes > o.capMin * 1.05 + 1){
      row.warns.push({t:'text', text: p.level - lvl(S, p.skill) <= 1
        ? 'This single level takes longer than the max task length'
        : 'Longer than the max task length; Optimize will split it'});
    }
    total += row.minutes;
    if(row.issues.length) issues++;
    if(row.warns.length) warns++;
    applyTask(S, p);
    rows.push(row);
  });
  return {rows, states, end:S, total, training, issues, warns, untimed};
}

/* ---------------- Milestones ---------------- */
function milestoneAt(s, l){ const m = MILESTONES[s]; return m && m[l] ? m[l] : null; }
function nextMilestone(s, l){
  const m = MILESTONES[s] || {};
  let best = null;
  for(const k of Object.keys(m)){ const v = +k; if(v > l && (best === null || v < best)) best = v; }
  return best === null ? null : {lvl:best, label:m[best]};
}

/* Minutes to reach a requirement level, for deciding whether a quest is worth doing.
   Unlike trainMinutes it never gives up: Hitpoints come from Attack/Strength training (3 XP per
   Hitpoints XP), and levels with no method yet count the quests that unlock training (Witch's Potion
   and Imp Catcher for Magic, Druidic Ritual for Herblore, Plague City for Construction ...). */
function reqTrainMinutes(S, s, target, o){
  if(lvl(S, s) >= target) return 0;
  if(s === 'HITPOINTS'){
    const m = bestMethod('STRENGTH', lvl(S, 'STRENGTH'), S, o);
    const r = m ? methRate(m, o) : 8000;
    return (xpFor(target) - S.xp.HITPOINTS) * 3 / r * 60;
  }
  const T = cloneState(S);
  let extra = 0;
  for(let guard = 0; guard < 6; guard++){
    const t = trainMinutes(T, s, target, o);
    if(isFinite(t)) return t + extra;
    /* find the first level with no usable method and the quests that would fix it */
    let l = lvl(T, s);
    while(l < target && bestMethod(s, l, T, o, false, true)) l++;
    const zero = (METHODS[s] || []).find(m => m.from <= l && l < m.to && m.unlock.length);
    const any = bestMethod(s, l, T, o, true, true);
    const keys = zero ? unlockKeys(zero, o) : any ? any.pre : [];
    const todo = keys.filter(k => !T.done.has(k));
    if(!todo.length) return Infinity;
    /* unlock quests' lamps go on the skill being unlocked when they can (Client of Kourend for Magic) */
    todo.forEach(k => { extra += entryMinutes(DB[k], o); applyTask(T, parseRaw(lampGainFor(DB[k], s, T, o) > 0 ? lampRaw(DB[k], s) : DB[k].raw)); });
  }
  return Infinity;
}
/* How much of the requirement training a quest causes counts against it: the levels are
   permanent progress the account needs later anyway */
const REQ_TRAIN_WEIGHT = 0.5;

/* ---------------- Planner ----------------
   Builds an ordered task list that reaches the requested targets.
   Strategy:
     1. Collect every prerequisite quest of the targets.
     2. Repeatedly do the ready quest that comes first in the wiki optimal order.
     3. When nothing is ready, look at the next blocked quest:
        - quest points short: add filler quests in optimal order
        - skills short: first do quests whose XP rewards cover the gap
          (when the time saved outweighs the quest), then train the rest
     4. Training is split at gear and method milestones and capped per task. */
function createPlanner(start, o){
  const S = cloneState(start);
  const out = [];
  const rng = o.rng || Math.random;
  const J = [0, 3, 7, 12][o.variety || 0];
  const jit = {};
  const unlockTried = new Set();
  const bonusKeys = new Set();   /* quests added for their XP: resolved before the quest that wanted it */
  const rawFor = {};             /* task string overrides, e.g. lamp skill suffix */
  const P = {S, out, minutes:0, notes:[], skipped:new Map()};
  const pri = k => { if(!(k in jit)) jit[k] = J ? rng() * J : 0; return guideIdx(k, o.mode) + jit[k]; };
  const byPri = (a, b) => pri(a) - pri(b);

  function emit(raw, why){
    const p = parseRaw(raw);
    const m = taskMinutes(S, p, o);
    P.minutes += isFinite(m) ? m : 0;
    applyTask(S, p);
    out.push({raw, why: why || ''});
    if(o.onEmit) o.onEmit(p, P);
  }
  P.emit = emit;

  function excluded(k, ignoreCaps){
    const e = DB[k];
    if(!e) return true;
    if(e.partner && !o.partner) return true;
    if(e.noIron && o.mode === 'iron') return true;
    if(o.defPure && pureBad(e)) return true;
    if(o.capLevels && !ignoreCaps){
      const m = mergedReqs(e, o);
      for(const [s, {v}] of Object.entries(m)) if(SKILLS.includes(s) && v > (o.capLevels[s] || 1)) return true;
      if(m.CB && m.CB.v > (o.capCombat || 3)) return true;
    }
    return false;
  }
  P.excluded = excluded;
  function preDone(k){
    const e = DB[k];
    if(!e) return true;
    if(e.pre.some(p => !S.done.has(p))) return false;
    if(e.any){ const [n, list] = e.any; if(list.filter(x => S.done.has(x)).length < n) return false; }
    return true;
  }
  const miss = k => {
    const m = missingReqs(DB[k], S, o).filter(x => x.t !== 'pre' && x.t !== 'any');
    if(!o.gatherReqs || typeof gatherNeeds !== 'function') return m;
    for(const g of gatherNeeds(DB[k], S, o)){
      const cur = m.find(x => x.t === 'skill' && x.skill === g.skill);
      if(!cur) m.push(g); else if(g.need > cur.need){ cur.need = g.need; cur.gather = g.gather; }
    }
    return m;
  };
  const isReady = k => preDone(k) && miss(k).length === 0;

  function closure(k, why, acc, parent){
    acc = acc || new Map();
    if(S.done.has(k) || acc.has(k)) return acc;
    const e = DB[k];
    if(!e) return acc;
    acc.set(k, parent ? `Required for ${DB[parent].name}` : why);
    e.pre.forEach(p => closure(p, why, acc, k));
    if(e.any){
      const [n, list] = e.any;
      let have = list.filter(x => S.done.has(x) || acc.has(x)).length;
      const cand = list.filter(x => !S.done.has(x) && !acc.has(x) && !excluded(x)).sort(byPri);
      for(const c of cand){ if(have >= n) break; closure(c, `Kudos for ${e.name}`, acc, null); acc.set(c, `Kudos for ${e.name}`); have++; }
    }
    return acc;
  }
  P.closure = closure;

  function closureMinutes(keys){
    const acc = new Map();
    keys.forEach(k => closure(k, '', acc));
    let t = 0;
    acc.forEach((_, k) => t += entryMinutes(DB[k], o));
    return {t, acc};
  }

  /* --- Quest XP before training --- */
  function rateFor(s, l){
    if(s === 'HITPOINTS'){ const m = bestMethod('STRENGTH', lvl(S,'STRENGTH'), S, o); return m ? methRate(m, o) / 3 : 5000; }
    const m = bestMethod(s, l, S, o);
    return m ? methRate(m, o) : 0;
  }
  /* Quests worth doing for XP instead of training. `defs` lists every skill the blocked quest (or goal)
     is short on, [{skill, need}], and a quest is valued by the training it saves across all of them
     (Waterfall's Attack AND Strength for Demon Slayer). Counts XP lamps (on the def skill where they save
     the most) and allows quests that still need a little training in other skills when that is cheaper
     overall. The best net saving wins; ties follow the wiki optimal order. */
  function bestBonus(defs, needed){
    const defXp = {};
    defs.forEach(d => { defXp[d.skill] = Math.max(0, xpFor(d.need) - S.xp[d.skill]); });
    const skills = Object.keys(defXp).filter(k => defXp[k] > 0);
    if(!skills.length) return null;
    const saveFor = (sk, use) => {
      if(use <= 0) return 0;
      if(sk === 'HITPOINTS'){ const r = rateFor(sk, lvl(S, sk)); return r > 0 ? use / r * 60 : 999; }
      return xpMinutes(S, sk, use, o);
    };
    const factor = o.questFactor === undefined ? 0.5 : o.questFactor;
    const cands = [];
    for(const e of Object.values(DB)){
      if(e.type !== 'QUEST' || S.done.has(e.key) || needed.has(e.key) || excluded(e.key, true)) continue;
      let saved = 0;
      const gains = {};
      for(const sk of skills){
        const use = Math.min(e.xp[sk] || 0, defXp[sk]);
        if(use > 0){ saved += saveFor(sk, use); gains[sk] = use; }
      }
      /* lamps: on the short skill where they save the most */
      let lampSkill = null, lampSave = 0, lampUse = 0;
      for(const sk of skills){
        const lx = lampGainFor(e, sk, S, o);
        if(!lx) continue;
        const left = defXp[sk] - (gains[sk] || 0);
        const use = Math.min(lx, left);
        const sv = saveFor(sk, (gains[sk] || 0) + use) - saveFor(sk, gains[sk] || 0);
        if(use > 0 && sv > lampSave){ lampSkill = sk; lampSave = sv; lampUse = use; }
      }
      if(lampSkill){ saved += lampSave; gains[lampSkill] = (gains[lampSkill] || 0) + lampUse; }
      if(saved <= 0) continue;
      const mm = miss(e.key);
      if(mm.some(x => x.t !== 'skill')) continue;
      /* a requirement in a skill we are already short on is fine when it is no higher than the level being
         worked toward and the quest gives no XP in it (Waterfall's 20 Hitpoints for Demon Slayer): that
         level is reached anyway, so it costs nothing extra */
      const sameSkill = mm.filter(x => defXp[x.skill] !== undefined);
      const goalOf = sk => (defs.find(d => d.skill === sk) || {}).need || 0;
      if(sameSkill.some(x => x.need > goalOf(x.skill) || gains[x.skill])) continue;
      let extra = 0, bad = false;
      for(const x of mm){
        if(defXp[x.skill] !== undefined) continue;
        const t = reqTrainMinutes(S, x.skill, x.need, o); if(!isFinite(t)){ bad = true; break; } extra += t * REQ_TRAIN_WEIGHT;
      }
      if(bad) continue;
      let add = [e.key];
      if(!preDone(e.key)){
        if(e.any) continue;
        const pend = e.pre.filter(p => !S.done.has(p));
        if(pend.length > 2 || pend.some(p => !isReady(p) || excluded(p) || needed.has(p))) continue;
        add = pend.concat([e.key]);
      }
      const qmin = add.reduce((t, k) => t + entryMinutes(DB[k], o), 0) + extra;
      if(saved < qmin * factor) continue;
      cands.push({key:e.key, add, gains, lampSkill, net:saved - qmin * factor});
    }
    cands.sort((x, y) => (y.net - x.net) || (pri(x.key) - pri(y.key)));
    return cands[0] || null;
  }
  const gainText = g => Object.entries(g.gains).map(([sk, x]) => `+${Math.round(x).toLocaleString()} ${SKILL_LABEL(sk)}${sk === g.lampSkill ? ' (incl. lamps)' : ''}`).join(', ');

  /* --- Training --- */
  function pickMelee(){
    const a = lvl(S, 'ATTACK'), s = lvl(S, 'STRENGTH');
    if(a === s) return (J && rng() < 0.5) ? 'ATTACK' : 'STRENGTH';
    return a < s ? 'ATTACK' : 'STRENGTH';
  }
  function chooseMethod(s, l){
    const best = bestMethod(s, l, S, o);
    if(!J) return best;
    const pool = (METHODS[s] || []).filter(m => methodUsable(m, l, S, o, false) && (!best || methRate(m, o) >= methRate(best, o) * 0.85)
      && !(o.mode === 'iron' && best && !best.gp && m.gp));
    if(!pool.length) return best;
    return pool[Math.floor(rng() * pool.length)];
  }
  function considerUnlock(s, cur, T){
    const avail = bestMethod(s, cur, S, o);
    if(!avail){
      const zero = (METHODS[s] || []).find(m => m.from <= cur && cur < m.to && m.unlock.length);
      if(zero){
        const all = unlockKeys(zero, o).filter(k => !S.done.has(k) && !unlockTried.has(k) && !excluded(k));
        /* only as many unlock quests as it takes to reach a trainable level: biggest XP first,
           a quest's unfinished prerequisites from the list come with it (Client of Kourend needs X Marks the Spot) */
        const gain = k => (DB[k].xp[s] || 0) + lampGainFor(DB[k], s, S, o);
        const needXp = xpFor(zero.to) - S.xp[s];
        const keys = [];
        let got = 0;
        for(const k of all.slice().sort((a, b) => gain(b) - gain(a))){
          if(got >= needXp) break;
          if(keys.includes(k)) continue;
          for(const p of DB[k].pre) if(all.includes(p) && !keys.includes(p)){ keys.push(p); got += gain(p); }
          keys.push(k); got += gain(k);
        }
        /* keep the planner's prerequisite order */
        keys.sort((a, b) => all.indexOf(a) - all.indexOf(b));
        if(keys.length){
          keys.forEach(k => { unlockTried.add(k); if(lampGainFor(DB[k], s, S, o) > 0) rawFor[k] = lampRaw(DB[k], s); });   /* any-skill lamps go on this skill */
          return {keys, why:`Quest XP to unlock ${SKILL_LABEL(s)} training`};
        }
        return null;
      }
    }
    const any = bestMethod(s, cur, S, o, true);
    if(!any) return null;
    const pend = any.pre.filter(k => !S.done.has(k));
    if(!pend.length || pend.every(k => unlockTried.has(k)) || pend.some(k => excluded(k))) return null;
    if(avail && o.mode === 'iron' && avail.gp && !any.gp){
      /* gp-free method behind a quest: worth it on an ironman if the unlock is short */
      const {t, acc} = closureMinutes(pend);
      for(const k of acc.keys()) if(excluded(k)) return null;
      if(t > 120) return null;
    } else if(avail){
      if(!o.questUnlock) return null;
      if(methRate(any, o) < methRate(avail, o) * 1.25) return null;
      const lo = Math.max(cur, any.from), hi = Math.min(T, any.to);
      if(hi <= lo) return null;
      const xp = xpFor(hi) - Math.max(S.xp[s], xpFor(lo));
      const saved = xp / methRate(avail, o) * 60 - xp / methRate(any, o) * 60;
      const {t, acc} = closureMinutes(pend);
      for(const k of acc.keys()) if(excluded(k)) return null;
      if(saved < t) return null;
    }
    pend.forEach(k => unlockTried.add(k));
    return {keys:pend, why:`Unlocks ${any.label} for ${SKILL_LABEL(s)}`};
  }
  /* Ironmen only buy the steel tool: don't label levels with tools they won't buy */
  const ironTool = label => o.mode === 'iron' && label && /\b(axe|pickaxe)$/i.test(label) && !/^(Steel|Bronze)/.test(label);
  function chunkLabel(s, b, T, why, meth, methText){
    let ml = milestoneAt(s, b);
    if(ironTool(ml)) ml = null;
    const ml2 = methText || (meth ? methLabel(meth, o) : 'No supported method');
    let goal;
    if(b >= T) goal = ml && !why.includes(ml) ? `${why} (${ml})` : why;
    else if(ml) goal = `${ml} at ${b}`;
    else { const nm = nextMilestone(s, b); goal = nm && nm.lvl <= T && !ironTool(nm.label) ? `Toward ${nm.label} at ${nm.lvl}` : `Toward ${why.replace(/^(Goal|Your goal): /, '')}`; }
    return `${goal} | ${ml2}`;
  }
  function skillChunk(s, T, why, forced){
    const cur = lvl(S, s);
    /* A forced minigame method can't start below its entry level (e.g. Motherlode Mine at 30):
       train normally up to it first */
    if(forced){
      const fm = METHOD_BY_ID[forced];
      const entry = fm ? Math.max(fm.from, ...Object.entries(fm.req).filter(([k]) => k === s).map(([, v]) => v)) : 1;
      if(fm && cur < entry){
        return skillChunk(s, Math.min(T, entry), `${fm.label} needs ${entry} ${SKILL_LABEL(s)}`, null);
      }
    }
    if(!forced){
      const un = considerUnlock(s, cur, T);
      if(un) return {unlock:un.keys, why:un.why};
    }
    const meth = forced ? methodById(forced, cur) : chooseMethod(s, cur);
    let b = T;
    const nm = nextMilestone(s, cur);
    if(nm && nm.lvl < b) b = nm.lvl;
    if(meth && meth.to > cur && meth.to < b) b = meth.to;
    if(!forced){
      for(const m of (METHODS[s] || [])){
        if(isAlt(m, o) || m.from <= cur || m.from >= b) continue;
        if(meth && !methodBetter(m, meth, o)) continue;
        if(!methRate(m, o) || m.pre.some(p => !S.done.has(p))) continue;
        if(Object.entries(m.req).some(([k, v]) => lvl(S, k) < v)) continue;
        if(m.toggle === 'wintertodt' && !o.wintertodt) continue;
        b = m.from;
      }
    }
    const rate = meth ? methRate(meth, o) : 0;
    const cap = o.capMin * (J ? (0.78 + 0.22 * rng()) : 1);
    const mins = l => rate > 0 ? (xpFor(l) - S.xp[s]) / rate * 60 : 0;
    if(rate > 0 && mins(b) > cap){ let l = cur + 1; while(l < b && mins(l + 1) <= cap) l++; b = l; }
    /* A very short chunk is merged into the next range. A minigame or suffixed method can only
       merge within its own range; a plain SKILL task may run on into the next plain method
       (the backend switches methods by level), timed level by level. */
    let methText = null;
    if(rate > 0 && mins(b) < (o.minChunk || 12) && b < T){
      let nb = T;
      const n2 = nextMilestone(s, b);
      if(n2 && n2.lvl < nb) nb = n2.lvl;
      const fixed = !!(forced || meth.raw);
      if(fixed) nb = meth.to > b ? Math.min(nb, meth.to) : b;
      else for(let l = b; l < nb; l++){
        const m2 = bestMethod(s, l, S, o);
        if(!m2 || m2.raw || m2.isuffix !== meth.isuffix){ nb = l; break; }
      }
      const tm = l => fixed ? mins(l) : trainMinutes(S, s, l, o);
      if(nb > b){ if(tm(nb) <= cap) b = nb; else { let l = b; while(l < nb && tm(l + 1) <= cap) l++; b = l; } }
      if(!fixed){
        const endM = bestMethod(s, b - 1, S, o, false, true);
        if(endM && endM !== meth && methLabel(endM, o) !== methLabel(meth, o)) methText = `${methLabel(meth, o)}, then ${methLabel(endM, o)}`;
      }
    }
    b = Math.max(cur + 1, Math.min(99, b));
    const raw = meth && meth.raw ? meth.raw.replace('{L}', b)
      : `SKILL:${RAW_SKILL(s)}:${b}${o.mode === 'iron' && meth && meth.isuffix ? meth.isuffix : ''}`;
    return {raw, why: chunkLabel(s, b, T, why, meth, methText)};
  }
  function jobDone(j){
    if(j.special === 'hp') return lvl(S, 'HITPOINTS') >= j.target;
    if(j.special === 'cb') return combatLevel(S) >= j.target;
    if(j.special === 'sum') return lvl(S, 'ATTACK') + lvl(S, 'STRENGTH') >= j.target;
    return lvl(S, j.skill) >= j.target;
  }
  function nextChunk(j){
    if(j.special === 'hp'){
      const s = pickMelee();
      const need = (xpFor(j.target) - S.xp.HITPOINTS) * 3 + 1;
      let T = lvlOf(S.xp[s] + need); if(xpFor(T) < S.xp[s] + need) T++;
      return skillChunk(s, Math.min(99, T), j.why);
    }
    if(j.special === 'cb'){
      const s = pickMelee();
      const C = cloneState(S); let T = lvl(S, s);
      while(T < 99 && combatLevel(C) < j.target){ T++; raise(C, s, T); }
      return skillChunk(s, T, j.why);
    }
    if(j.special === 'sum'){
      const a = lvl(S, 'ATTACK'), st = lvl(S, 'STRENGTH');
      const s = a <= st ? 'ATTACK' : 'STRENGTH';
      return skillChunk(s, Math.min(99, lvl(S, s) + (j.target - a - st)), j.why);
    }
    return skillChunk(j.skill, j.target, j.why, j.forced);
  }
  function runJob(j){
    const r = nextChunk(j);
    if(r.unlock){ achieve(r.unlock.map(k => ({key:k, why:r.why}))); return; }
    emit(r.raw, r.why);
  }
  function trainMany(jobs){
    if(o.defPure) jobs = jobs.filter(j => j.skill !== 'DEFENCE');
    let act = jobs.filter(j => !jobDone(j));
    if(!act.length) return;
    let guard = 0;
    if(!J){
      for(const j of act){ while(!jobDone(j) && guard++ < 600) runJob(j); }
      return;
    }
    shuffle(act, rng);
    while(act.length && guard++ < 600){
      for(const j of act){ if(!jobDone(j)) runJob(j); }
      act = act.filter(j => !jobDone(j));
    }
  }
  P.trainMany = trainMany;

  function resolve(k, needed){
    const e = DB[k];
    const m = miss(k);
    const qpM = m.find(x => x.t === 'qp');
    if(qpM){
      const cands = Object.values(DB).filter(x => x.type === 'QUEST' && x.qp > 0 && !S.done.has(x.key) && !needed.has(x.key) && !excluded(x.key));
      const ready = cands.filter(x => isReady(x.key)).sort((a, b) => pri(a.key) - pri(b.key));
      if(ready.length){ needed.set(ready[0].key, `Quest points for ${e.name} (${S.qp}/${qpM.need})`); return true; }
      const nxt = cands.filter(x => { const c = closure(x.key, '', new Map()); for(const kk of c.keys()) if(excluded(kk)) return false; return true; })
        .sort((a, b) => pri(a.key) - pri(b.key))[0];
      if(nxt){ closure(nxt.key, `Quest points for ${e.name} (${S.qp}/${qpM.need})`, needed); return true; }
    }
    const sk = m.filter(x => x.t === 'skill' || x.t === 'cb' || x.t === 'sum');
    if(!sk.length) return false;
    if(o.questXp){
      const defs = sk.filter(dd => dd.t === 'skill').map(dd => ({skill:dd.skill, need:dd.need}));
      const b = defs.length ? bestBonus(defs, needed) : null;
      if(b){
        bonusKeys.add(b.key);
        if(b.lampSkill) rawFor[b.key] = lampRaw(DB[b.key], b.lampSkill);
        b.add.forEach(kk => { if(!needed.has(kk)) needed.set(kk, kk === b.key
          ? `Quest XP: ${gainText(b)} toward ${e.name}`
          : `Required for ${DB[b.key].name}`); });
        return true;
      }
    }
    const jobs = sk.map(dd => {
      if(dd.t === 'cb') return {special:'cb', target:dd.need, why:`${e.name} needs combat ${dd.need}`};
      if(dd.t === 'sum') return {special:'sum', target:dd.need, why:`${e.name} needs Attack + Strength ${dd.need}`};
      if(dd.skill === 'HITPOINTS') return {special:'hp', target:dd.need, why:`${e.name} needs ${dd.need} Hitpoints`};
      if(dd.gather) return {skill:dd.skill, target:dd.need, why:`Gather ${dd.gather} for ${e.name}: needs ${dd.need} ${SKILL_LABEL(dd.skill)}`};
      return {skill:dd.skill, target:dd.need, why:`${e.name} needs ${dd.need} ${SKILL_LABEL(dd.skill)}`};
    });
    trainMany(jobs);
    return true;
  }

  /* Pull in quest-point fillers up front, in optimal order, preferring quests whose
     requirements stay within the levels the plan has to reach anyway. */
  function prefillQp(needed){
    let qpNeed = 0, qpFor = null;
    needed.forEach((_, k) => { const r = DB[k].req.QP || 0; if(r > qpNeed){ qpNeed = r; qpFor = DB[k].name; } });
    let proj = S.qp;
    needed.forEach((_, k) => proj += DB[k].qp || 0);
    if(proj >= qpNeed) return;
    const ceil = {}; let ceilCb = combatLevel(S);
    SKILLS.forEach(s => ceil[s] = lvl(S, s));
    needed.forEach((_, k) => { const m = mergedReqs(DB[k], o);
      for(const [s, {v}] of Object.entries(m)){ if(SKILLS.includes(s) && v > ceil[s]) ceil[s] = v; if(s === 'CB' && v > ceilCb) ceilCb = v; } });
    const fits = k => {
      const c = closure(k, '', new Map());
      for(const kk of c.keys()){
        if(needed.has(kk)) continue;
        if(excluded(kk)) return null;
        const m = mergedReqs(DB[kk], o);
        for(const [s, {v}] of Object.entries(m)){
          if(SKILLS.includes(s) && v > ceil[s]) return null;
          if(s === 'QP' && v > qpNeed) return null;
          if(s === 'CB' && v > ceilCb) return null;
        }
      }
      return c;
    };
    const cands = Object.values(DB).filter(e => e.type === 'QUEST' && e.qp > 0 && !S.done.has(e.key) && !needed.has(e.key))
      .sort((a, b) => pri(a.key) - pri(b.key));
    for(const e of cands){
      if(proj >= qpNeed) break;
      if(needed.has(e.key)) continue;
      const c = fits(e.key);
      if(!c) continue;
      c.forEach((w, kk) => {
        if(needed.has(kk) || S.done.has(kk)) return;
        needed.set(kk, kk === e.key ? `Quest points toward ${qpNeed} for ${qpFor}` : w);
        proj += DB[kk].qp || 0;
      });
    }
  }

  /* Ironman with Magic below 7 has no Magic method at all: any lamp that can go on Magic does */
  function lampDefault(k){
    const e = DB[k];
    const f = fixedLampSkill(e, o);
    if(f) return lampRaw(e, f);
    if(o.mode !== 'iron' || !e || !e.lamps || !e.lamps.length || lvl(S, 'MAGIC') >= 7) return null;
    return lampGain(e, 'MAGIC', S) > 0 ? lampRaw(e, 'MAGIC') : null;
  }
  let depth = 0;
  function achieve(targets){
    if(depth > 4) return;
    depth++;
    const needed = new Map();
    const finalRaw = {};
    if(o.mode === 'iron') targets = targets.filter(t => { if(DB[t.key] && DB[t.key].noIron){ P.skipped.set(t.key, t.key); return false; } return true; });
    if(o.defPure){
      /* Pure: a goal that gives Defence XP, or depends on a quest that does, is skipped entirely */
      targets = targets.filter(t => { const b = pureBlocked(t.key, S); if(b){ P.skipped.set(t.key, b); return false; } return true; });
    }
    for(const t of targets){ closure(t.key, t.why || '', needed); if(t.raw) finalRaw[t.key] = t.raw; }
    if(o.defPure){
      /* Pure: drop every quest that gives Defence XP and everything that depends on one */
      for(const k of [...needed.keys()]){
        const b = pureBlocked(k, S);
        if(b){ needed.delete(k); if(!P.skipped.has(k)) P.skipped.set(k, b); }
      }
    }
    prefillQp(needed);
    let guard = 0;
    while(guard++ < 5000){
      const pending = [...needed.keys()].filter(k => !S.done.has(k));
      if(!pending.length) break;
      const avail = pending.filter(preDone);
      if(!avail.length){
        const k = pending.sort(byPri)[0];
        emit(finalRaw[k] || rawFor[k] || lampDefault(k) || DB[k].raw, (needed.get(k) || '') + ' (prerequisites could not be planned)');
        continue;
      }
      const ready = avail.filter(k => miss(k).length === 0).sort(byPri);
      if(ready.length){ const k = ready[0]; emit(finalRaw[k] || rawFor[k] || lampDefault(k) || DB[k].raw, needed.get(k)); continue; }
      avail.sort((a, b) => ((bonusKeys.has(b) ? 1 : 0) - (bonusKeys.has(a) ? 1 : 0)) || byPri(a, b));
      const blk = avail[0];
      const before = out.length + S.qp + needed.size;
      const ok = resolve(blk, needed);
      if(!ok || before === out.length + S.qp + needed.size)
        emit(finalRaw[blk] || rawFor[blk] || lampDefault(blk) || DB[blk].raw, (needed.get(blk) || '') + ' (requirements could not be planned)');
    }
    depth--;
  }
  P.achieve = achieve;

  /* Train a skill to a level (with unlock quests and quest XP handled by the job runner) */
  P.addSkill = function(skill, level, why){
    /* Quest XP first: do worthwhile quests that give XP (or lamps) in this skill, then train the rest */
    if(o.questXp){
      for(let g = 0; g < 25 && lvl(S, skill) < level; g++){
        const b = bestBonus([{skill, need:level}], new Map());
        if(!b) break;
        bonusKeys.add(b.key);
        if(b.lampSkill) rawFor[b.key] = lampRaw(DB[b.key], b.lampSkill);
        const before = out.length;
        achieve(b.add.map(k => ({key:k, why: k === b.key
          ? `Quest XP: ${gainText(b)} toward ${level} ${SKILL_LABEL(skill)}`
          : `Required for ${DB[b.key].name}`})));
        if(out.length === before) break;
      }
    }
    if(skill === 'HITPOINTS') trainMany([{special:'hp', target:level, why}]);
    else trainMany([{skill, target:level, why}]);
  };
  /* Add a minigame / repeating / other backend task after meeting its requirements */
  P.addActivity = function(key, raw, why){
    const e = DB[key];
    const p = parseRaw(raw);
    if(e && e.pre.length) achieve(e.pre.map(k => ({key:k, why:`Required for ${e.name}`})));
    if(e){
      const m = missingReqs(e, S, o).filter(x => x.t === 'skill' || x.t === 'cb');
      if(m.length) trainMany(m.map(dd => dd.t === 'cb'
        ? {special:'cb', target:dd.need, why:`${e.name} needs combat ${dd.need}`}
        : (dd.skill === 'HITPOINTS' ? {special:'hp', target:dd.need, why:`${e.name} needs ${dd.need} Hitpoints`}
        : {skill:dd.skill, target:dd.need, why:`${e.name} needs ${dd.need} ${SKILL_LABEL(dd.skill)}`})));
    }
    if(p.skill && p.level && p.methodId && METHOD_BY_ID[p.methodId]) trainMany([{skill:p.skill, target:p.level, why, forced:p.methodId}]);
    else emit(raw, why);
  };
  return P;
}

/* ---------------- Variety across plans ---------------- */
function seqDistance(a, b){
  const pa = new Set(), pb = new Set();
  for(let i = 0; i + 1 < a.length; i++) pa.add(a[i] + '>' + a[i + 1]);
  for(let i = 0; i + 1 < b.length; i++) pb.add(b[i] + '>' + b[i + 1]);
  if(!pa.size && !pb.size) return 0;
  let inter = 0; pa.forEach(x => { if(pb.has(x)) inter++; });
  return 1 - inter / (pa.size + pb.size - inter);
}
/* Builds several candidate plans, keeps the ones within 4% of the fastest,
   and returns the one least similar to recently generated plans. */
function bestPlan(build, variety, history){
  if(!variety) return build(mulberry32(1));
  const cands = [];
  for(let k = 0; k < 6; k++){
    const seed = (Math.random() * 4294967296) >>> 0;
    cands.push(build(mulberry32(seed)));
  }
  const fastest = Math.min(...cands.map(c => c.minutes));
  const pool = cands.filter(c => c.minutes <= fastest * 1.04 + 5);
  if(!history || !history.length) return pool[Math.floor(Math.random() * pool.length)];
  let best = pool[0], bestD = -1;
  for(const c of pool){
    const seq = c.out.map(t => t.raw);
    const dmin = Math.min(...history.map(h => seqDistance(seq, h)));
    if(dmin > bestD){ bestD = dmin; best = c; }
  }
  return best;
}

/* ---------------- Training alternation ----------------
   Reorders a valid plan so training chunks of the same skill are not back to back and repeat
   visits to a skill are spaced as far apart as possible. Rules that keep the plan valid and
   no slower:
     - chunks of one skill keep their order; non-training tasks keep their order
     - a chunk never moves ahead of a non-training task that came before it, unless that task
       gives no XP in the chunk's skill and the chunk is not slower at the new position
     - a quest/diary is placed as soon as its requirements are met (quest XP first)
     - a chunk is only placed where it is not slower than at its original position
   `recent` lists the skills of the tasks just before the block (most recent last). */
function spreadTraining(list, start, o, recent){
  if(list.length < 3) return list.slice();
  const base = simulate(list, start, o);
  const isChunk = p => !!(p.skill && p.level && (p.kind === 'SKILL' || p.kind === 'ACTIVITY'));
  const main = [], streams = {};
  let mc = 0;
  list.forEach((t, i) => {
    const p = base.rows[i].p;
    const it = {t, p, i, mins: base.rows[i].minutes};
    if(isChunk(p)){ it.barrier = mc; (streams[p.skill] = streams[p.skill] || []).push(it); }
    else { it.mi = mc++; main.push(it); }
  });
  const reqCount = (e, S) => missingReqs(e, S, o).filter(m => o.enforceRec || !m.rec).length
    + (o.gatherReqs && typeof gatherNeeds === 'function' ? gatherNeeds(e, S, o).length : 0);
  main.forEach(it => { if(it.p.entry && it.p.kind !== 'STARTER') it.base = reqCount(it.p.entry, base.states[it.i]); });
  const S = cloneState(start);
  const out = [];
  const lastAt = {};
  (recent || []).forEach((s, k, arr) => { if(s) lastAt[s] = k - arr.length; });
  let placed = 0, prevSkill = recent && recent.length ? recent[recent.length - 1] : null;
  const place = it => {
    applyTask(S, it.p); out.push(it.t);
    if(isChunk(it.p)){ lastAt[it.p.skill] = out.length; prevSkill = it.p.skill; } else prevSkill = null;
  };
  const mainReady = it => !it.p.entry || it.p.kind === 'STARTER' || reqCount(it.p.entry, S) <= (it.base || 0);
  const chunkOk = it => {
    if(lvl(S, it.p.skill) >= it.p.level) return true;
    /* Wintertodt planned after 50 Woodcutting (magic log rolls) stays after it */
    if(it.p.methodId === 'WT' && lvl(base.states[it.i], 'WOODCUTTING') >= 50 && lvl(S, 'WOODCUTTING') < 50) return false;
    if(it.p.methodId){ const m = METHOD_BY_ID[it.p.methodId]; if(m && lvl(S, it.p.skill) < m.from) return false; }
    const m = taskMinutes(S, it.p, o);
    return isFinite(m) && m <= it.mins * 1.05 + 1;
  };
  /* a chunk may jump ahead of the not-yet-placed tasks before its barrier only if none of them feed its skill */
  const jumpOk = it => {
    for(let k = placed; k < it.barrier; k++){
      const e = main[k].p.entry;
      if(!e) continue;
      if((e.xp && e.xp[it.p.skill]) || main[k].p.kind === 'STARTER') return false;
      const ms = METHODS[it.p.skill] || [];
      if(ms.some(m => m.pre.includes(e.key))) return false;
    }
    return true;
  };
  const gap = s => lastAt[s] === undefined ? 1e9 : out.length - lastAt[s];
  let guard = 0;
  while(guard++ < 20000){
    const heads = Object.values(streams).filter(q => q.length).map(q => q[0]);
    const head = main[placed];
    if(!head && !heads.length) break;
    /* drop chunks the account has already passed */
    const done = heads.find(h => lvl(S, h.p.skill) >= h.p.level);
    if(done){ streams[done.p.skill].shift(); continue; }
    if(head && mainReady(head)){
      /* training that came before a quest giving XP in the same skill stays before it:
         otherwise the quest XP makes the training redundant and changes the plan (e.g. Hitpoints) */
      const e = head.p.entry;
      const feeds = h => head.p.kind === 'STARTER' || (e && ((e.xp && e.xp[h.p.skill]) || head.p.lampSkill === h.p.skill));
      const must = heads.filter(h => h.barrier <= placed && feeds(h));
      if(!must.length){ place(head); placed++; continue; }
      must.sort((a, b) => ((a.p.skill === prevSkill) - (b.p.skill === prevSkill)) || (gap(b.p.skill) - gap(a.p.skill)) || (a.i - b.i));
      streams[must[0].p.skill].shift();
      place(must[0]);
      continue;
    }
    const eligible = heads.filter(h => h.barrier <= placed && chunkOk(h));
    let pool = eligible.filter(h => h.p.skill !== prevSkill);
    if(!pool.length){
      const ahead = heads.filter(h => h.barrier > placed && h.p.skill !== prevSkill && jumpOk(h) && chunkOk(h));
      if(ahead.length) pool = ahead;
    }
    if(!pool.length) pool = eligible;
    if(!pool.length) pool = heads.filter(h => h.barrier <= placed);
    if(!pool.length){
      if(head){ place(head); placed++; continue; }
      pool = heads;
    }
    /* Skills with the most training left go first so every skill finishes around the same time
       (a lone skill left at the end would have to run back to back); ties go to the longest gap */
    const left = h => streams[h.p.skill].length;
    pool.sort((a, b) => (left(b) - left(a)) || (gap(b.p.skill) - gap(a.p.skill)) || (a.i - b.i));
    const pick = pool[0];
    streams[pick.p.skill].shift();
    place(pick);
  }
  return out;
}

/* Minutes of training that `gain` XP replaces, starting from the account's current XP */
function xpMinutes(S, s, gain, o){
  let xp = S.xp[s], left = gain, t = 0;
  while(left > 0 && xp < XP[99]){
    const l = lvlOf(xp), step = Math.min(left, XP[l + 1] - xp);
    const m = bestMethod(s, l, S, o);
    const r = m ? methRate(m, o) : 0;
    t += r ? step / r * 60 : step / 2000;   /* no method yet (e.g. Magic 1-7): quest XP is worth a lot */
    xp += step; left -= step;
  }
  return t;
}

/* Quests with XP lamps that have no skill chosen yet get the skill whose later training the
   lamps shorten the most (suffix such as QUEST:THE_TOURIST_TRAP:SMITHING). */
function assignLamps(list, start, o){
  const S = cloneState(start);
  const out = list.map(t => Object.assign({}, t));
  const parsed = out.map(t => parseRaw(t.raw));
  for(let i = 0; i < out.length; i++){
    const p = parsed[i];
    if(p.kind === 'QUEST' && p.entry && fixedLampSkill(p.entry, o) && !S.done.has(p.key) && !p.lampSkill){
      out[i].raw = lampRaw(p.entry, fixedLampSkill(p.entry, o));
      out[i].why = (out[i].why ? out[i].why.split(' | ')[0] : 'Quest') + ` | Lamps on ${SKILL_LABEL(fixedLampSkill(p.entry, o))} (ironman default)`;
      parsed[i] = parseRaw(out[i].raw);
    }
    else if(p.kind === 'QUEST' && p.entry && p.entry.lamps.length && !p.lampSkill && !S.done.has(p.key)){
      const later = {};
      for(let j = i + 1; j < out.length; j++){
        const q = parsed[j];
        if(q.skill && q.level && (q.kind === 'SKILL' || q.kind === 'ACTIVITY')) later[q.skill] = Math.max(later[q.skill] || 0, q.level);
      }
      const after = cloneState(S); applyTask(after, p);
      let best = null;
      for(const [s, top] of Object.entries(later)){
        /* combat-skill training also gives Hitpoints that later combat levels count on: leave it alone */
        if(COMBAT_TRAIN.has(s)) continue;
        const use = Math.min(lampGainFor(p.entry, s, after, o), Math.max(0, xpFor(top) - after.xp[s]));
        if(use <= 0) continue;
        const sv = xpMinutes(after, s, use, o);
        if(!best || sv > best.sv) best = {s, sv};
      }
      if(!best && o.defPure && p.entry.lamps.some(l => !l.skills || l.skills.includes('DEFENCE'))){
        /* never leave a lamp that could land on Defence unassigned on a pure */
        const l0 = p.entry.lamps[0];
        const pick = ['STRENGTH', 'ATTACK', 'HITPOINTS', 'PRAYER', 'MAGIC', 'RANGED'].find(s => (!l0.skills || l0.skills.includes(s)) && lvl(S, s) >= l0.min);
        if(pick) best = {s:pick, sv:0};
      }
      if(best){
        out[i].raw = lampRaw(p.entry, best.s);
        out[i].why = (out[i].why ? out[i].why.split(' | ')[0] : 'Quest') + ` | Lamps on ${SKILL_LABEL(best.s)}`;
        parsed[i] = parseRaw(out[i].raw);
      }
    }
    applyTask(S, parsed[i]);
  }
  return out;
}
