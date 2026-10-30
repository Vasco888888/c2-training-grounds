/* Highlight and notes on the reading text. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

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
