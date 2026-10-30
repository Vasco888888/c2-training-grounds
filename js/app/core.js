/* Core: part definitions, helpers (DOM builder, spelling, formatting) and browser storage. Loaded as a plain script: all js/app files share one scope, in the order listed in index.html. */
'use strict';

  /* ------------------------------------------------------------------ *
   * Part definitions
   * ------------------------------------------------------------------ */
  const PARTS = {
    '1': { name: 'Multiple-choice cloze', desc: 'Choose the word or phrase that best fits each gap in a text (8 questions).',
      instr: 'For each question, choose the correct answer for each gap.' },
    '2': { name: 'Open cloze', desc: 'Write one word in each gap (8 questions).',
      instr: 'For each question, write the correct answer. Write **one** word for each gap.' },
    '3': { name: 'Word formation', desc: 'Form a word from the keyword given for each gap (8 questions).',
      instr: 'For each question, use the word in CAPITALS on the right to form a word that fits in the gap.' },
    '4': { name: 'Key word transformation', desc: 'Complete a second sentence using the key word, in three to eight words (6 questions, 2 marks each).',
      instr: 'For each question, complete the second sentence so that it means the same as the first. **Do not change the word given.** You must use between **three** and **eight** words, including the word given.' },
    '5': { name: 'Multiple choice', desc: 'A long text followed by six four-option questions (2 marks each).',
      instr: 'Read the text. For each question, choose the correct answer.' },
    '6': { name: 'Gapped text', desc: 'Seven paragraphs have been removed from a text; one extra paragraph does not fit (2 marks each).',
      instr: 'Seven paragraphs have been removed from the text below. For each question, choose the correct answer. There is one extra paragraph which you do not need to use.' },
    '7': { name: 'Multiple matching', desc: 'Match ten statements to sections of a text (10 questions).',
      instr: 'Read the text. For each question, choose the correct answer. Each answer may be chosen more than once.' },
    'W1': { name: 'Writing Part 1 – Essay', desc: 'Compulsory essay summarising and evaluating two texts (240–280 words).',
      instr: 'You **must** answer this question. Write an essay summarising and evaluating the key points from both texts in **240–280 words**. Use your own words throughout as far as possible, and include your own ideas in your answer.' },
    'W2': { name: 'Writing Part 2 – Choice of task', desc: 'Choose one of three tasks: article, letter, report or review (280–320 words).',
      instr: 'Answer **one** of these questions. Write **280–320 words** in an appropriate style.' }
  };
  // official question numbering runs continuously through the paper
  const OFFSET = { '1': 0, '2': 8, '3': 16, '4': 24, '5': 30, '6': 36, '7': 43 };
  // marks per question (paper total = 72)
  const WEIGHT = { '1': 1, '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1 };
  const READING = ['1', '2', '3', '4', '5', '6', '7'];
  const WRITING = ['W1', 'W2'];
  // how answers are stored: 'mc' = option index, 'text' = typed string, 'letter' = 'A'..'G'
  const KIND = { '1': 'mc', '2': 'text', '3': 'text', '4': 'text', '5': 'mc', '6': 'letter', '7': 'letter' };

  const TESTS = (window.TESTS || []).slice();

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  const $ = (sel, el) => (el || document).querySelector(sel);

  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const k in props || {}) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => {
      if (c == null || c === false) return;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return e;
  }

  // American and British spellings are both accepted: both the typed answer and the key are mapped to one form
  const NOT_IZE = new Set(['size', 'sizes', 'sized', 'sizing', 'prize', 'prizes', 'prized', 'seize', 'seizes', 'seized', 'seizing', 'maize', 'capsize', 'capsized', 'capsizes', 'downsize', 'downsized', 'oversize', 'oversized']);
  function ukify(str) {
    return str
      .replace(/\b(\w+?)iz(e|es|ed|ing|er|ers|ation|ations)\b/g, (m, a, b) => (NOT_IZE.has(m) || /s$/.test(a) ? m : a + 'is' + b))
      .replace(/\b(\w+)yz(e|es|ed|ing)\b/g, '$1ys$2')
      .replace(/\b(col|hon|fav|behavi|neighb|lab|hum|flav|harb|rum|vig|endeav|arm|od|rig|clam|glam|vap|val)or(s|ed|ing|able|ite|ites|ful|less)?\b/g, '$1our$2')
      .replace(/\b(cent|theat|fib|lit|calib|somb|spect)er(s|ed)?\b/g, '$1re$2')
      .replace(/\b(defen|offen|pretens)se\b/g, '$1ce')
      .replace(/\b(licen)[cs]e(s|d)?\b/g, '$1ce$2')
      .replace(/\bpractis(e|es|ed|ing)\b/g, 'practic$1')
      .replace(/\bgray\b/g, 'grey')
      .replace(/\bprogramme(s)?\b/g, 'program$1')
      .replace(/\bjudgement(s)?\b/g, 'judgment$1')
      .replace(/\bageing\b/g, 'aging')
      .replace(/\b(fulfil|enrol|instal)l?(ment|ments|ed|ing)?\b/g, (m, a, b) => a + 'l' + (b || ''))
      .replace(/\bskilful(ly)?\b/g, 'skillful$1')
      .replace(/\b(catalog|dialog|analog)ue(s)?\b/g, '$1$2')
      .replace(/\b(travel|label|model|cancel|level|signal|total|fuel|channel|counsel|quarrel|marvel|rival|dial|tunnel|equal|duel)(ed|ing|er|ers)\b/g, '$1l$2')
      .replace(/\bpyjamas\b/g, 'pajamas').replace(/\bjewellery\b/g, 'jewelry').replace(/\bplough(s|ed|ing)?\b/g, 'plow$1')
      .replace(/\bmould(s|ed|ing)?\b/g, 'mold$1').replace(/\bsmoulder(s|ed|ing)?\b/g, 'smolder$1').replace(/\bmoustache\b/g, 'mustache')
      .replace(/\baluminium\b/g, 'aluminum').replace(/\bscept(ic|ics|ical|icism)\b/g, 'skept$1').replace(/\bsulphur\b/g, 'sulfur').replace(/\bcosy\b/g, 'cozy');
  }
  const norm = s => ukify(String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[.,;:!?"“”]/g, '').replace(/\s+/g, ' ').trim());
  const paras = txt => String(txt).split(/\n\n+/).map(s => s.trim()).filter(Boolean);
  const countWords = s => (s.trim().match(/\S+/g) || []).length;
  const letter = i => String.fromCharCode(65 + i);
  // official question number shown to the candidate (data uses 1..N internally)
  const disp = n => n + (OFFSET[S.t.part] || 0);
  // **bold** markup in instructions
  const rich = txt => String(txt).split('**').map((seg, i) => (i % 2 ? h('b', { text: seg }) : seg));
  // Part 4 word count: contractions count as two words
  const wordCount4 = a => String(a).trim().split(/\s+/).filter(Boolean).reduce((n, w) => n + (/['’]/.test(w) ? 2 : 1), 0);

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    const p = n => String(n).padStart(2, '0');
    return hh ? `${hh}:${p(mm)}:${p(ss)}` : `${p(mm)}:${p(ss)}`;
  }
  function fmtDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
      d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  function toast(msg) {
    const t = h('div', { class: 'toast', text: msg });
    document.body.append(t);
    setTimeout(() => t.remove(), 2200);
  }

  /* ------------------------------------------------------------------ *
   * Storage (localStorage; everything lives in the browser)
   * ------------------------------------------------------------------ */
  const KEY = 'c2practice.v1';
  let DB = { progress: {}, history: [] };
  try { DB = Object.assign(DB, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* ignore */ }
  DB.progress = {};   // exam conditions: a test cannot be left and resumed, so nothing in progress is kept
  function saveDB() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ } }
