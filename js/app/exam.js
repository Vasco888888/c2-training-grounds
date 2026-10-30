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

  // Estimated Cambridge English Scale score. Cambridge does not publish its conversion, so this uses the community tables from
  // cambridge-score.com: marks on Parts 1, 5, 6 and 7 (out of 44) and on Parts 2, 3 and 4 (out of 28) are each converted, and the
  // two results are averaged. A 0 means the marks are too low to be reported.
  const SCALE_READING = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,162,164,167,169,171,173,176,178,180,183,187,190,193,197,200,203,205,208,210,213,215,218,220,221,223,224,225,226,228,229,230];
  const SCALE_USE = [0,0,0,0,0,0,0,0,0,162,167,171,176,180,185,190,195,200,204,208,212,216,220,222,223,225,227,228,230];
  const scaleScore = (readingMarks, useMarks) => Math.ceil((SCALE_READING[readingMarks] + SCALE_USE[useMarks]) / 2);
  function gradeOf(scale) {
    if (scale >= 220) return 'Grade A';
    if (scale >= 213) return 'Grade B';
    if (scale >= 200) return 'Grade C';
    if (scale >= 180) return 'Level C1';
    return scale >= 162 ? 'Below C1' : 'Not reported';
  }

  // The grade bands drawn to scale as one vertical bar, with a marker for each estimated score
  function gradeChart(markers) {
    const NS = 'http://www.w3.org/2000/svg', LO = 162, HI = 230, TOP = 24, H = 600, BX = 150, BW = 44;
    const y = v => TOP + (HI - Math.min(HI, Math.max(LO, v))) / (HI - LO) * H;
    const el = (tag, attrs, text) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
      if (text !== undefined) e.textContent = text;
      return e;
    };
    const shown = v => (v >= 180 ? String(v) : '< 180');
    const bands = [[230, 220, 'A', 'band-a'], [220, 213, 'B', 'band-b'], [213, 200, 'C', 'band-c'], [200, 180, 'C1', 'band-c1'], [180, 162, 'Below', 'band-low']];
    const svg = el('svg', { viewBox: '0 0 240 652', class: 'gradechart', role: 'img',
      'aria-label': 'Estimated scores: ' + markers.map(m => m.label + ' ' + shown(m.v)).join(', ') + '. Grade A is 220 to 230, B 213 to 219, C 200 to 212, Level C1 180 to 199.' });
    bands.forEach(([hi, lo, label, cls], i) => {
      const y1 = y(hi) + (i ? 1 : 0), y2 = y(lo) - (i < bands.length - 1 ? 1 : 0);
      svg.append(el('rect', { x: BX, y: y1, width: BW, height: y2 - y1, rx: 4, class: 'band ' + cls }));
      svg.append(el('text', { x: BX + BW / 2, y: (y1 + y2) / 2 + 4, class: 'band-label', 'text-anchor': 'middle' }, label));
    });
    [230, 220, 213, 200, 180, 162].forEach(v => svg.append(el('text', { x: BX + BW + 8, y: y(v) + 4, class: 'tick' }, String(v))));
    // top marker first, so that when two scores are close the lower label is the one pushed down
    let lastLabelY = -99;
    markers.map((m, i) => ({ m, i, ty: y(m.v) })).sort((p, q) => p.ty - q.ty).forEach(({ m, i, ty }) => {
      const ly = Math.max(ty, lastLabelY + 18);   // keep two close labels from overlapping
      lastLabelY = ly;
      svg.append(el('path', { d: `M${BX - 16} ${ty - 7} L${BX - 16} ${ty + 7} L${BX - 3} ${ty} Z`, class: 'marker m' + (i + 1) }));
      svg.append(el('text', { x: BX - 22, y: ly + 4, class: 'marker-label m' + (i + 1), 'text-anchor': 'end' }, m.label + ' ' + shown(m.v)));
    });
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
        card('reading', ['Parts 1–7: 53 questions, 72 marks', 'Marked when you finish or when time runs out', 'Gives separate estimated scores for Reading and Use of English on the 180–230 scale, with a grade for each']),
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
        h('td', { text: isW ? (e ? `${e.words} words` : 'Not attempted') : (t.part === '4' ? `${e.score} / ${e.total}` : `${e.right} / ${t.questions.length}`) }),
        h('td', null, h('button', { type: 'button', class: 'btn small', onclick: () => examReview(i) }, 'Review')));
    });
    let head, side = null;
    if (isW) {
      head = h('p', { class: 'lead', text: 'Your writing has been saved to History. Use Review, then “Copy for feedback”, to have it assessed.' });
    } else {
      const marksOf = parts => X.tests.reduce((n, t, i) => n + (parts.includes(t.part) ? X.entries[i].score : 0), 0);
      // Reading (Parts 1, 5, 6, 7) and Use of English (Parts 2, 3, 4) each get their own scale score
      const rm = marksOf(['1', '5', '6', '7']), um = marksOf(['2', '3', '4']);
      const rs = SCALE_READING[rm], us = SCALE_USE[um];
      const section = (cls, label, parts, marks, max, sc) => h('div', { class: 'examsec ' + cls },
        h('div', { class: 'eyebrow', text: label }),
        h('div', { class: 'big', text: sc >= 180 ? String(sc) : '< 180' }),
        h('div', { class: 'grade', text: gradeOf(sc) }),
        h('div', { class: 'sub', text: `${marks} / ${max} marks · ${parts}` }));
      head = h('div', { class: 'examscores' },
        section('m1', 'Reading', 'Parts 1, 5 (×2), 6 (×2), 7', rm, 44, rs),
        section('m2', 'Use of English', 'Parts 2, 3, 4', um, 28, us));
      side = h('aside', { class: 'examres-side' }, gradeChart([{ label: 'Reading', v: rs }, { label: 'Use of English', v: us }]));
    }
    const main = h('div', { class: 'examres-main' },
      head,
      h('table', { class: 'stats' }, h('thead', null, h('tr', null, ['Part', 'Test', isW ? 'Length' : 'Correct', ''].map(c => h('th', { text: c })))), h('tbody', null, rows)),
      isW ? null : h('p', { class: 'sub', text: 'The scale scores are estimates from a community conversion table, not an official one: Cambridge sets its conversion separately for every paper, so a real result can differ.' }),
      h('div', { class: 'toolbar' },
        h('button', { type: 'button', class: 'btn primary', onclick: () => examStart(X.key) }, 'New paper'),
        h('button', { type: 'button', class: 'btn', onclick: () => go('#/') }, 'Back to list')));
    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: EXAMS[X.key].name + (X.timeUp ? ' – time is up' : ' – finished') }),
      h('p', { class: 'lead', text: `Time used: ${fmtTime(X.spent)} of 1:30:00.` }),
      h('div', { class: side ? 'examres' : '' }, main, side)));
    app.className = '';
  }
