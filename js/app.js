/* C2 Training Grounds – single-page app (no build step, no dependencies). */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Part definitions
   * ------------------------------------------------------------------ */
  const PARTS = {
    '1': { name: 'Multiple-choice cloze', desc: 'Choose the word or phrase that best fits each gap in a text (8 questions).',
      instr: 'For each question, choose the correct answer for each gap.' },
    '2': { name: 'Open cloze', desc: 'Write one word in each gap (8 questions).',
      instr: 'For each question, write the correct answer. Write **one** word for each gap.' },
    '3': { name: 'Word formation', desc: 'Form a word from the keyword given for each gap (8 questions).',
      instr: 'For each question, use the word in CAPITALS on the right to form a word that fits in the gap.' },
    '4': { name: 'Key word transformation', desc: 'Complete a second sentence using the key word, in three to eight words (6 questions, 2 marks each).',
      instr: 'For each question, complete the second sentence so that it means the same as the first. **Do not change the word given.** You must use between **three** and **eight** words, including the word given.' },
    '5': { name: 'Multiple choice', desc: 'A long text followed by six four-option questions (2 marks each).',
      instr: 'Read the text. For each question, choose the correct answer.' },
    '6': { name: 'Gapped text', desc: 'Seven paragraphs have been removed from a text; one extra paragraph does not fit (2 marks each).',
      instr: 'Seven paragraphs have been removed from the text below. For each question, choose the correct answer. There is one extra paragraph which you do not need to use.' },
    '7': { name: 'Multiple matching', desc: 'Match ten statements to sections of a text (10 questions).',
      instr: 'Read the text. For each question, choose the correct answer. Each answer may be chosen more than once.' },
    'W1': { name: 'Writing Part 1 – Essay', desc: 'Compulsory essay summarising and evaluating two texts (240–280 words).',
      instr: 'You **must** answer this question. Write an essay summarising and evaluating the key points from both texts in **240–280 words**. Use your own words throughout as far as possible, and include your own ideas in your answer.' },
    'W2': { name: 'Writing Part 2 – Choice of task', desc: 'Choose one of three tasks: article, letter, report or review (280–320 words).',
      instr: 'Answer **one** of these questions. Write **280–320 words** in an appropriate style.' }
  };
  // official question numbering runs continuously through the paper
  const OFFSET = { '1': 0, '2': 8, '3': 16, '4': 24, '5': 30, '6': 36, '7': 43 };
  // marks per question (paper total = 72)
  const WEIGHT = { '1': 1, '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1 };
  const READING = ['1', '2', '3', '4', '5', '6', '7'];
  const WRITING = ['W1', 'W2'];
  // how answers are stored: 'mc' = option index, 'text' = typed string, 'letter' = 'A'..'G'
  const KIND = { '1': 'mc', '2': 'text', '3': 'text', '4': 'text', '5': 'mc', '6': 'letter', '7': 'letter' };

  const TESTS = (window.TESTS || []).slice();

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  const $ = (sel, el) => (el || document).querySelector(sel);

  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const k in props || {}) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => {
      if (c == null || c === false) return;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return e;
  }

  // American and British spellings are both accepted: both the typed answer and the key are mapped to one form
  const NOT_IZE = new Set(['size', 'sizes', 'sized', 'sizing', 'prize', 'prizes', 'prized', 'seize', 'seizes', 'seized', 'seizing', 'maize', 'capsize', 'capsized', 'capsizes', 'downsize', 'downsized', 'oversize', 'oversized']);
  function ukify(str) {
    return str
      .replace(/\b(\w+?)iz(e|es|ed|ing|er|ers|ation|ations)\b/g, (m, a, b) => (NOT_IZE.has(m) || /s$/.test(a) ? m : a + 'is' + b))
      .replace(/\b(\w+)yz(e|es|ed|ing)\b/g, '$1ys$2')
      .replace(/\b(col|hon|fav|behavi|neighb|lab|hum|flav|harb|rum|vig|endeav|arm|od|rig|clam|glam|vap|val)or(s|ed|ing|able|ite|ites|ful|less)?\b/g, '$1our$2')
      .replace(/\b(cent|theat|fib|lit|calib|somb|spect)er(s|ed)?\b/g, '$1re$2')
      .replace(/\b(defen|offen|pretens)se\b/g, '$1ce')
      .replace(/\b(licen)[cs]e(s|d)?\b/g, '$1ce$2')
      .replace(/\bpractis(e|es|ed|ing)\b/g, 'practic$1')
      .replace(/\bgray\b/g, 'grey')
      .replace(/\bprogramme(s)?\b/g, 'program$1')
      .replace(/\bjudgement(s)?\b/g, 'judgment$1')
      .replace(/\bageing\b/g, 'aging')
      .replace(/\b(fulfil|enrol|instal)l?(ment|ments|ed|ing)?\b/g, (m, a, b) => a + 'l' + (b || ''))
      .replace(/\bskilful(ly)?\b/g, 'skillful$1')
      .replace(/\b(catalog|dialog|analog)ue(s)?\b/g, '$1$2')
      .replace(/\b(travel|label|model|cancel|level|signal|total|fuel|channel|counsel|quarrel|marvel|rival|dial|tunnel|equal|duel)(ed|ing|er|ers)\b/g, '$1l$2')
      .replace(/\bpyjamas\b/g, 'pajamas').replace(/\bjewellery\b/g, 'jewelry').replace(/\bplough(s|ed|ing)?\b/g, 'plow$1')
      .replace(/\bmould(s|ed|ing)?\b/g, 'mold$1').replace(/\bsmoulder(s|ed|ing)?\b/g, 'smolder$1').replace(/\bmoustache\b/g, 'mustache')
      .replace(/\baluminium\b/g, 'aluminum').replace(/\bscept(ic|ics|ical|icism)\b/g, 'skept$1').replace(/\bsulphur\b/g, 'sulfur').replace(/\bcosy\b/g, 'cozy');
  }
  const norm = s => ukify(String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[.,;:!?"“”]/g, '').replace(/\s+/g, ' ').trim());
  const paras = txt => String(txt).split(/\n\n+/).map(s => s.trim()).filter(Boolean);
  const countWords = s => (s.trim().match(/\S+/g) || []).length;
  const letter = i => String.fromCharCode(65 + i);
  // official question number shown to the candidate (data uses 1..N internally)
  const disp = n => n + (OFFSET[S.t.part] || 0);
  // **bold** markup in instructions
  const rich = txt => String(txt).split('**').map((seg, i) => (i % 2 ? h('b', { text: seg }) : seg));
  // Part 4 word count: contractions count as two words
  const wordCount4 = a => String(a).trim().split(/\s+/).filter(Boolean).reduce((n, w) => n + (/['’]/.test(w) ? 2 : 1), 0);

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    const p = n => String(n).padStart(2, '0');
    return hh ? `${hh}:${p(mm)}:${p(ss)}` : `${p(mm)}:${p(ss)}`;
  }
  function fmtDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
      d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  function toast(msg) {
    const t = h('div', { class: 'toast', text: msg });
    document.body.append(t);
    setTimeout(() => t.remove(), 2200);
  }

  /* ------------------------------------------------------------------ *
   * Storage (localStorage; everything lives in the browser)
   * ------------------------------------------------------------------ */
  const KEY = 'c2practice.v1';
  let DB = { progress: {}, history: [] };
  try { DB = Object.assign(DB, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  function saveDB() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ } }

  /* ------------------------------------------------------------------ *
   * Popover (the dark answer bar used for gap choices)
   * ------------------------------------------------------------------ */
  let pop = null;
  function closePopover() {
    if (pop) { pop.remove(); pop = null; }
    document.removeEventListener('mousedown', outsideClick, true);
    window.removeEventListener('scroll', closePopover, true);
  }
  function outsideClick(e) { if (pop && !pop.contains(e.target)) closePopover(); }
  function openPopover(anchor, items, onPick) {
    closePopover();
    pop = h('div', { class: 'pop', role: 'listbox' },
      h('button', { type: 'button', class: 'pop-x', 'aria-label': 'Clear answer', onclick: () => { onPick(undefined); closePopover(); } }, '✕'),
      items.map(it => h('button', { type: 'button', onclick: () => { onPick(it.value); closePopover(); } }, it.label)));
    document.body.append(pop);
    const r = anchor.getBoundingClientRect(), pr = pop.getBoundingClientRect();
    let top = r.top - pr.height - 6;
    if (top < 8) top = r.bottom + 6;
    const left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - pr.width - 8));
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
    document.addEventListener('mousedown', outsideClick, true);
    window.addEventListener('scroll', closePopover, true);
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopover(); });

  /* ------------------------------------------------------------------ *
   * Stopwatch (manual start / pause / reset)
   * ------------------------------------------------------------------ */
  let S = null;        // state of the currently open test
  let tick = null;

  function curElapsed() { return S.elapsed + (S.running ? Date.now() - S.lastTs : 0); }
  function updateTimeUI() {
    if (!S || !S.swTime) return;
    S.swTime.textContent = fmtTime(curElapsed());
    S.swTime.classList.toggle('running', S.running);
  }
  function startTimer() {
    if (S.running || S.checked) return;
    S.running = true; S.lastTs = Date.now();
    clearInterval(tick); tick = setInterval(updateTimeUI, 250);
    updateTimeUI();
  }
  function pauseTimer() {
    if (!S || !S.running) return;
    S.elapsed += Date.now() - S.lastTs;
    S.running = false; clearInterval(tick);
    updateTimeUI(); saveProgress();
  }
  // the stopwatch starts by itself on the first real interaction, unless the user paused it on purpose
  function autoStart() {
    if (S && S.ready && !S.running && !S.checked) startTimer();
  }
  // the stopwatch has no buttons: it starts when the test opens and stops when you check or leave
  function stopwatchEl() {
    S.swTime = h('span', { class: 'sw-time', text: '00:00' });
    updateTimeUI();
    return h('div', { class: 'stopwatch' }, S.swTime);
  }

  /* ------------------------------------------------------------------ *
   * Routing
   * ------------------------------------------------------------------ */
  function leaveTest() {
    if (S && !S.checked) { if (S.running) pauseTimer(); else saveProgress(); }
    clearInterval(tick); closePopover(); closeNotes(); hideTool();
    S = null;
    $('#hdr-tools').replaceChildren();
  }
  function route() {
    leaveTest();
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const app = $('#app');
    app.className = 'page'; app.scrollTop = 0;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.remove('active'));
    if (parts[0] === 'test' && parts[1]) {
      const t = TESTS.find(x => x.id === decodeURIComponent(parts[1]));
      if (t) { openTest(t); return; }
    }
    if (parts[0] === 'history') { $('[data-nav="history"]').classList.add('active'); viewHistory(); return; }
    $('[data-nav="home"]').classList.add('active');
    viewHome();
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('beforeunload', () => { if (S && !S.checked) { if (S.running) pauseTimer(); else saveProgress(); } });

  const go = hash => { location.hash = hash; };

  /* ------------------------------------------------------------------ *
   * Home
   * ------------------------------------------------------------------ */
  function testsOf(part) { return TESTS.filter(t => t.part === part); }
  function qCount(t) { return t.questions ? t.questions.length : 0; }

  function statusOf(t) {
    const att = DB.history.filter(x => x.id === t.id);
    if (DB.progress[t.id]) return { cls: 'prog', text: 'In progress' };
    if (!att.length) return { cls: 'new', text: 'Not attempted' };
    if (t.part === 'W1' || t.part === 'W2') return { cls: 'done', text: `Written ${att.length}×` };
    const best = Math.max(...att.map(a => a.score / a.total));
    const b = att.find(a => a.score / a.total === best);
    return { cls: 'done', text: `Best ${b.score}/${b.total} · ${att.length} attempt${att.length > 1 ? 's' : ''}` };
  }

  let homeFilter = null;   // null = show every part

  function viewHome() {
    const app = $('#app');
    const chip = (label, value) => h('button', { type: 'button', class: 'chip-filter' + (homeFilter === value ? ' on' : ''),
      onclick: () => { homeFilter = value; viewHome(); } }, label);
    const jump = h('div', { class: 'jump' },
      chip('All', null),
      [...READING, ...WRITING].map(p => chip(p[0] === 'W' ? 'Writing ' + p[1] : 'Part ' + p, p)));

    const section = p => {
      const list = testsOf(p);
      return h('section', { class: 'part-sec', id: 'sec-' + p },
        h('div', { class: 'part-head' },
          h('h2', { text: (p[0] === 'W' ? '' : 'Part ' + p + ' \u2013 ') + PARTS[p].name.replace(/^Writing Part \d \u2013 /, '') })),
        h('p', { class: 'part-desc', text: PARTS[p].desc + (list.length ? ` \u00b7 ${list.length} test${list.length > 1 ? 's' : ''}` : '') }),
        list.length
          ? h('div', { class: 'cards' }, list.map(t => {
            const st = statusOf(t);
            const meta = t.questions ? `${qCount(t)} questions` : (t.range ? `${t.range[0]}\u2013${t.range[1]} words` : '');
            return h('a', { class: 'tcard-home', href: '#/test/' + encodeURIComponent(t.id) },
              h('b', { text: t.title }), h('span', { class: 'meta', text: meta }),
              h('span', { class: 'status ' + st.cls, text: st.text }));
          }))
          : h('p', { class: 'empty', text: 'No tests yet.' }));
    };

    const show = list => (homeFilter ? list.filter(p => p === homeFilter) : list);
    const reading = show(READING), writing = show(WRITING);

    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: 'Practice library' }),
      h('p', { class: 'lead', text: 'Pick any test from any part, in any order. Your answers, stopwatch time and results are saved in this browser.' }),
      jump,
      reading.length ? h('div', { class: 'group-title', text: 'Reading and Use of English' }) : null,
      reading.map(section),
      writing.length ? h('div', { class: 'group-title', text: 'Writing' }) : null,
      writing.map(section)));
    app.className = '';
  }

  /* ------------------------------------------------------------------ *
   * History
   * ------------------------------------------------------------------ */
  function viewHistory() {
    const app = $('#app');
    const hist = DB.history.slice().sort((a, b) => b.ts - a.ts);

    const rows = [...READING, ...WRITING].map(p => {
      const items = DB.history.filter(x => x.part === p);
      if (!items.length) return null;
      if (p[0] === 'W') {
        const avg = Math.round(items.reduce((s, x) => s + x.words, 0) / items.length);
        return h('tr', null, h('td', { text: PARTS[p].name }), h('td', { text: items.length }), h('td', { text: `avg ${avg} words` }), h('td', { text: '–' }),
          h('td', { text: fmtTime(items.reduce((s, x) => s + x.ms, 0) / items.length) }));
      }
      const total = items[0].total;
      const avg = Math.round(items.reduce((a, x) => a + x.score, 0) / items.length * 10) / 10;
      return h('tr', null, h('td', { text: 'Part ' + p + ' – ' + PARTS[p].name }), h('td', { text: items.length }),
        h('td', { text: `${avg} / ${total}` }),
        h('td', { text: `${Math.max(...items.map(x => x.score))} / ${total}` }),
        h('td', { text: fmtTime(items.reduce((a, x) => a + x.ms, 0) / items.length) }));
    }).filter(Boolean);

    const exportBtn = h('button', { type: 'button', class: 'btn', onclick: () => {
      const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'c2-practice-backup.json' });
      document.body.append(a); a.click(); a.remove();
    } }, 'Export backup');
    const fileIn = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: ev => {
      const f = ev.target.files[0]; if (!f) return;
      f.text().then(txt => {
        const d = JSON.parse(txt);
        if (!d || !Array.isArray(d.history)) throw new Error('bad file');
        if (!confirm('Replace the data in this browser with the backup?')) return;
        DB = { progress: d.progress || {}, history: d.history }; saveDB(); route();
      }).catch(() => alert('That file is not a valid backup.'));
    } });
    const importBtn = h('button', { type: 'button', class: 'btn', onclick: () => fileIn.click() }, 'Import backup');
    const clearBtn = h('button', { type: 'button', class: 'btn danger', onclick: () => {
      if (confirm('Delete all history and unfinished tests?')) { DB = { progress: {}, history: [] }; saveDB(); route(); }
    } }, 'Clear everything');

    const list = hist.map(x => {
      const isW = x.part[0] === 'W';
      const row = h('div', { class: 'hrow' },
        h('div', { class: 'when', text: fmtDate(x.ts) }),
        h('div', { class: 'what' }, h('b', { text: x.title }), h('small', { text: PARTS[x.part].name })),
        h('div', { class: 'res', text: isW ? `${x.words} words` : `${x.score} / ${x.total}` }),
        h('div', { class: 'when', text: fmtTime(x.ms) }),
        isW ? h('button', { type: 'button', class: 'btn small', onclick: ev => {
          const open = row.querySelector('.htext');
          if (open) { open.remove(); ev.target.textContent = 'View text'; }
          else { row.append(h('div', { class: 'htext', text: (x.task ? x.task + '\n\n— — —\n\n' : '') + x.text })); ev.target.textContent = 'Hide text'; }
        } }, 'View text') : null,
        h('button', { type: 'button', class: 'btn small danger', title: 'Delete this entry', onclick: () => {
          DB.history = DB.history.filter(y => y !== x); saveDB(); route();
        } }, '✕'));
      return row;
    });

    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: 'History' }),
      h('p', { class: 'lead', text: 'Every check you run and every piece of writing you save appears here.' }),
      h('div', { class: 'toolbar' }, exportBtn, importBtn, clearBtn, fileIn),
      rows.length ? h('table', { class: 'stats' },
        h('thead', null, h('tr', null, ['Part', 'Attempts', 'Average', 'Best', 'Avg time'].map(c => h('th', { text: c })))),
        h('tbody', null, rows)) : null,
      list.length ? list : h('p', { class: 'empty', text: 'Nothing yet – go and do a test!' })));
    app.className = '';
  }

  /* ------------------------------------------------------------------ *
   * Test engine
   * ------------------------------------------------------------------ */
  function isAnswered(n) {
    const v = S.answers[n];
    return v !== undefined && v !== null && String(v).trim() !== '';
  }
  function isCorrect(t, q, val) {
    if (val === undefined || val === null || String(val).trim() === '') return false;
    if (t.part === '4') { const wc = wordCount4(val); if (wc < 3 || wc > 8) return false; }
    if (KIND[t.part] === 'text') return q.answer.some(a => norm(a) === norm(val));
    return val === q.answer;
  }
  function snippet(t, L) {
    const p = (t.paragraphs || []).find(x => x.label === L);
    if (!p) return '';
    const w = p.text.trim().split(/\s+/);
    return w.slice(0, 9).join(' ') + (w.length > 9 ? '…' : '');
  }
  function shortCorrect(t, q) {
    const k = KIND[t.part];
    if (k === 'mc') return q.options[q.answer];
    if (k === 'text') return q.answer[0];
    if (t.part === '6') return '“' + snippet(t, q.answer) + '”';
    return q.answer;
  }
  function fmtAnswer(t, q, val) {
    if (val === undefined || val === null || String(val).trim() === '') return '(no answer)';
    const k = KIND[t.part];
    if (k === 'mc') return t.part === '5' ? `${letter(val)}. ${q.options[val]}` : q.options[val];
    if (k === 'letter' && t.part === '6') return `“${snippet(t, val)}”`;
    return String(val);
  }
  function fmtCorrect(t, q) {
    const k = KIND[t.part];
    if (k === 'mc') return t.part === '5' ? `${letter(q.answer)}. ${q.options[q.answer]}` : q.options[q.answer];
    if (k === 'text') {
      if (t.part === '4') return [q.before, q.parts ? schemesOf(q)[0][0][0] + ' | ' + schemesOf(q)[0][1][0] : q.answer[0], q.after].filter(Boolean).join(' ').replace(/\s+([,.;:])/g, '$1');
      return q.answer.join('  /  ');
    }
    if (t.part === '6') return `“${snippet(t, q.answer)}”`;
    return q.answer;
  }

  function saveProgress() {
    if (!S || S.checked) return;
    const hasAny = (S.notes && S.notes.length) || (S.writing ? (S.editor && S.editor.value.trim()) : Object.keys(S.answers).length || Object.keys(S.flags).length);
    if (!hasAny && S.elapsed === 0 && !S.running) { delete DB.progress[S.t.id]; saveDB(); return; }
    if (S.writing) DB.progress[S.t.id] = { text: S.editor.value, choice: S.choice, notes: S.notes, ms: curElapsed() };
    else DB.progress[S.t.id] = { answers: S.answers, flags: S.flags, notes: S.notes, ms: curElapsed() };
    saveDB();
  }

  function openTest(t) {
    S = { t, answers: {}, flags: {}, cur: 1, checked: false, elapsed: 0, running: false, lastTs: 0, paint: {}, results: {}, notes: [], writing: t.part[0] === 'W' };
    const prog = DB.progress[t.id];
    if (prog) { S.notes = prog.notes || []; S.elapsed = prog.ms || 0; if (!S.writing) { S.answers = prog.answers || {}; S.flags = prog.flags || {}; } }
    const app = $('#app');
    app.className = 'testview';
    $('#hdr-tools').replaceChildren(stopwatchEl(), h('button', { type: 'button', class: 'btn', title: 'Select text in the passage to highlight it or add a note', onclick: () => ($('.notes-panel') ? closeNotes() : openNotes()) }, '\u270e Notes'));
    if (S.writing) buildWriting(app); else buildReading(app);
    S.ready = true;
    startTimer();
  }

  /* ---------- reading builders ---------- */
  function setAnswer(n, val) {
    if (S.checked) return;
    autoStart();
    if (S.t.part === '6' && val !== undefined) {
      Object.keys(S.answers).forEach(m => { if (+m !== n && S.answers[m] === val) { delete S.answers[m]; if (S.paint[m]) S.paint[m](); } });
    }
    if (val === undefined || val === '') delete S.answers[n]; else S.answers[n] = val;
    if (S.paint[n]) S.paint[n]();
    if (S.usedRefresh) S.usedRefresh();
    refreshPager();
    saveProgress();
  }

  function setCur(n, scroll) {
    autoStart();
    S.cur = n;
    S.body.querySelectorAll('.cur').forEach(e => e.classList.remove('cur'));
    const els = S.body.querySelectorAll(`[data-q="${n}"]`);
    els.forEach(e => e.classList.add('cur'));
    refreshPager();
    if (scroll && els[0]) {
      els[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (els[0].tagName === 'INPUT') els[0].focus({ preventScroll: true });
    }
  }

  function refreshPager() {
    const N = qCount(S.t);
    let done = 0;
    S.pagerBtns.forEach((b, i) => {
      const n = i + 1;
      const a = isAnswered(n);
      if (a) done++;
      b.classList.toggle('cur', n === S.cur);
      b.classList.toggle('done', a && !S.checked);
      b.classList.toggle('flag', !!S.flags[n]);
      if (S.checked) { b.classList.toggle('ok', !!S.results[n]); b.classList.toggle('bad', !S.results[n]); }
    });
    S.bm.classList.toggle('on', !!S.flags[S.cur]);
    S.bm.textContent = S.flags[S.cur] ? '⚑ Bookmarked' : '⚐ Bookmark';
    S.countEl.textContent = `${done} of ${N} answered`;
    S.prev.disabled = S.cur <= 1;
    S.next.disabled = S.cur >= N;
  }

  // Part 6: drag a paragraph into a gap (or click a paragraph, then click a gap)
  function dropGap(n) {
    const t = S.t;
    const box = h('div', { class: 'dropgap', 'data-q': n });
    const place = L => { if (S.checked) return; S.sel = null; setCur(n, false); setAnswer(n, L); };
    box.addEventListener('dragover', e => { if (!S.checked) { e.preventDefault(); box.classList.add('over'); } });
    box.addEventListener('dragleave', () => box.classList.remove('over'));
    box.addEventListener('drop', e => { e.preventDefault(); box.classList.remove('over'); const L = e.dataTransfer.getData('text/plain'); if (L) place(L); });
    box.addEventListener('dragstart', e => {
      const v = S.answers[n];
      if (v === undefined || S.checked) { e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', v);
    });
    box.addEventListener('click', () => {
      if (S.checked) return;
      setCur(n, false);
      if (S.sel) place(S.sel);
      else if (S.answers[n] !== undefined) setAnswer(n, undefined);
    });
    S.paint[n] = () => {
      const v = S.answers[n];
      box.classList.toggle('filled', v !== undefined);
      box.draggable = v !== undefined && !S.checked;
      if (v === undefined) box.replaceChildren(h('span', { class: 'gn', text: disp(n) }));
      else box.replaceChildren(h('div', { class: 'placed', text: t.paragraphs.find(p => p.label === v).text }));
    };
    return box;
  }

  // Part 7: one dropdown per statement
  function qRow(t, q, n) {
    const sel = h('select', { class: 'qselect', 'aria-label': 'Question ' + disp(n) },
      h('option', { value: '', text: String(disp(n)) }),
      h('option', { value: '', disabled: true, text: 'Select alternative' }),
      t.sections.map(x => h('option', { value: x.label, text: x.label })));
    sel.addEventListener('change', () => { setCur(n, false); setAnswer(n, sel.value || undefined); });
    sel.addEventListener('focus', () => { if (S.cur !== n) setCur(n, false); });
    S.paint[n] = () => { sel.value = S.answers[n] || ''; };
    return h('div', { class: 'qrow', 'data-q': n }, h('div', { class: 'qtext', text: q.q }), sel);
  }

  function gapEl(n) {
    const t = S.t, q = t.questions[n - 1];
    if (t.part === '2' || t.part === '3') {
      const inp = h('input', { type: 'text', class: 'gap', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: String(disp(n)), 'data-q': n, 'aria-label': 'Gap ' + disp(n) });
      inp.value = S.answers[n] || '';
      inp.addEventListener('input', () => setAnswer(n, inp.value));
      inp.addEventListener('focus', () => { if (S.cur !== n) setCur(n, false); });
      S.paint[n] = () => { const v = S.answers[n] || ''; if (inp.value !== v) inp.value = v; };
      return h('span', { class: 'gapwrap' }, inp);
    }
    if (t.part === '6') return dropGap(n);
    // part 1: button that opens the answer bar
    const btn = h('button', { type: 'button', class: 'gap gap-btn', 'data-q': n });
    const items = t.part === '1'
      ? q.options.map((o, i) => ({ label: o, value: i }))
      : t.paragraphs.map(p => ({ label: p.label, value: p.label }));
    btn.addEventListener('click', () => {
      if (S.checked) return;
      setCur(n, false);
      openPopover(btn, items, v => setAnswer(n, v));
    });
    S.paint[n] = () => {
      const v = S.answers[n];
      btn.classList.toggle('filled', v !== undefined);
      if (t.part === '1') btn.textContent = v === undefined ? String(disp(n)) : q.options[v];
      else btn.replaceChildren(h('span', { class: 'gn', text: v === undefined ? String(disp(n)) : v }), v === undefined ? '' : ' ' + snippet(t, v));
      if (S.usedRefresh) S.usedRefresh();
    };
    return btn;
  }

  function buildCloze(t) {
    const wrap = h('div', { class: 'cloze' });
    paras(t.text).forEach(par => {
      const only = par.match(/^\{(\d+)\}$/);
      if (t.part === '6' && only) { wrap.append(h('div', { class: 'gapblock' }, gapEl(+only[1]))); return; }
      const p = h('p');
      par.split(/(\{\d+\})/).forEach(seg => {
        const m = seg.match(/^\{(\d+)\}$/);
        if (m) p.append(gapEl(+m[1])); else if (seg) p.append(seg);
      });
      wrap.append(p);
    });
    return wrap;
  }

  function buildTransform(t) {
    const wrap = h('div', { class: 'transforms' });
    t.questions.forEach((q, i) => {
      const n = i + 1;
      const inp = h('input', { type: 'text', class: 'gap', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: String(disp(n)), 'data-q': n, 'aria-label': 'Answer ' + disp(n) });
      inp.value = S.answers[n] || '';
      inp.addEventListener('input', () => setAnswer(n, inp.value));
      inp.addEventListener('focus', () => { if (S.cur !== n) setCur(n, false); });
      S.paint[n] = () => { const v = S.answers[n] || ''; if (inp.value !== v) inp.value = v; };
      const afterSep = /^[,.;:]/.test(q.after) ? '' : ' ';
      wrap.append(h('div', { class: 'tcard' },
        h('span', { class: 'qnum', text: disp(n) }),
        h('p', { text: q.first }),
        h('div', { class: 'keyword', text: q.key }),
        h('p', null, q.before ? q.before + ' ' : '', inp, q.after ? afterSep + q.after : '')));
    });
    return wrap;
  }

  function choiceCard(t, q, n) {
    const k = KIND[t.part];
    const card = h('div', { class: 'qcard', 'data-q': n });
    card.append(h('div', { class: 'qhead' }, h('span', { class: 'qnum', text: disp(n) }), h('span', { text: q.q })));
    const btns = [];
    if (k === 'mc') {
      q.options.forEach((o, j) => {
        const b = h('button', { type: 'button', class: 'opt', 'data-v': j, onclick: () => { setCur(n, false); setAnswer(n, S.answers[n] === j ? undefined : j); } },
          h('span', { class: 'l', text: letter(j) }), h('span', { text: o }));
        btns.push(b); card.append(b);
      });
    } else {
      const labels = t.sections.map(x => x.label);
      const row = h('div', { class: 'pills' });
      labels.forEach(L => {
        const b = h('button', { type: 'button', class: 'pill', 'data-v': L, onclick: () => { setCur(n, false); setAnswer(n, S.answers[n] === L ? undefined : L); } }, L);
        btns.push(b); row.append(b);
      });
      card.append(row);
    }
    S.paint[n] = () => btns.forEach(b => b.classList.toggle('sel', S.answers[n] !== undefined && String(S.answers[n]) === b.dataset.v));
    return card;
  }

  function buildReading(app) {
    const t = S.t, P = PARTS[t.part], N = qCount(t);
    let content;
    const subtitle = t.subtitle ? h('p', { class: 'subtitle', text: t.subtitle }) : null;

    if (t.part === '1' || t.part === '2' || t.part === '3') {
      const clz = h('div', null, h('div', { class: 'ptitle', text: t.heading || t.title }), buildCloze(t));
      content = t.part === '3'
        ? h('div', { class: 'split split3' }, clz,
          h('div', { class: 'pane kwlist' }, h('h3', { text: 'Keyword list' }),
            t.questions.map((q, i) => h('div', { class: 'kw', 'data-kw': i + 1, onclick: () => setCur(i + 1, true) }, h('span', { text: disp(i + 1) + '.' }), h('b', { text: q.stem })))))
        : clz;
    } else if (t.part === '4') {
      content = buildTransform(t);
    } else if (t.part === '6') {
      const cloze = buildCloze(t);
      const pool = h('div', { class: 'pane pool' });
      S.sel = null;
      S.usedRefresh = () => {
        const used = new Set(Object.values(S.answers));
        pool.replaceChildren(...t.paragraphs.filter(p => !used.has(p.label)).map(p => h('div', {
          class: 'pcard' + (S.sel === p.label ? ' sel' : ''), draggable: 'true', title: 'Drag into a gap, or click it and then click a gap',
          onclick: () => { if (S.checked) return; S.sel = S.sel === p.label ? null : p.label; S.usedRefresh(); },
          ondragstart: e => { if (S.checked) { e.preventDefault(); return; } e.dataTransfer.setData('text/plain', p.label); }
        }, p.text)));
      };
      pool.addEventListener('dragover', e => { if (!S.checked) e.preventDefault(); });
      pool.addEventListener('drop', e => {
        e.preventDefault();
        const L = e.dataTransfer.getData('text/plain');
        const m = Object.keys(S.answers).find(k => S.answers[k] === L);
        if (m) setAnswer(+m, undefined);
      });
      content = h('div', { class: 'split' }, h('div', { class: 'pane plain' }, h('div', { class: 'ptitle', text: t.heading || t.title }), subtitle, cloze), pool);
    } else if (t.part === '7') {
      const left = h('div', { class: 'pane plain' }, h('div', { class: 'ptitle', text: t.heading || t.title }), subtitle,
        t.sections.map(x => h('div', { class: 'sec' }, h('div', { class: 'sechead' }, h('b', { text: x.label }), h('b', { text: x.heading || '' })),
          paras(x.text).map(p => h('p', { text: p })))));
      const right = h('div', { class: 'pane plain' }, h('div', { class: 'ptitle', text: t.qtitle || 'Which section gives each of these opinions?' }),
        t.questions.map((q, i) => qRow(t, q, i + 1)));
      content = h('div', { class: 'split' }, left, right);
    } else {
      let left;
      if (t.part === '5') {
        left = h('div', { class: 'pane' }, h('h3', { text: t.heading || t.title }), subtitle, paras(t.text).map(p => h('p', { text: p })));
      } else {
        left = h('div', { class: 'pane' }, h('h3', { text: t.title }), t.sections.map(x => h('div', { class: 'src' },
          h('span', { class: 'src-label', text: x.label }), x.heading ? h('h3', { text: x.heading }) : null, paras(x.text).map(p => h('p', { text: p })))));
      }
      const right = h('div', { class: 'pane plain' }, t.questions.map((q, i) => choiceCard(t, q, i + 1)));
      content = h('div', { class: 'split' }, left, right);
    }
    S.body = content;

    S.bannerHost = h('div');
    S.reviewHost = h('div');
    const base = t.part === '7' ? `For each question, choose the correct ${t.choose || 'person'}. Each ${t.choose || 'person'} may be chosen more than once.` : P.instr;
    const instrText = (t.intro ? t.intro + ' ' : '') + base;
    const stage = h('div', { class: 'stage' },
      h('div', { class: 'instr' }, h('b', { text: `Questions ${disp(1)}–${disp(N)}` }), h('span', null, rich(instrText))),
      S.bannerHost, content, S.reviewHost);
    S.stage = stage;

    // footer / pager
    S.pagerBtns = [];
    const pager = h('div', { class: 'pager' });
    for (let n = 1; n <= N; n++) {
      const b = h('button', { type: 'button', text: disp(n), 'aria-label': 'Question ' + disp(n), onclick: () => setCur(n, true) });
      S.pagerBtns.push(b); pager.append(b);
    }
    S.countEl = h('span', { class: 'count' });
    S.bm = h('button', { type: 'button', class: 'bm', title: 'Flag this question to come back to it', onclick: () => {
      if (S.flags[S.cur]) delete S.flags[S.cur]; else S.flags[S.cur] = true;
      refreshPager(); saveProgress();
    } });
    S.prev = h('button', { type: 'button', class: 'arrow', 'aria-label': 'Previous question', onclick: () => setCur(Math.max(1, S.cur - 1), true) }, '←');
    S.next = h('button', { type: 'button', class: 'arrow', 'aria-label': 'Next question', onclick: () => setCur(Math.min(N, S.cur + 1), true) }, '→');
    S.checkBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => (S.checked ? go('#/') : checkAnswers()) }, 'Check answers');
    const foot = h('div', { class: 'foot' },
      h('span', { class: 'plabel', text: `Part ${t.part}` }), pager, S.countEl,
      h('span', { class: 'spacer' }), S.bm, S.checkBtn, S.prev, S.next);

    $('#app').replaceChildren(stage, foot);
    Object.keys(S.paint).forEach(n => S.paint[n]());
    refreshPager();
    setCur(1, false);
    if (S.usedRefresh) S.usedRefresh();
  }

  /* ---------- checking ---------- */
  function markQuestion(n, ok, q) {
    const t = S.t, k = KIND[t.part];
    const els = S.body.querySelectorAll(`[data-q="${n}"]`);
    if (!els.length) return;
    if (t.part === '7') {
      els[0].classList.add(ok ? 'ok' : 'bad');
      if (!ok) els[0].querySelector('select').after(h('span', { class: 'chip', text: '→ ' + q.answer }));
      return;
    }
    if (t.part === '5') {
      const card = els[0];
      card.classList.add(ok ? 'ok' : 'bad');
      card.querySelectorAll('[data-v]').forEach(b => {
        if (b.dataset.v === String(q.answer)) b.classList.add('right');
        else if (S.answers[n] !== undefined && b.dataset.v === String(S.answers[n])) b.classList.add('wrong');
      });
      return;
    }
    els.forEach(e => e.classList.add(ok ? 'ok' : 'bad'));
    if (!ok) els[els.length - 1].after(h('span', { class: 'chip', text: '→ ' + shortCorrect(t, q) }));
  }

  // Part 4 marking: like the official key, each answer is split into two parts (q.parts = [[alternatives], [alternatives]]) worth 1 mark each
  // A question may list several alternative splits (q.parts = [scheme, scheme]); the best one counts.
  // Part 1 must open the answer and part 2 must close it, so a stray common word does not earn a mark.
  const schemesOf = q => (q.parts ? (Array.isArray(q.parts[0][0]) ? q.parts : [q.parts]) : []);
  function partHits(q, val) {
    let best = { hit: [false, false], n: 0, scheme: schemesOf(q)[0] };
    const wc = wordCount4(val || '');
    if (!q.parts || wc < 3 || wc > 8) return best;
    const T = ' ' + norm(val) + ' ';
    if (!T.includes(' ' + norm(q.key) + ' ')) return best; // the key word must be used unchanged
    schemesOf(q).forEach(sc => {
      const a1 = sc[0].some(a => T.startsWith(' ' + norm(a) + ' '));
      const a2 = sc[1].some(a => T.endsWith(' ' + norm(a) + ' '));
      const both = sc[0].some(a1x => sc[1].some(a2x => T.startsWith(' ' + norm(a1x) + ' ') && T.endsWith(' ' + norm(a2x) + ' ') && norm(a1x).length + norm(a2x).length + 1 <= T.trim().length));
      const n = both ? 2 : (a1 || a2 ? 1 : 0);
      if (n > best.n) best = { hit: [a1, a2], n, scheme: sc };
    });
    return best;
  }

  function checkAnswers() {
    if (S.checked) return;
    const N = qCount(S.t);
    const blank = S.t.questions.filter((_, i) => !isAnswered(i + 1)).length;
    if (blank && !confirm(`${blank} of ${N} question${blank > 1 ? 's are' : ' is'} unanswered. Check anyway?`)) return;
    pauseTimer(); clearInterval(tick); closePopover();
    S.checked = true;
    let score = 0;
    const wt = WEIGHT[S.t.part];
    const earned = {};
    S.t.questions.forEach((q, i) => {
      const n = i + 1, ph = S.t.part === '4' ? partHits(q, S.answers[n]) : null;
      const ok = isCorrect(S.t, q, S.answers[n]) || !!(ph && ph.n === 2);
      if (ph && ok) ph.n = 2;
      S.results[n] = ok;
      earned[n] = ok ? wt : (ph ? ph.n : 0);
      score += earned[n];
      markQuestion(n, ok, q);
    });
    S.body.querySelectorAll('input').forEach(i => { i.readOnly = true; });
    S.body.querySelectorAll('select').forEach(i => { i.disabled = true; });
    if (S.usedRefresh) S.usedRefresh();
    S.body.classList.add('locked');
    S.body.querySelectorAll('.gap-btn, .opt, .pill').forEach(b => { b.style.pointerEvents = 'none'; });
    const ms = S.elapsed;
    const entry = { ts: Date.now(), id: S.t.id, part: S.t.part, title: S.t.title, score, total: N * wt, ms };
    DB.history.push(entry); S.entry = entry; S.score = score;
    delete DB.progress[S.t.id]; saveDB();

    const total = N * wt;
    S.total = total; S.half = {};
    S.scoreEl = h('div', { class: 'score' });
    S.pctEl = h('div');
    S.refreshScore = () => {
      S.scoreEl.textContent = `${S.score} / ${total}`;
      S.pctEl.textContent = 'marks' + (wt > 1 ? ` · ${S.t.questions.filter((_, i) => S.results[i + 1]).length} of ${N} fully correct` : '');
      S.entry.score = S.score; saveDB();
    };
    const list = testsOf(S.t.part);
    const nextT = list[(list.findIndex(x => x.id === S.t.id) + 1) % list.length];
    S.bannerHost.replaceChildren(h('div', { class: 'banner' },
      S.scoreEl,
      h('div', null, S.pctEl, h('div', { class: 'sub', text: S.elapsed > 0 ? `Time: ${fmtTime(ms)}` : 'Stopwatch was not used' })),
      h('div', { class: 'acts' },
        h('button', { type: 'button', class: 'btn', onclick: () => { delete DB.progress[S.t.id]; const t = S.t; leaveTest(); openTest(t); } }, 'Try again'),
        nextT && nextT.id !== S.t.id ? h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/test/' + encodeURIComponent(nextT.id)) }, 'Next test') : null,
        h('button', { type: 'button', class: 'btn', onclick: () => go('#/') }, 'Back to list'))));

    S.refreshScore();
    S.reviewHost.replaceChildren(h('div', { class: 'review' },
      h('h2', { text: 'Answers and explanations' }),
      S.t.part === '4' ? h('p', { class: 'sub', text: 'As in the real exam, each answer is split into two parts (shown with a | below) and each part is worth 1 mark. If your answer is also acceptable but the site did not recognise it, tick "Add 1 mark" to correct your score.' }) : null,
      S.t.questions.map((q, i) => {
        const n = i + 1, ok = S.results[n];
        const line = [];
        if (S.t.part === '4') line.push(h('div', { class: 'line', text: q.first }));
        else if (q.q) line.push(h('div', { class: 'line', text: q.q }));
        line.push(h('div', { class: 'line' }, 'Your answer: ', h('span', { class: 'mine' + (ok ? ' ok' : ''), text: fmtAnswer(S.t, q, S.answers[n]) })));
        if (!ok) line.push(h('div', { class: 'line' }, 'Correct: ', h('span', { class: 'good', text: fmtCorrect(S.t, q) })));
        else if (S.t.part === '4' || KIND[S.t.part] === 'text' && q.answer.length > 1) line.push(h('div', { class: 'line' }, 'Accepted: ', h('span', { class: 'good', text: fmtCorrect(S.t, q) })));
        if (S.t.part === '4' && q.parts) {
          const ph = partHits(q, S.answers[n]);
          const mark = (i, ok1) => `${ok1 ? '✓' : '✗'} “${ph.scheme[i][0]}”`;
          line.push(h('div', { class: 'line' }, `Marks: ${earned[n]} / 2 · part 1 ${mark(0, ok || ph.hit[0])} · part 2 ${mark(1, ok || ph.hit[1])}`));
        }
        if (!ok && S.t.part === '4') {
          const cb = h('input', { type: 'checkbox', onchange: () => { S.score += cb.checked ? 1 : -1; S.refreshScore(); } });
          line.push(h('label', { class: 'line half' }, cb, ' Add 1 mark (my answer is also acceptable)'));
        }
        return h('div', { class: 'rrow ' + (ok ? 'ok' : 'bad') },
          h('span', { class: 'qnum ' + (ok ? 'ok' : 'bad'), text: disp(n) }),
          h('div', null, line),
          q.explain ? h('div', { class: 'exp', text: q.explain }) : null);
      })));

    S.checkBtn.textContent = 'Back to list';
    refreshPager();
    S.stage.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------ *
   * Writing
   * ------------------------------------------------------------------ */
  function buildWriting(app) {
    const t = S.t, P = PARTS[t.part];
    const prog = DB.progress[t.id];
    S.choice = prog && typeof prog.choice === 'number' ? prog.choice : 0;

    const editor = h('textarea', { class: 'editor', placeholder: 'Start writing here…', spellcheck: 'true' });
    editor.value = prog ? prog.text || '' : '';
    S.editor = editor;
    const counter = h('span', { class: 'wcount' });
    const [lo, hi] = t.range;
    const updateCount = () => {
      const w = countWords(editor.value);
      counter.textContent = `${w} word${w === 1 ? '' : 's'}`;
      counter.className = 'wcount ' + (w < lo ? 'low' : w > hi ? 'high' : 'good');
    };
    editor.addEventListener('input', () => { autoStart(); updateCount(); saveProgress(); });
    editor.addEventListener('focus', autoStart);
    updateCount();

    let left;
    if (t.part === 'W1') {
      left = h('div', null,
        t.intro ? h('p', { class: 'lead', text: t.intro }) : null,
        t.texts.map((x, i) => h('div', { class: 'pane', style: 'margin-bottom:14px' },
          h('span', { class: 'src-label', text: 'Text ' + (i + 1) }), x.title ? h('h3', { style: 'font-style:italic', text: x.title }) : null, paras(x.text).map(p => h('p', { text: p })))),
        h('div', { class: 'pane', style: 'max-height:none' }, h('p', null, h('b', { text: t.task }))));
    } else {
      const btns = t.options.map((o, i) => h('button', { type: 'button', class: 'task', onclick: () => {
        autoStart(); S.choice = i; paintTasks(); saveProgress();
      } }, h('div', { class: 'tag', text: `Question ${i + 2} · ${o.label}` }), h('div', { text: o.prompt })));
      const paintTasks = () => btns.forEach((b, i) => b.classList.toggle('sel', i === S.choice));
      paintTasks();
      left = h('div', null, h('div', { class: 'taskpick' }, btns));
    }

    const taskText = () => t.part === 'W1' ? `${t.intro ? t.intro + '\n\n' : ''}${t.texts.map((x, i) => `Text ${i + 1}${x.title ? ' (' + x.title + ')' : ''}:\n${x.text}`).join('\n\n')}\n\n${t.task}`
      : `[${t.options[S.choice].label}] ${t.options[S.choice].prompt}`;

    const finish = h('button', { type: 'button', class: 'btn primary', onclick: () => {
      const w = countWords(editor.value);
      if (!w) { toast('Write something first'); return; }
      pauseTimer();
      DB.history.push({ ts: Date.now(), id: t.id, part: t.part, title: t.title, words: w, ms: curElapsed(), text: editor.value, task: taskText() });
      saveDB();
      toast('Saved to history');
    } }, 'Finish & save');
    const copy = h('button', { type: 'button', class: 'btn', title: 'Copies your answer with an examiner-style feedback request', onclick: () => {
      const txt = `Please assess this Cambridge C2 Proficiency ${P.name} answer as an examiner. Give a band (0–5) for each criterion – Content, Communicative Achievement, Organisation, Language – with short reasons, point out specific language errors, and suggest improvements.\n\nTASK:\n${taskText()}\n\nMY ANSWER (${countWords(editor.value)} words):\n${editor.value}`;
      const done = () => toast('Copied – paste it into an AI assistant or a teacher\'s message');
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => { editor.select(); document.execCommand('copy'); done(); });
      else { editor.select(); document.execCommand('copy'); done(); }
    } }, 'Copy for feedback');
    const clear = h('button', { type: 'button', class: 'btn danger', onclick: () => {
      if (editor.value && !confirm('Clear your text?')) return;
      editor.value = ''; updateCount(); saveProgress();
    } }, 'Clear');

    const right = h('div', { class: 'editor-wrap' },
      h('div', { class: 'wbar' }, counter, h('span', { class: 'wrange', text: `Target: ${lo}–${hi} words` })),
      editor,
      h('div', { class: 'wbar' }, finish, copy, clear));

    const stage = h('div', { class: 'stage' },
      h('div', { class: 'instr' }, h('b', { text: t.part === 'W1' ? 'Question 1' : 'Questions 2–4' }), h('span', null, rich(P.instr))),
      h('div', { class: 'wgrid', style: 'margin-top:18px' }, left, right));
    app.replaceChildren(stage);
    updateTimeUI();
  }


  /* ------------------------------------------------------------------ *
   * Highlight and notes: select text in a passage, then choose Note or Highlight
   * ------------------------------------------------------------------ */
  let seltool = null, selRange = null;
  const NO_MARK = 'button, select, input, textarea, .gap, .dropgap, .pool, .pcard, .qrow, .review, .banner, .pop, .seltool, .notes-panel';

  function hideTool() { if (seltool) { seltool.remove(); seltool = null; } selRange = null; }

  function showTool(rect, buttons) {
    hideTool();
    seltool = h('div', { class: 'seltool', onmousedown: e => e.preventDefault() }, buttons);
    document.body.append(seltool);
    const tw = seltool.offsetWidth, th = seltool.offsetHeight;
    let top = rect.top - th - 10;
    if (top < 8) top = rect.bottom + 10;
    seltool.style.top = top + 'px';
    seltool.style.left = Math.max(8, Math.min(window.innerWidth - tw - 8, rect.left + rect.width / 2 - tw / 2)) + 'px';
  }

  function toolBtn(icon, label, fn) {
    return h('button', { type: 'button', onclick: fn }, h('span', { class: 'ico', text: icon }), h('span', { text: label }));
  }

  // wrap every text node touched by the range in <mark class=cls data-g=group>
  function wrapRange(range, cls, group) {
    const anc = range.commonAncestorContainer;
    const root = anc.nodeType === 3 ? anc.parentNode : anc;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (!n.nodeValue.length || !range.intersectsNode(n)) continue;
      if (n.parentElement && n.parentElement.closest(NO_MARK)) continue;
      nodes.push(n);
    }
    const sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset;
    nodes.forEach(n => {
      const s0 = n === sc ? so : 0, e0 = n === ec ? eo : n.length;
      if (e0 <= s0) return;
      let target = n;
      if (s0 > 0) target = n.splitText(s0);
      if (e0 - s0 < target.length) target.splitText(e0 - s0);
      if (!target.nodeValue.trim()) return;
      const m = document.createElement('mark');
      m.className = cls; m.dataset.g = group;
      target.parentNode.insertBefore(m, target);
      m.appendChild(target);
    });
  }

  function unwrapGroup(group) {
    document.querySelectorAll('mark[data-g="' + group + '"]').forEach(m => {
      const par = m.parentNode;
      while (m.firstChild) par.insertBefore(m.firstChild, m);
      par.removeChild(m);
      par.normalize();
    });
  }

  function clearSelection() { const sel = window.getSelection(); if (sel) sel.removeAllRanges(); }

  function addHighlight() {
    if (!selRange) return;
    wrapRange(selRange, 'hl', 'h' + Date.now());
    clearSelection(); hideTool();
  }

  function addNote() {
    if (!selRange) return;
    const raw = selRange.toString().replace(/\s+/g, ' ').trim();
    const id = 'n' + Date.now();
    wrapRange(selRange, 'hl-note', id);
    S.notes.push({ id, snippet: raw.length > 24 ? raw.slice(0, 24) + '…' : raw, text: '' });
    saveProgress();
    clearSelection(); hideTool();
    openNotes(id);
  }

  function notesLabel() {
    if (S.writing) return S.t.part === 'W1' ? '1' : '2–4';
    return disp(1) + '–' + disp(qCount(S.t));
  }

  function renderNotes(focusId) {
    const panel = $('.notes-panel');
    if (!panel || !S) return;
    const list = panel.querySelector('.notes-list');
    list.replaceChildren(...(S.notes.length ? S.notes.map(n => {
      const ta = h('textarea', { rows: 4, placeholder: 'Start typing your note', 'aria-label': 'Note text' });
      ta.value = n.text;
      ta.addEventListener('input', () => { n.text = ta.value; saveProgress(); });
      return h('div', { class: 'note-card', 'data-id': n.id },
        h('div', { class: 'note-head' }, h('b', { text: notesLabel() }), ' ', h('i', { text: n.snippet })),
        ta,
        h('button', { type: 'button', class: 'note-del', onclick: () => deleteNote(n.id) }, 'Delete'));
    }) : [h('p', { class: 'notes-empty', text: 'Select text in a passage and choose Note to add a note here.' })]));
    if (focusId) {
      const ta = list.querySelector('[data-id="' + focusId + '"] textarea');
      if (ta) { ta.focus(); ta.scrollIntoView({ block: 'nearest' }); }
    }
  }

  function openNotes(focusId) {
    if (!S) return;
    if (!$('.notes-panel')) {
      const hdr = $('.top');
      const panel = h('div', { class: 'notes-panel' },
        h('div', { class: 'notes-head' }, h('b', { text: 'Notes' }), h('button', { type: 'button', class: 'notes-x', 'aria-label': 'Close notes', onclick: closeNotes }, '✕')),
        h('div', { class: 'notes-list' }));
      panel.style.top = (hdr ? hdr.offsetHeight : 62) + 'px';
      document.body.append(panel);
      document.body.classList.add('notes-open');
    }
    renderNotes(focusId);
  }

  function closeNotes() {
    const panel = $('.notes-panel');
    if (panel) panel.remove();
    document.body.classList.remove('notes-open');
  }

  function deleteNote(id) {
    S.notes = S.notes.filter(n => n.id !== id);
    unwrapGroup(id);
    renderNotes();
    saveProgress();
  }

  function onSelectEnd(ev) {
    if (!S || (ev.target.closest && ev.target.closest('.seltool, .notes-panel'))) return;
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || sel.isCollapsed || !sel.toString().trim()) return;
      const range = sel.getRangeAt(0);
      const anc = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
      if (!anc || !anc.closest || !anc.closest('.stage') || anc.closest('input, textarea, select, .seltool, .notes-panel, .pop, .review, .banner')) return;
      const saved = range.cloneRange();
      showTool(range.getBoundingClientRect(), [toolBtn('❝', 'Note', addNote), toolBtn('!', 'Highlight', addHighlight)]);
      selRange = saved;
    }, 0);
  }

  document.addEventListener('mousedown', e => { if (!(e.target.closest && e.target.closest('.seltool'))) hideTool(); });
  document.addEventListener('mouseup', onSelectEnd);
  document.addEventListener('touchend', onSelectEnd);
  document.addEventListener('keyup', e => { if (e.shiftKey) onSelectEnd(e); });
  document.addEventListener('click', ev => {
    if (!S) return;
    const m = ev.target.closest && ev.target.closest('mark.hl, mark.hl-note');
    if (!m) return;
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;
    if (m.classList.contains('hl-note')) { openNotes(m.dataset.g); return; }
    showTool(m.getBoundingClientRect(), [toolBtn('✕', 'Remove', () => { unwrapGroup(m.dataset.g); hideTool(); })]);
  });

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  route();
})();
