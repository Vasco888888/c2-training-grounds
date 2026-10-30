/* Router: hash routing and leaving tests. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

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
    X = null;
    if (parts[0] === 'exam') { $('[data-nav="exam"]').classList.add('active'); viewExamStart(); return; }
    if (parts[0] === 'test' && parts[1]) {
      const t = TESTS.find(x => x.id === decodeURIComponent(parts[1]));
      if (t) { openTest(t); return; }
    }
    if (parts[0] === 'history') { $('[data-nav="history"]').classList.add('active'); viewHistory(); return; }
    $('[data-nav="home"]').classList.add('active');
    viewHome();
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('beforeunload', ev => { if ((S && !S.checked) || (X && !X.done)) { ev.preventDefault(); ev.returnValue = ''; } });
  // leaving an exam by any link abandons it, so ask first
  document.addEventListener('click', ev => {
    const a = ev.target.closest && ev.target.closest('header a');
    if (a && X && !X.done && !confirm('Leave the exam? Your answers will be lost.')) ev.preventDefault();
  }, true);

  const go = hash => { location.hash = hash; };
