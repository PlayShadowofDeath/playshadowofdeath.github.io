// =====================================================================
//  Patch book: shows patch notes written in the "Patch Notes.html" format
//  (div.update > h2 + div.date + section > h3 / h4 / ul li with tag spans)
//  with buttons: one per update, tag filters, a search box, sections that
//  open and close, and a section list to jump around.
//  Used by #/updates (public, js/updates.js) and #/patches (owner only,
//  loaded from Supabase).
// =====================================================================
(function () {
  const TAGS = [['new', 'New'], ['changed', 'Changed'], ['fixed', 'Fixed'], ['removed', 'Removed']];
  const tagOf = (el) => {
    const t = el && el.querySelector(':scope > .tag, :scope > b > .tag');
    if (!t) return '';
    if (t.classList.contains('new')) return 'new';
    if (t.classList.contains('changed') || t.classList.contains('change')) return 'changed';
    if (t.classList.contains('fixed') || t.classList.contains('fix')) return 'fixed';
    if (t.classList.contains('removed')) return 'removed';
    return '';
  };

  // Strips anything that could run code; the content is ours, but be safe.
  function clean(doc) {
    doc.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach((n) => n.remove());
    doc.querySelectorAll('*').forEach((n) => [...n.attributes].forEach((a) => {
      if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
    }));
  }

  function render(root, html, opts = {}) {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    clean(doc);
    const updates = [...doc.querySelectorAll('div.update')].map((u, i) => {
      const title = u.querySelector(':scope > h2')?.textContent.trim() || `Update ${i + 1}`;
      const date = u.querySelector(':scope > .date')?.textContent.trim() || '';
      const sections = [...u.querySelectorAll(':scope > section')];
      return { id: 'u' + i, title, date, sections };
    });
    if (!updates.length) { root.innerHTML = '<p class="muted">Nothing here yet.</p>'; return; }

    root.innerHTML = `
      <div class="pb">
        <div class="pb-bar">
          <div class="pb-updates" role="tablist"></div>
          <div class="pb-tools">
            <div class="pb-tags"><button data-tag="" class="on">All</button>${TAGS.map(([k, t]) => `<button data-tag="${k}" class="t-${k}">${t} <i></i></button>`).join('')}</div>
            <input class="pb-search" type="search" placeholder="Search updates…" aria-label="Search updates">
            <button class="pb-fold btn ghost sm" data-open="1">Collapse all</button>
          </div>
        </div>
        <div class="pb-layout">
          <nav class="pb-toc"><b>Sections</b><div></div></nav>
          <div class="pb-main"></div>
        </div>
      </div>`;
    const $ = (s) => root.querySelector(s);
    const state = { update: 0, tag: '', q: '' };

    // Tabs: one per update, plus "All updates" when there are several.
    const tabs = updates.map((u, i) => `<button data-u="${i}"><b>${esc(u.title)}</b>${u.date ? `<span>${esc(u.date)}</span>` : ''}</button>`);
    if (updates.length > 1) tabs.push('<button data-u="all"><b>All updates</b><span>everything, newest first</span></button>');
    $('.pb-updates').innerHTML = tabs.join('');

    function build() {
      const list = state.update === 'all' ? updates : [updates[state.update]];
      const main = $('.pb-main');
      main.innerHTML = '';
      const toc = [];
      list.forEach((u) => {
        if (state.update === 'all') {
          const h = document.createElement('h2');
          h.className = 'pb-uhead';
          h.innerHTML = `${esc(u.title)}${u.date ? ` <span>${esc(u.date)}</span>` : ''}`;
          main.appendChild(h);
        }
        u.sections.forEach((s, si) => {
          const card = s.cloneNode(true);
          const id = `${u.id}-${s.id || 's' + si}`;
          card.id = 'pb-' + id;
          card.classList.add('pb-sec');
          const h3 = card.querySelector(':scope > h3');
          const name = h3 ? (h3.textContent.replace(h3.querySelector('.icon')?.textContent || '', '').trim() || 'Section') : 'Section';
          const body = document.createElement('div');
          body.className = 'pb-body';
          [...card.childNodes].forEach((n) => { if (n !== h3) body.appendChild(n); });
          card.appendChild(body);
          if (h3) {
            h3.insertAdjacentHTML('beforeend', '<span class="pb-count"></span><span class="pb-caret">▾</span>');
            h3.tabIndex = 0;
          }
          // Mark every item with its tag: its own, or the tag of the h4 it sits under.
          let blockTag = '';
          [...body.children].forEach((el) => {
            if (el.tagName === 'H4') { blockTag = tagOf(el); el.dataset.tag = blockTag; return; }
            el.dataset.block = blockTag;
            el.querySelectorAll('li').forEach((li) => { li.dataset.tag = tagOf(li) || blockTag; });
          });
          main.appendChild(card);
          toc.push(`<a href="#" data-go="${card.id}">${esc(name)}</a>`);
        });
      });
      $('.pb-toc div').innerHTML = toc.join('') || '<span class="muted">None</span>';
      apply();
    }

    // Shows only what matches the tag filter and the search; counts per tag.
    function apply() {
      const q = state.q.toLowerCase(), tag = state.tag;
      const counts = { new: 0, changed: 0, fixed: 0, removed: 0 };
      let shown = 0;
      root.querySelectorAll('.pb-sec').forEach((card) => {
        const body = card.querySelector('.pb-body');
        let any = 0;
        const filtering = tag || q;
        const has = (el) => !q || el.textContent.toLowerCase().includes(q);
        // Each h4 starts a block: the h4, then everything up to the next h4. An item shows when its own tag
        // (or its block's, if it has none) matches the filter and it, or its block's heading, matches the search.
        let head = null, headText = false;
        [...body.children].forEach((el) => {
          if (el.tagName === 'H4') {
            head = el;
            headText = !!q && has(el);
            const t = el.dataset.tag;
            // A heading only counts when no list follows it (otherwise its items are counted instead).
            const next = el.nextElementSibling;
            const alone = !next || next.tagName === 'H4' || !next.querySelector('li') && next.tagName !== 'UL';
            if (t && alone && has(el)) counts[t]++;
            el.hidden = filtering && !(alone && (!tag || t === tag) && has(el));
            if (!el.hidden) any++;
            return;
          }
          const lis = el.querySelectorAll('li');
          let vis = 0;
          if (lis.length) {
            lis.forEach((li) => {
              const t = li.dataset.tag, textOk = has(li) || headText;
              if (t && textOk && !li.parentElement.closest('li')) counts[t]++;
              li.hidden = filtering && !((!tag || t === tag) && textOk);
              if (!li.hidden && !li.parentElement.closest('li')) vis++;
            });
            el.hidden = filtering && !vis;
          } else {
            el.hidden = filtering && !((!tag || el.dataset.block === tag) && (has(el) || headText) && (q || el.dataset.block));
            if (!el.hidden) vis++;
          }
          if (vis) { any++; if (head) head.hidden = false; }
        });
        card.hidden = filtering && !any && !(q && card.querySelector('h3')?.textContent.toLowerCase().includes(q));
        if (card.hidden) [...body.children].forEach((el) => { el.hidden = true; });
        else if (q && !any) // only the section's title matched: show the whole section
          [...body.children].forEach((el) => { el.hidden = false; el.querySelectorAll('li').forEach((li) => { li.hidden = false; }); });
        const n = body.querySelectorAll('li:not([hidden])').length;
        card.querySelector('.pb-count') && (card.querySelector('.pb-count').textContent = n ? n : '');
        if (!card.hidden) shown++;
        const link = root.querySelector(`[data-go="${card.id}"]`);
        if (link) link.hidden = card.hidden;
      });
      TAGS.forEach(([k]) => { const b = root.querySelector(`.pb-tags [data-tag="${k}"] i`); if (b) b.textContent = counts[k]; });
      let none = root.querySelector('.pb-none');
      if (!shown) {
        if (!none) { none = document.createElement('div'); none.className = 'pb-none panel pad center muted'; root.querySelector('.pb-main').appendChild(none); }
        none.textContent = 'Nothing matches. Try another filter or search.';
      } else if (none) none.remove();
    }

    function selectUpdate(u) {
      state.update = u === 'all' ? 'all' : +u;
      root.querySelectorAll('.pb-updates button').forEach((b) => b.classList.toggle('on', b.dataset.u === String(u)));
      build();
    }

    root.querySelector('.pb-updates').onclick = (e) => {
      const b = e.target.closest('button');
      if (b) selectUpdate(b.dataset.u);
    };
    root.querySelector('.pb-tags').onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      state.tag = b.dataset.tag;
      root.querySelectorAll('.pb-tags button').forEach((x) => x.classList.toggle('on', x === b));
      apply();
    };
    let t;
    $('.pb-search').oninput = (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value.trim(); apply(); }, 120); };
    $('.pb-fold').onclick = (e) => {
      const open = e.target.dataset.open === '1';
      root.querySelectorAll('.pb-sec').forEach((c) => c.classList.toggle('shut', open));
      e.target.dataset.open = open ? '0' : '1';
      e.target.textContent = open ? 'Expand all' : 'Collapse all';
    };
    const toggle = (h3) => h3.closest('.pb-sec').classList.toggle('shut');
    $('.pb-main').addEventListener('click', (e) => { const h = e.target.closest('.pb-sec > h3'); if (h) toggle(h); });
    $('.pb-main').addEventListener('keydown', (e) => { const h = e.target.closest('.pb-sec > h3'); if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(h); } });
    $('.pb-toc').addEventListener('click', (e) => {
      const a = e.target.closest('a[data-go]');
      if (!a) return;
      e.preventDefault();
      const card = document.getElementById(a.dataset.go);
      card.classList.remove('shut');
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    // Links inside the notes like href="#money" jump to that section instead of changing the page.
    $('.pb-main').addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').startsWith('#/')) return;
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const card = root.querySelector(`.pb-sec[id$="-${CSS.escape(id)}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    selectUpdate(opts.start ?? 0);
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }

  window.PatchBook = { render };
})();
