/* Resizable split: the draggable divider between the text and the questions. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

  /* ------------------------------------------------------------------ *
   * Resizable split: a draggable divider between the text and the questions
   * ------------------------------------------------------------------ */
  let splitRatio = 0.5;   // share of the width given to the left pane, kept while the site is open
  function resizable(box) {
    const apply = () => { box.style.setProperty('--lw', splitRatio + 'fr'); box.style.setProperty('--rw', (1 - splitRatio) + 'fr'); };
    const set = v => { splitRatio = Math.min(0.75, Math.max(0.25, v)); apply(); };
    const bar = h('div', { class: 'divider', role: 'separator', 'aria-orientation': 'vertical', 'aria-label': 'Resize the panels', title: 'Drag to resize', tabindex: '0' }, h('span'));
    bar.addEventListener('pointerdown', e => {
      e.preventDefault(); try { bar.setPointerCapture(e.pointerId); } catch (err) { /* no active pointer */ } bar.classList.add('drag');
      const move = ev => { const r = box.getBoundingClientRect(); set((ev.clientX - r.left) / r.width); };
      const up = () => { bar.classList.remove('drag'); bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); bar.removeEventListener('pointercancel', up); };
      bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up); bar.addEventListener('pointercancel', up);
    });
    bar.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); set(splitRatio + (e.key === 'ArrowLeft' ? -0.03 : 0.03)); }
    });
    box.classList.add('resizable');
    box.insertBefore(bar, box.children[1]);
    apply();
    return box;
  }
