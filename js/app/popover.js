/* Popover: the dark answer bar used for gap choices. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

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
