/* Views: the practice library (home) and the history page. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

  /* ------------------------------------------------------------------ *
   * Home
   * ------------------------------------------------------------------ */
  function testsOf(part) { return TESTS.filter(t => t.part === part); }
  function qCount(t) { return t.questions ? t.questions.length : 0; }

  function statusOf(t) {
    const att = DB.history.filter(x => x.id === t.id);
    if (!att.length) return { cls: 'new', text: 'Not attempted' };
    if (t.part === 'W1' || t.part === 'W2') return { cls: 'done', text: `Written ${att.length}×` };
    const best = Math.max(...att.map(a => a.score / a.total));
    const b = att.find(a => a.score / a.total === best);
    return { cls: 'done', text: `Best ${b.score}/${b.total} · ${att.length} attempt${att.length > 1 ? 's' : ''}` };
  }

  let homeFilter = null;   // null = show every part

  function viewHome() {
    const app = $('#app');
    const chip = (label, value) => h('button', { type: 'button', class: 'chip-filter' + (homeFilter === value ? ' on' : ''),
      onclick: () => { homeFilter = value; viewHome(); } }, label);
    const jump = h('div', { class: 'jump' },
      chip('All', null),
      [...READING, ...WRITING].map(p => chip(p[0] === 'W' ? 'Writing ' + p[1] : 'Part ' + p, p)));

    const section = p => {
      const list = testsOf(p);
      return h('section', { class: 'part-sec', id: 'sec-' + p },
        h('div', { class: 'part-head' },
          h('h2', { text: (p[0] === 'W' ? '' : 'Part ' + p + ' \u2013 ') + PARTS[p].name.replace(/^Writing Part \d \u2013 /, '') })),
        h('p', { class: 'part-desc', text: PARTS[p].desc + (list.length ? ` \u00b7 ${list.length} test${list.length > 1 ? 's' : ''}` : '') }),
        list.length
          ? h('div', { class: 'cards' }, list.map(t => {
            const st = statusOf(t);
            const meta = t.questions ? `${qCount(t)} questions` : (t.range ? `${t.range[0]}\u2013${t.range[1]} words` : '');
            return h('a', { class: 'tcard-home', href: '#/test/' + encodeURIComponent(t.id) },
              h('b', { text: t.title }), h('span', { class: 'meta', text: meta }),
              h('span', { class: 'status ' + st.cls, text: st.text }));
          }))
          : h('p', { class: 'empty', text: 'No tests yet.' }));
    };

    const show = list => (homeFilter ? list.filter(p => p === homeFilter) : list);
    const reading = show(READING), writing = show(WRITING);

    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: 'Practice library' }),
      h('p', { class: 'lead', text: 'Pick any test from any part, in any order. Your results are saved in this browser.' }),
      jump,
      reading.length ? h('div', { class: 'group-title', text: 'Reading and Use of English' }) : null,
      reading.map(section),
      writing.length ? h('div', { class: 'group-title', text: 'Writing' }) : null,
      writing.map(section)));
    app.className = '';
  }

  /* ------------------------------------------------------------------ *
   * History
   * ------------------------------------------------------------------ */
  const avgTime = items => { const t = items.filter(x => x.ms > 0); return t.length ? fmtTime(t.reduce((a, x) => a + x.ms, 0) / t.length) : '–'; };
  function viewHistory() {
    const app = $('#app');
    const hist = DB.history.slice().sort((a, b) => b.ts - a.ts);

    const rows = [...READING, ...WRITING].map(p => {
      const items = DB.history.filter(x => x.part === p);
      if (!items.length) return null;
      if (p[0] === 'W') {
        const avg = Math.round(items.reduce((s, x) => s + x.words, 0) / items.length);
        return h('tr', null, h('td', { text: PARTS[p].name }), h('td', { text: items.length }), h('td', { text: `avg ${avg} words` }), h('td', { text: '–' }),
          h('td', { text: avgTime(items) }));
      }
      const total = items[0].total;
      const avg = Math.round(items.reduce((a, x) => a + x.score, 0) / items.length * 10) / 10;
      return h('tr', null, h('td', { text: 'Part ' + p + ' – ' + PARTS[p].name }), h('td', { text: items.length }),
        h('td', { text: `${avg} / ${total}` }),
        h('td', { text: `${Math.max(...items.map(x => x.score))} / ${total}` }),
        h('td', { text: avgTime(items) }));
    }).filter(Boolean);

    const exportBtn = h('button', { type: 'button', class: 'btn', onclick: () => {
      const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'c2-practice-backup.json' });
      document.body.append(a); a.click(); a.remove();
    } }, 'Export backup');
    const fileIn = h('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: ev => {
      const f = ev.target.files[0]; if (!f) return;
      f.text().then(txt => {
        const d = JSON.parse(txt);
        if (!d || !Array.isArray(d.history)) throw new Error('bad file');
        if (!confirm('Replace the data in this browser with the backup?')) return;
        DB = { progress: d.progress || {}, history: d.history }; saveDB(); route();
      }).catch(() => alert('That file is not a valid backup.'));
    } });
    const importBtn = h('button', { type: 'button', class: 'btn', onclick: () => fileIn.click() }, 'Import backup');
    const clearBtn = h('button', { type: 'button', class: 'btn danger', onclick: () => {
      if (confirm('Delete all history?')) { DB = { progress: {}, history: [] }; saveDB(); route(); }
    } }, 'Clear everything');

    const list = hist.map(x => {
      const isW = x.part[0] === 'W';
      const row = h('div', { class: 'hrow' },
        h('div', { class: 'when', text: fmtDate(x.ts) }),
        h('div', { class: 'what' }, h('b', { text: x.title }), h('small', { text: PARTS[x.part].name })),
        h('div', { class: 'res', text: isW ? `${x.words} words` : `${x.score} / ${x.total}` }),
        h('div', { class: 'when', text: x.ms ? fmtTime(x.ms) : '–' }),
        isW ? h('button', { type: 'button', class: 'btn small', onclick: ev => {
          const open = row.querySelector('.htext');
          if (open) { open.remove(); ev.target.textContent = 'View text'; }
          else { row.append(h('div', { class: 'htext', text: (x.task ? x.task + '\n\n— — —\n\n' : '') + x.text })); ev.target.textContent = 'Hide text'; }
        } }, 'View text') : null,
        h('button', { type: 'button', class: 'btn small danger', title: 'Delete this entry', onclick: () => {
          DB.history = DB.history.filter(y => y !== x); saveDB(); route();
        } }, '✕'));
      return row;
    });

    app.replaceChildren(h('div', { class: 'page' },
      h('h1', { text: 'History' }),
      h('p', { class: 'lead', text: 'Every check you run and every piece of writing you save appears here.' }),
      h('div', { class: 'toolbar' }, exportBtn, importBtn, clearBtn, fileIn),
      rows.length ? h('table', { class: 'stats' },
        h('thead', null, h('tr', null, ['Part', 'Attempts', 'Average', 'Best', 'Avg time'].map(c => h('th', { text: c })))),
        h('tbody', null, rows)) : null,
      list.length ? list : h('p', { class: 'empty', text: 'Nothing yet – go and do a test!' })));
    app.className = '';
  }
