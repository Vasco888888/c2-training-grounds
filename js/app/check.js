/* Checking: marking, Part 4 two-part scoring, score banner and the review of answers. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

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

  function checkAnswers(opt) {
    opt = opt || {};
    if (S.checked) return;
    const N = qCount(S.t);
    const blank = S.t.questions.filter((_, i) => !isAnswered(i + 1)).length;
    if (blank && !opt.quiet && !confirm(`${blank} of ${N} question${blank > 1 ? 's are' : ' is'} unanswered. Check anyway?`)) return;
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
    const entry = opt.entry || { ts: Date.now(), id: S.t.id, part: S.t.part, title: S.t.title, score, total: N * wt, ms };
    if (!opt.entry) DB.history.push(entry);   // an exam review re-uses the entry that was saved when the exam finished
    S.entry = entry; S.score = score;
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
      h('div', null, S.pctEl, h('div', { class: 'sub', text: X ? 'Exam review' : S.elapsed > 0 ? `Time: ${fmtTime(ms)}` : 'Stopwatch was not used' })),
      h('div', { class: 'acts' },
        X ? null : h('button', { type: 'button', class: 'btn', onclick: () => { delete DB.progress[S.t.id]; const t = S.t; leaveTest(); openTest(t); } }, 'Try again'),
        !X && nextT && nextT.id !== S.t.id ? h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/test/' + encodeURIComponent(nextT.id)) }, 'Next test') : null,
        h('button', { type: 'button', class: 'btn', onclick: () => (X ? examResults() : go('#/')) }, X ? 'Back to results' : 'Back to list'))));

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

    S.checkBtn.textContent = X ? 'Back to results' : 'Back to list';
    refreshPager();
    S.stage.scrollTo({ top: 0, behavior: 'smooth' });
  }
