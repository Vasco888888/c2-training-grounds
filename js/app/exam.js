/* Exam mode: random papers under one countdown, scale score and results. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

  /* ------------------------------------------------------------------ *
   * Exam mode: one random test from each part of a paper, under a single countdown
   * ------------------------------------------------------------------ */
  const writingTask = (t, choice) => t.part === 'W1'
    ? `${t.intro ? t.intro + '\n\n' : ''}${t.texts.map((x, i) => `Text ${i + 1}${x.title ? ' (' + x.title + ')' : ''}:\n${x.text}`).join('\n\n')}\n\n${t.task}`
    : `[${t.options[choice].label}] ${t.options[choice].prompt}`;

  const EXAMS = {
    reading: { name: 'Reading and Use of English paper', parts: READING },
    writing: { name: 'Writing paper', parts: WRITING }
  };

  // Estimated Cambridge English Scale score for a raw mark out of 72. The real conversion differs from test to test and is not
  // published, so this is a straight-line estimate between anchor points: 60% is about 200 (grade C), 75% about 213 (B), 85% about 220 (A).
  const SCALE_POINTS = [[0, 120], [0.6, 200], [0.75, 213], [0.85, 220], [1, 230]];
  function scaleScore(raw, total) {
    const r = total ? raw / total : 0;
    for (let i = 1; i < SCALE_POINTS.length; i++) {
      const [x0, y0] = SCALE_POINTS[i - 1], [x1, y1] = SCALE_POINTS[i];
      if (r <= x1) return Math.round(y0 + (y1 - y0) * (r - x0) / (x1 - x0));
    }
    return 230;
  }
  function gradeOf(scale) {
    if (scale >= 220) return 'Grade A';
    if (scale >= 213) return 'Grade B';
    if (scale >= 200) return 'Grade C';
    if (scale >= 180) return 'Level C1';
    return scale >= 162 ? 'Below C1' : 'Not reported';
  }

  // The grade bands drawn to scale, with a marker at the estimated score
  function gradeChart(sc) {
    const NS = 'http://www.w3.org/2000/svg', LO = 162, HI = 230, X0 = 20, W = 640;
    const x = v => X0 + (Math.min(HI, Math.max(LO, v)) - LO) / (HI - LO) * W;
    const el = (tag, attrs, text) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
      if (text !== undefined) e.textContent = text;
      return e;
    };
    const bands = [[162, 180, 'Below C1', 'band-low'], [180, 200, 'Level C1', 'band-c1'], [200, 213, 'Grade C', 'band-c'], [213, 220, 'Grade B', 'band-b'], [220, 230, 'Grade A', 'band-a']];
    const svg = el('svg', { viewBox: '0 0 680 112', class: 'gradechart', role: 'img',
      'aria-label': `Estimated score ${sc >= 180 ? sc : 'below 180'} on a scale with Grade A 220 to 230, Grade B 213 to 219, Grade C 200 to 212, Level C1 180 to 199` });
    bands.forEach(([a, b, label, cls], i) => {
      const x1 = x(a) + (i ? 1 : 0), x2 = x(b === 230 ? 230 : b) - (i < bands.length - 1 ? 1 : 0);
      svg.append(el('rect', { x: x1, y: 38, width: x2 - x1, height: 30, rx: 4, class: 'band ' + cls }));
      svg.append(el('text', { x: (x1 + x2) / 2, y: 57, class: 'band-label', 'text-anchor': 'middle' }, label));
    });
    [162, 180, 200, 213, 220, 230].forEach(v => svg.append(el('text', { x: x(v), y: 90, class: 'tick', 'text-anchor': 'middle' }, String(v))));
    const mx = x(sc);
    svg.append(el('path', { d: `M${mx - 7} 22 L${mx + 7} 22 L${mx} 36 Z`, class: 'marker' }));
    svg.append(el('text', { x: Math.min(640, Math.max(40, mx)), y: 15, class: 'marker-label', 'text-anchor': 'middle' }, sc >= 180 ? String(sc) : '< 180'));
    return svg;
  }

  function viewExamStart() {
    const app = $('#app');
    const card = (key, lines) => h('div', { class: 'examcard' }, h('h2', { text: EXAMS[key].name }),
      h('ul', null, lines.map(l => h('li', { text: l }))),
      h('button', { type: 'button', class: 'btn primary', onclick: () => examStart(key) }, 'Start the paper'));
    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: 'Exam mode' }),
      h('p', { class: 'lead', text: 'A full paper under exam conditions: one test picked at random from each part (tests you have not done yet are preferred) and a countdown of 1 hour 30 minutes. You can move between the parts freely, but there is no pause and no feedback until you finish, and leaving the page ends the attempt.' }),
      h('div', { class: 'examcards' },
        card('reading', ['Parts 1–7: 53 questions, 72 marks', 'Marked when you finish or when time runs out', 'Gives an estimated score on the 180–230 scale and a grade']),
        card('writing', ['Part 1 (essay) and Part 2 (choice of task)', 'Both answers are saved to History', 'Afterwards you can copy them out for feedback']))));
    app.className = '';
  }

  function examStart(key) {
    const tests = EXAMS[key].parts.map(p => {
      const all = testsOf(p), fresh = all.filter(t => !DB.history.some(x => x.id === t.id));
      const pool = fresh.length ? fresh : all;
      return pool[Math.floor(Math.random() * pool.length)];
    });
    if (tests.some(t => !t)) { alert('Some parts have no tests yet.'); return; }
    leaveTest();
    X = { key, tests, idx: 0, state: {}, deadline: Date.now() + EXAM_MS, done: false, entries: [] };
    openTest(tests[0]);
  }

  function examSave() {
    if (!S || S.checked || !X || X.done) return;
    X.state[X.idx] = S.writing ? { text: S.editor.value, choice: S.choice }
      : { answers: Object.assign({}, S.answers), flags: Object.assign({}, S.flags) };
  }
  function examGo(i) { examSave(); leaveTest(); X.idx = i; openTest(X.tests[i]); }
  const examNextLabel = () => (X.idx === X.tests.length - 1 ? 'Finish paper' : 'Next part');
  function examNext() {
    if (X.idx < X.tests.length - 1) examGo(X.idx + 1);
    else if (confirm('Finish the paper and see your results?')) examFinish(false);
  }
  function examNav() {
    return h('div', { class: 'examnav' }, h('span', { class: 'plabel', text: 'Part' }),
      X.tests.map((t, i) => h('button', { type: 'button', class: i === X.idx ? 'cur' : '', 'aria-label': 'Go to part ' + t.part.replace('W', ''),
        onclick: () => { if (i !== X.idx) examGo(i); } }, t.part.replace('W', ''))));
  }

  function examFinish(timeUp) {
    if (!X || X.done) return;
    examSave();
    X.done = true; X.timeUp = timeUp; X.spent = Math.min(Date.now(), X.deadline) - (X.deadline - EXAM_MS);
    clearInterval(tick); closePopover(); closeNotes(); hideTool();
    S = null; $('#hdr-tools').replaceChildren();
    X.tests.forEach((t, i) => {
      const st = X.state[i] || {};
      let entry = null;
      if (t.part[0] === 'W') {
        const text = st.text || '', words = countWords(text);
        if (words) entry = { ts: Date.now(), id: t.id, part: t.part, title: t.title, words, ms: 0, text, task: writingTask(t, st.choice || 0), exam: true };
      } else {
        const wt = WEIGHT[t.part], ans = st.answers || {};
        let score = 0, right = 0;
        t.questions.forEach((q, k) => {
          const v = ans[k + 1], ph = t.part === '4' ? partHits(q, v) : null, full = isCorrect(t, q, v) || !!(ph && ph.n === 2);
          score += full ? wt : (ph ? ph.n : 0);
          if (full) right++;
        });
        entry = { ts: Date.now(), id: t.id, part: t.part, title: t.title, score, total: t.questions.length * wt, ms: 0, exam: true, right };
      }
      if (entry) DB.history.push(entry);
      X.entries[i] = entry;
    });
    saveDB();
    viewExamResults();
  }

  function examResults() { leaveTest(); viewExamResults(); }
  function examReview(i) {
    leaveTest(); X.idx = i;
    openTest(X.tests[i]);
    if (S.writing) { S.checked = true; pauseTimer(); updateTimeUI(); }
    else checkAnswers({ quiet: true, entry: X.entries[i] });
  }

  function viewExamResults() {
    const app = $('#app'), isW = X.key === 'writing';
    let got = 0, tot = 0;
    const rows = X.tests.map((t, i) => {
      const e = X.entries[i];
      if (!isW) { got += e.score; tot += e.total; }
      return h('tr', null,
        h('td', { text: 'Part ' + t.part.replace('W', '') }),
        h('td', null, h('b', { text: t.title }), h('br'), h('small', { text: PARTS[t.part].name })),
        h('td', { text: isW ? (e ? `${e.words} words` : 'Not attempted') : `${e.right} / ${t.questions.length}` }),
        h('td', null, h('button', { type: 'button', class: 'btn small', onclick: () => examReview(i) }, 'Review')));
    });
    let head;
    if (isW) {
      head = h('p', { class: 'lead', text: 'Your writing has been saved to History. Use Review, then “Copy for feedback”, to have it assessed.' });
    } else {
      const sc = scaleScore(got, tot);
      head = h('div', null, h('div', { class: 'examscore' },
        h('div', { class: 'big', text: sc >= 180 ? String(sc) : '< 180' }),
        h('div', null, h('div', { class: 'grade', text: gradeOf(sc) }),
          h('div', { class: 'sub', text: `${got} / ${tot} marks · estimated on the 180–230 scale` }))), gradeChart(sc));
    }
    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: EXAMS[X.key].name + (X.timeUp ? ' – time is up' : ' – finished') }),
      h('p', { class: 'lead', text: `Time used: ${fmtTime(X.spent)} of 1:30:00.` }),
      head,
      h('table', { class: 'stats' }, h('thead', null, h('tr', null, ['Part', 'Test', isW ? 'Length' : 'Correct', ''].map(c => h('th', { text: c })))), h('tbody', null, rows)),
      isW ? null : h('p', { class: 'sub', text: 'The scale score is an estimate: Cambridge converts marks to the scale differently for every paper, so a real result can differ.' }),
      h('div', { class: 'toolbar' },
        h('button', { type: 'button', class: 'btn primary', onclick: () => examStart(X.key) }, 'New paper'),
        h('button', { type: 'button', class: 'btn', onclick: () => go('#/') }, 'Back to list'))));
    app.className = '';
  }
