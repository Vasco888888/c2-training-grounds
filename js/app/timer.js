/* Timer: the stopwatch, and the countdown used by exam mode. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

  /* ------------------------------------------------------------------ *
   * Stopwatch (manual start / pause / reset)
   * ------------------------------------------------------------------ */
  let S = null;        // state of the currently open test
  let X = null;        // state of the exam in progress (several tests under one countdown), if any
  let tick = null;
  const EXAM_MS = 90 * 60 * 1000;

  function curElapsed() { return S.elapsed + (S.running ? Date.now() - S.lastTs : 0); }
  function updateTimeUI() {
    if (!S || !S.swTime) return;
    if (X) {
      if (X.done) { S.swTime.textContent = 'Review'; return; }
      const left = Math.max(0, X.deadline - Date.now());
      S.swTime.textContent = fmtTime(Math.ceil(left / 1000) * 1000);
      S.swTime.classList.toggle('low', left < 5 * 60 * 1000);
      S.swTime.classList.add('running');
      if (left <= 0) examFinish(true);
      return;
    }
    S.swTime.textContent = fmtTime(curElapsed());
    S.swTime.classList.toggle('running', S.running);
  }
  function startTimer() {
    if (S.running || S.checked) return;
    S.running = true; S.lastTs = Date.now();
    clearInterval(tick); tick = setInterval(updateTimeUI, 250);
    updateTimeUI();
  }
  function pauseTimer() {
    if (!S || !S.running) return;
    S.elapsed += Date.now() - S.lastTs;
    S.running = false; clearInterval(tick);
    updateTimeUI(); saveProgress();
  }
  // the stopwatch starts by itself on the first real interaction, unless the user paused it on purpose
  function autoStart() {
    if (S && S.ready && !S.running && !S.checked) startTimer();
  }
  // the stopwatch has no buttons: it starts when the test opens and stops when you check or leave
  function stopwatchEl() {
    S.swTime = h('span', { class: 'sw-time', text: '00:00' });
    updateTimeUI();
    return h('div', { class: 'stopwatch' }, S.swTime);
  }
