/* Writing: the essay and task-choice views. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

  /* ------------------------------------------------------------------ *
   * Writing
   * ------------------------------------------------------------------ */
  function buildWriting(app) {
    const t = S.t, P = PARTS[t.part];
    const live = X && !X.done, review = X && X.done;
    S.choice = S.restore && typeof S.restore.choice === 'number' ? S.restore.choice : 0;

    const editor = h('textarea', { class: 'editor', placeholder: 'Start writing here…', spellcheck: 'true' });
    editor.value = S.restore ? S.restore.text || '' : '';
    if (review) editor.readOnly = true;
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
        if (review) return;
        autoStart(); S.choice = i; paintTasks(); saveProgress();
      } }, h('div', { class: 'tag', text: `Question ${i + 2} · ${o.label}` }), h('div', { text: o.prompt })));
      const paintTasks = () => btns.forEach((b, i) => b.classList.toggle('sel', i === S.choice));
      paintTasks();
      left = h('div', null, h('div', { class: 'taskpick' }, btns));
    }

    const taskText = () => writingTask(t, S.choice);

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
      h('div', { class: 'wbar' }, counter),
      editor,
      h('div', { class: 'wbar' }, live ? clear : review ? [copy, h('button', { type: 'button', class: 'btn', onclick: examResults }, 'Back to results')] : [finish, copy, clear]));

    const stage = h('div', { class: 'stage' },
      h('div', { class: 'instr' }, h('b', { text: t.part === 'W1' ? 'Question 1' : 'Questions 2–4' }), h('span', null, rich(P.instr))),
      resizable(h('div', { class: 'wgrid', style: 'margin-top:18px' }, left, right)));
    if (live) {
      const next = h('button', { type: 'button', class: 'btn primary', onclick: examNext }, examNextLabel());
      app.replaceChildren(stage, h('div', { class: 'foot' }, examNav(), h('span', { class: 'spacer' }), next));
    } else app.replaceChildren(stage);
    updateTimeUI();
  }
