/* Test engine: answers, correctness, formatting and opening a test. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

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
  const fullPara = (t, L) => { const p = (t.paragraphs || []).find(x => x.label === L); return p ? `${L}. ${p.text.trim()}` : String(L); };
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
    if (k === 'letter' && t.part === '6') return fullPara(t, val);
    return String(val);
  }
  function fmtCorrect(t, q) {
    const k = KIND[t.part];
    if (k === 'mc') return t.part === '5' ? `${letter(q.answer)}. ${q.options[q.answer]}` : q.options[q.answer];
    if (k === 'text') {
      if (t.part === '4') return [q.before, q.parts ? schemesOf(q)[0][0][0] + ' | ' + schemesOf(q)[0][1][0] : q.answer[0], q.after].filter(Boolean).join(' ').replace(/\s+([,.;:])/g, '$1');
      return q.answer.join('  /  ');
    }
    if (t.part === '6') return fullPara(t, q.answer);
    return q.answer;
  }

  // under exam conditions a test is not saved half-way: leaving it discards the attempt
  function saveProgress() {}

  function openTest(t) {
    S = { t, answers: {}, flags: {}, cur: 1, checked: false, elapsed: 0, running: false, lastTs: 0, paint: {}, results: {}, notes: [], writing: t.part[0] === 'W' };
    const saved = X && X.state[X.idx];       // returning to a part of the exam: put back what was entered
    if (saved) { S.restore = saved; if (!S.writing) { S.answers = Object.assign({}, saved.answers); S.flags = Object.assign({}, saved.flags); } }
    const app = $('#app');
    app.className = 'testview';
    $('#hdr-tools').replaceChildren(stopwatchEl(), h('button', { type: 'button', class: 'btn', title: 'Select text in the passage to highlight it or add a note', onclick: () => ($('.notes-panel') ? closeNotes() : openNotes()) }, '\u270e Notes'));
    if (S.writing) buildWriting(app); else buildReading(app);
    S.ready = true;
    startTimer();
  }
