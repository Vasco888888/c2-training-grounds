/* Reading builders: cloze, transformations, multiple choice, gapped text and matching layouts. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

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
      content = resizable(h('div', { class: 'split' }, h('div', { class: 'pane plain' }, h('div', { class: 'ptitle', text: t.heading || t.title }), subtitle, cloze), pool));
    } else if (t.part === '7') {
      const left = h('div', { class: 'pane plain' }, h('div', { class: 'ptitle', text: t.heading || t.title }), subtitle,
        t.sections.map(x => h('div', { class: 'sec' }, h('div', { class: 'sechead' }, h('b', { text: x.label }), t.choose === 'section' ? null : h('b', { text: x.heading || '' })),
          paras(x.text).map(p => h('p', { text: p })))));
      const right = h('div', { class: 'pane plain' }, h('div', { class: 'ptitle', text: t.qtitle || 'Which section gives each of these opinions?' }),
        t.questions.map((q, i) => qRow(t, q, i + 1)));
      content = resizable(h('div', { class: 'split' }, left, right));
    } else {
      let left;
      if (t.part === '5') {
        left = h('div', { class: 'pane' }, h('h3', { text: t.heading || t.title }), subtitle, paras(t.text).map(p => h('p', { text: p })));
      } else {
        left = h('div', { class: 'pane' }, h('h3', { text: t.title }), t.sections.map(x => h('div', { class: 'src' },
          h('span', { class: 'src-label', text: x.label }), x.heading ? h('h3', { text: x.heading }) : null, paras(x.text).map(p => h('p', { text: p })))));
      }
      const right = h('div', { class: 'pane plain' }, t.questions.map((q, i) => choiceCard(t, q, i + 1)));
      content = resizable(h('div', { class: 'split' }, left, right));
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
    S.checkBtn = h('button', { type: 'button', class: 'btn primary', onclick: () => {
      if (X) { if (S.checked) examResults(); else examNext(); } else if (S.checked) go('#/'); else checkAnswers();
    } }, X && !X.done ? examNextLabel() : 'Check answers');
    const foot = h('div', { class: 'foot' },
      X && !X.done ? examNav() : h('span', { class: 'plabel', text: `Part ${t.part}` }), pager, S.countEl,
      h('span', { class: 'spacer' }), S.bm, S.checkBtn, S.prev, S.next);

    $('#app').replaceChildren(stage, foot);
    Object.keys(S.paint).forEach(n => S.paint[n]());
    refreshPager();
    setCur(1, false);
    if (S.usedRefresh) S.usedRefresh();
  }
