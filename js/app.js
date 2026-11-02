// Shadow of Death website: pages + navigation.
(async () => {
  const cfg = window.SOD_CONFIG;
  const { esc, fmt, ago, date, full, badge, avatar, userLink, toast, errText } = window.U;
  const view = document.getElementById('view');
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.min.js';

  // ---------- pick the backend ----------
  const isLive = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  if (isLive) {
    try {
      await new Promise((ok, fail) => {
        const s = document.createElement('script');
        s.src = SUPABASE_JS; s.onload = ok; s.onerror = fail;
        document.head.appendChild(s);
      });
    } catch {
      view.innerHTML = `<div class="panel pad error">Could not load the Supabase library. Check your internet connection and refresh.</div>`;
      return;
    }
  }
  const api = window.api = isLive ? window.makeSupabaseBackend(cfg) : window.makeDemoBackend();

  // ---------- shared state + tiny event bus ----------
  const S = window.S = { me: null, online: new Set(), friends: [], requests: { incoming: [], outgoing: [] }, unread: {} };
  const listeners = {};
  const bus = window.bus = {
    on: (ev, fn) => (listeners[ev] = listeners[ev] || []).push(fn),
    emit: (ev, data) => (listeners[ev] || []).forEach((fn) => fn(data)),
  };

  const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
  let afterLogin = '#/';
  const needLogin = () => { afterLogin = location.hash || '#/'; go('#/login'); return true; };
  const loading = () => { view.innerHTML = '<div class="loading"><span class="spinner"></span></div>'; };
  const setTitle = (t) => { document.title = t ? `${t} | ${cfg.siteName}` : `${cfg.siteName} | Community`; };
  const $ = (sel, root = view) => root.querySelector(sel);
  const $$ = (sel, root = view) => [...root.querySelectorAll(sel)];
  const isStaff = () => S.me && ['moderator', 'admin', 'owner'].includes(S.me.role);
  const canPost = () => S.me && S.me.status === 'active';

  async function busy(btn, fn) {
    const label = btn?.innerHTML;
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner sm"></span>'; }
    try { return await fn(); }
    catch (e) { toast(errText(e), 'error'); }
    finally { if (btn) { btn.disabled = false; btn.innerHTML = label; } }
  }

  function pager(total, size, current, base) {
    const pages = Math.ceil(total / size);
    if (pages <= 1) return '';
    let h = '<nav class="pager">';
    for (let i = 0; i < pages; i++) {
      if (pages > 9 && i > 1 && i < pages - 2 && Math.abs(i - current) > 2) { if (!h.endsWith('…</span>')) h += '<span>…</span>'; continue; }
      h += `<a href="${base}/${i + 1}" class="${i === current ? 'on' : ''}">${i + 1}</a>`;
    }
    return h + '</nav>';
  }

  // Text box with a small formatting toolbar and a preview tab.
  function editor(id, placeholder = '', value = '', rows = 6) {
    return `<div class="editor" data-editor="${id}">
      <div class="ed-bar">
        <button type="button" data-wrap="**" title="Bold"><b>B</b></button>
        <button type="button" data-wrap="*" title="Italic"><i>I</i></button>
        <button type="button" data-wrap="__" title="Underline"><u>U</u></button>
        <button type="button" data-quote title="Quote">❝</button>
        <button type="button" data-wrap="\`" title="Code">&lt;/&gt;</button>
        <span class="grow"></span>
        <button type="button" data-preview class="ed-tab">Preview</button>
      </div>
      <textarea id="${id}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>
      <div class="ed-preview post-body" hidden></div>
    </div>`;
  }
  function wireEditors(root = view) {
    $$('[data-editor]', root).forEach((ed) => {
      const ta = $('textarea', ed), pv = $('.ed-preview', ed);
      $$('[data-wrap]', ed).forEach((b) => b.onclick = () => {
        const w = b.dataset.wrap, s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || 'text';
        ta.setRangeText(w + sel + w, s, e, 'select'); ta.focus();
      });
      $('[data-quote]', ed).onclick = () => {
        const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e) || 'quote';
        ta.setRangeText(sel.split('\n').map((l) => '> ' + l).join('\n') + '\n', s, e, 'end'); ta.focus();
      };
      $('[data-preview]', ed).onclick = (ev) => {
        const on = pv.hidden;
        pv.hidden = !on; ta.hidden = on; ev.target.classList.toggle('on', on);
        pv.innerHTML = fmt(ta.value) || '<span class="muted">Nothing to preview.</span>';
      };
    });
  }

  // ---------- header ----------
  function renderHeader() {
    const path = location.hash.slice(1) || '/';
    const nav = [['#/', 'Home', /^\/$/], ['#/forums', 'Forums', /^\/(forums|forum|thread|new)/], ['#/community', 'Community', /^\/community/],
      ['#/members', 'Members', /^\/members/]];
    document.getElementById('nav').innerHTML = nav.map(([h, t, re]) => `<a href="${h}" class="${re.test(path) ? 'on' : ''}">${t}</a>`).join('')
      + `<a href="${esc(cfg.downloadUrl)}" target="_blank" rel="noopener" class="play">Play now</a>`;
    const box = document.getElementById('userbox');
    if (!S.me) {
      box.innerHTML = `<a href="#/login" class="btn ghost sm">Log in</a><a href="#/register" class="btn sm">Register</a>`;
      return;
    }
    const unread = Object.values(S.unread).reduce((a, b) => a + b, 0);
    const reqs = S.requests.incoming.length;
    box.innerHTML = `
      <a href="#/friends" class="icon-btn" title="Friends">👥${reqs ? `<b class="count">${reqs}</b>` : ''}</a>
      <a href="#/inbox" class="icon-btn" title="Messages">✉️${unread ? `<b class="count">${unread}</b>` : ''}</a>
      <div class="menu">
        <button class="me-btn" id="me-btn">${avatar(S.me, 30)}<span>${esc(S.me.username)}</span>▾</button>
        <div class="menu-list" id="me-menu" hidden>
          <a href="#/u/${encodeURIComponent(S.me.username)}">My profile</a>
          <a href="#/friends">Friends</a>
          <a href="#/inbox">Messages</a>
          <a href="#/settings">Settings</a>
          <hr><button id="logout">Log out</button>
        </div>
      </div>`;
    const menu = document.getElementById('me-menu');
    document.getElementById('me-btn').onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; };
    document.getElementById('logout').onclick = async () => { await api.signOut(); toast('Logged out.'); go('#/'); };
  }
  document.addEventListener('click', () => { const m = document.getElementById('me-menu'); if (m) m.hidden = true; });
  bus.on('counts', renderHeader);

  // ---------- pages ----------
  const views = {};

  const onlineHtml = (profiles) => profiles.map((p) =>
    `<a href="#/u/${encodeURIComponent(p.username)}" title="${esc(p.username)}">${avatar(p, 34, true)}</a>`).join('')
    || '<span class="muted">Nobody right now.</span>';
  // Keep "who's online" on the home page up to date.
  bus.on('presence', async () => {
    $$('[data-dot]', document).forEach((d) => d.classList.toggle('on', S.online.has(d.dataset.dot)));
    $$('[data-online-count]').forEach((el) => { el.textContent = S.online.size; });
    const box = document.getElementById('online-list');
    if (box) box.innerHTML = onlineHtml(await api.profilesByIds([...S.online].slice(0, 40)));
  });

  views.home = async () => {
    setTitle('');
    const [stats, cats, recent, feed] = await Promise.all([api.stats(), api.forumIndex(), api.recentThreads(7), api.feed({ size: 3 })]);
    const news = cats.find((c) => c.name === 'Announcements');
    const newsThreads = news ? await api.recentThreads(3, news.id) : [];
    const firstPosts = await Promise.all(newsThreads.map((t) => api.posts(t.id, 0, 1).then((r) => r.rows[0])));
    const onlineProfiles = await api.profilesByIds([...S.online].slice(0, 40));
    view.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <h1>Shadow of Death</h1>
          <p>A 718 RuneScape private server. Bosses, raids, custom items and a community that plays together.</p>
          <div class="hero-btns">
            <a class="btn lg" href="${esc(cfg.downloadUrl)}" target="_blank" rel="noopener">⚔ Play now</a>
            ${S.me ? '<a class="btn lg ghost" href="#/forums">Visit the forums</a>' : '<a class="btn lg ghost" href="#/register">Join the community</a>'}
            ${cfg.discordUrl ? `<a class="btn lg ghost" href="${esc(cfg.discordUrl)}" target="_blank" rel="noopener">Discord</a>` : ''}
          </div>
          <div class="hero-stats">
            <div><b>${stats.members}</b><span>Members</span></div>
            <div><b>${stats.threads}</b><span>Threads</span></div>
            <div><b>${stats.posts}</b><span>Posts</span></div>
            <div><b class="green" data-online-count>${S.online.size}</b><span>Online now</span></div>
          </div>
        </div>
      </section>
      <div class="cols">
        <div class="main-col">
          <div class="panel">
            <div class="panel-head"><h2>Latest news</h2>${news ? `<a href="#/forum/${news.id}">All news →</a>` : ''}</div>
            ${newsThreads.length ? newsThreads.map((t, i) => `
              <article class="news">
                <a class="news-title" href="#/thread/${t.id}">${esc(t.title)}</a>
                <div class="meta">${userLink(t.author)} ${badge(t.author)} · ${date(t.created_at)} · ${t.reply_count} replies</div>
                <div class="news-body post-body">${fmt((firstPosts[i]?.body || '').slice(0, 420))}${(firstPosts[i]?.body || '').length > 420 ? '…' : ''}</div>
                <a href="#/thread/${t.id}" class="more">Read more →</a>
              </article>`).join('') : '<p class="pad muted">No news yet.</p>'}
          </div>
          <div class="panel">
            <div class="panel-head"><h2>Recent forum activity</h2><a href="#/forums">Forums →</a></div>
            <table class="tbl">${recent.map((t) => `
              <tr><td class="ic">${t.locked ? '🔒' : t.pinned ? '📌' : '💬'}</td>
                <td><a href="#/thread/${t.id}" class="t-title">${esc(t.title)}</a>
                  <div class="meta">in <a href="#/forum/${t.category?.id}">${esc(t.category?.name || '')}</a> · by ${userLink(t.author)}</div></td>
                <td class="right meta nowrap">${ago(t.last_post_at)}<br>by ${userLink(t.last_poster)}</td></tr>`).join('') || '<tr><td class="pad muted">No threads yet.</td></tr>'}
            </table>
          </div>
        </div>
        <aside class="side-col">
          <div class="panel">
            <div class="panel-head"><h3>Who's online</h3><span class="muted" data-online-count>${S.online.size}</span></div>
            <div class="pad online-list" id="online-list">${onlineHtml(onlineProfiles)}</div>
          </div>
          ${stats.newest ? `<div class="panel"><div class="panel-head"><h3>Newest member</h3></div>
            <div class="pad row">${avatar(stats.newest, 40)}<div>${userLink(stats.newest)}<div class="meta">joined ${ago(stats.newest.created_at)}</div></div></div></div>` : ''}
          <div class="panel">
            <div class="panel-head"><h3>Community posts</h3><a href="#/community">All →</a></div>
            ${feed.map((p) => `<div class="mini-post">${avatar(p.author, 28)}<div><div>${userLink(p.author)} <span class="meta">${ago(p.created_at)}</span></div>
              <div class="mini-body">${fmt(p.body.slice(0, 140))}</div></div></div>`).join('') || '<p class="pad muted">No posts yet.</p>'}
          </div>
        </aside>
      </div>`;
  };

  views.forums = async () => {
    setTitle('Forums');
    const cats = await api.forumIndex();
    const sections = [...new Set(cats.map((c) => c.section))];
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Forums</div>
      ${sections.map((s) => `
        <div class="panel forum-section">
          <div class="section-head">${esc(s)}</div>
          <table class="tbl forum-tbl">
            <thead><tr><th colspan="2">Forum</th><th class="num">Threads</th><th class="num">Posts</th><th>Last post</th></tr></thead>
            ${cats.filter((c) => c.section === s).map((c) => `
              <tr>
                <td class="ic big">${esc(c.icon)}</td>
                <td><a href="#/forum/${c.id}" class="f-name">${esc(c.name)}</a>${c.staff_only ? ' <span class="tag">Staff posts</span>' : ''}
                  <div class="meta">${esc(c.description)}</div></td>
                <td class="num">${c.thread_count}</td><td class="num">${c.post_count}</td>
                <td class="last">${c.last_thread_id ? `<a href="#/thread/${c.last_thread_id}">${esc(c.last_thread_title)}</a>
                  <div class="meta">${ago(c.last_post_at)} by ${esc(c.last_post_username || '')}</div>` : '<span class="muted">No posts yet</span>'}</td>
              </tr>`).join('')}
          </table>
        </div>`).join('')}
      <p class="meta center">Tip: format posts with **bold**, *italic*, __underline__ and "> " for quotes.</p>`;
  };

  views.forum = async (id, pageNo) => {
    const p = Math.max(0, (+pageNo || 1) - 1);
    const [cat, list] = await Promise.all([api.category(+id), api.threads(+id, p)]);
    if (!cat) return notFound();
    setTitle(cat.name);
    const canStart = canPost() && (!cat.staff_only || isStaff());
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › <a href="#/forums">Forums</a> › ${esc(cat.name)}</div>
      <div class="page-head">
        <div><h1>${esc(cat.icon)} ${esc(cat.name)}</h1><p class="muted">${esc(cat.description)}</p></div>
        ${canStart ? `<a class="btn" href="#/new/${cat.id}">+ New thread</a>` : !S.me ? '<a class="btn ghost" href="#/login">Log in to post</a>' : ''}
      </div>
      <div class="panel">
        <table class="tbl thread-tbl">
          <thead><tr><th colspan="2">Thread</th><th class="num">Replies</th><th class="num">Views</th><th>Last post</th></tr></thead>
          ${list.rows.map((t) => `
            <tr class="${t.pinned ? 'pinned' : ''}">
              <td class="ic">${t.locked ? '🔒' : t.pinned ? '📌' : '💬'}</td>
              <td>${t.pinned ? '<span class="tag gold">Pinned</span> ' : ''}<a href="#/thread/${t.id}" class="t-title">${esc(t.title)}</a>
                <div class="meta">by ${userLink(t.author)} · ${ago(t.created_at)}</div></td>
              <td class="num">${t.reply_count}</td><td class="num">${t.view_count}</td>
              <td class="last">${ago(t.last_post_at)}<div class="meta">by ${userLink(t.last_poster)}</div></td>
            </tr>`).join('') || '<tr><td colspan="5" class="pad center muted">No threads yet. Be the first!</td></tr>'}
        </table>
      </div>
      ${pager(list.total, 25, p, `#/forum/${cat.id}`)}`;
  };

  views.newThread = async (catId) => {
    if (!S.me) return needLogin();
    const cat = await api.category(+catId);
    if (!cat) return notFound();
    setTitle('New thread');
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › <a href="#/forums">Forums</a> › <a href="#/forum/${cat.id}">${esc(cat.name)}</a> › New thread</div>
      <div class="panel pad narrow">
        <h1>Start a new thread</h1>
        <form id="f" class="form">
          <label>Title<input id="title" maxlength="100" required placeholder="What's it about?"></label>
          <label>Message</label>${editor('body', 'Write your post…', '', 10)}
          <div class="row end"><a class="btn ghost" href="#/forum/${cat.id}">Cancel</a><button class="btn">Post thread</button></div>
        </form>
      </div>`;
    wireEditors();
    $('#f').onsubmit = (e) => {
      e.preventDefault();
      const title = $('#title').value.trim(), body = $('#body').value.trim();
      if (title.length < 3) return toast('The title needs at least 3 characters.', 'error');
      if (!body) return toast('Write something first.', 'error');
      busy(e.submitter, async () => { const id = await api.createThread(cat.id, title, body); go(`#/thread/${id}`); });
    };
  };

  views.thread = async (id, pageNo) => {
    const size = 15;
    const t = await api.thread(+id);
    if (!t) return notFound();
    let p = pageNo === 'last' ? Math.max(0, Math.ceil((t.reply_count + 1) / size) - 1) : Math.max(0, (+pageNo || 1) - 1);
    const posts = await api.posts(t.id, p, size);
    const counts = await api.postCounts(posts.rows.map((x) => x.author_id));
    setTitle(t.title);
    const mine = (x) => S.me && (x.author_id === S.me.id || isStaff());
    const canReply = canPost() && (!t.locked || isStaff());
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › <a href="#/forums">Forums</a> › <a href="#/forum/${t.category.id}">${esc(t.category.name)}</a> › ${esc(t.title)}</div>
      <div class="page-head">
        <div><h1>${t.pinned ? '📌 ' : ''}${t.locked ? '🔒 ' : ''}${esc(t.title)}</h1>
          <p class="meta">Started by ${userLink(t.author)} · ${full(t.created_at)} · ${t.view_count} views</p></div>
        ${isStaff() ? `<div class="row staff-tools">
          <button class="btn ghost sm" id="pin">${t.pinned ? 'Unpin' : 'Pin'}</button>
          <button class="btn ghost sm" id="lock">${t.locked ? 'Unlock' : 'Lock'}</button>
          <button class="btn danger sm" id="del-thread">Delete thread</button></div>` : ''}
      </div>
      ${pager(posts.total, size, p, `#/thread/${t.id}`)}
      ${posts.rows.map((x, i) => `
        <article class="panel post" id="post-${x.id}">
          <aside class="post-author">
            ${avatar(x.author, 72, x.author ? S.online.has(x.author.id) : undefined)}
            <div>${userLink(x.author)}</div>${badge(x.author)}
            <dl><dt>Posts</dt><dd>${counts[x.author_id] || 0}</dd><dt>Joined</dt><dd>${x.author ? date(x.author.created_at) : ''}</dd></dl>
          </aside>
          <div class="post-main">
            <div class="post-top meta"><span>${full(x.created_at)}${x.edited_at ? ` · <i>edited ${ago(x.edited_at)}</i>` : ''}</span><a href="#/thread/${t.id}/${p + 1}" class="muted">#${p * size + i + 1}</a></div>
            <div class="post-body" data-body>${fmt(x.body)}</div>
            ${x.author?.signature ? `<div class="signature">${fmt(x.author.signature)}</div>` : ''}
            <div class="post-actions">
              ${canReply ? `<button class="link" data-quote="${x.id}">❝ Quote</button>` : ''}
              ${mine(x) ? `<button class="link" data-edit="${x.id}">✎ Edit</button>` : ''}
              ${mine(x) && !(p === 0 && i === 0) ? `<button class="link danger" data-del="${x.id}">🗑 Delete</button>` : ''}
            </div>
          </div>
        </article>`).join('')}
      ${pager(posts.total, size, p, `#/thread/${t.id}`)}
      ${canReply ? `<div class="panel pad" id="reply-box"><h3>Reply</h3>
          <form id="reply" class="form">${editor('reply-body', 'Write a reply…')}<div class="row end"><button class="btn">Post reply</button></div></form></div>`
        : `<div class="panel pad center muted">${t.locked ? '🔒 This thread is locked.' : !S.me ? '<a href="#/login">Log in</a> or <a href="#/register">register</a> to reply.' : 'Finish your sign-up to reply.'}</div>`}`;
    wireEditors();
    const byId = Object.fromEntries(posts.rows.map((x) => [x.id, x]));
    $$('[data-quote]').forEach((b) => b.onclick = () => {
      const x = byId[b.dataset.quote], ta = $('#reply-body');
      ta.value += `> **${x.author?.username || 'Someone'} wrote:**\n${x.body.split('\n').filter((l) => !l.startsWith('> ')).map((l) => '> ' + l).join('\n')}\n\n`;
      ta.focus(); ta.scrollIntoView({ block: 'center' });
    });
    $$('[data-edit]').forEach((b) => b.onclick = () => {
      const x = byId[b.dataset.edit], bodyEl = $(`#post-${x.id} [data-body]`);
      bodyEl.innerHTML = `<form class="form">${editor('edit-' + x.id, '', x.body)}<div class="row end">
        <button type="button" class="btn ghost sm" data-cancel>Cancel</button><button class="btn sm">Save</button></div></form>`;
      wireEditors(bodyEl);
      $('[data-cancel]', bodyEl).onclick = () => route();
      $('form', bodyEl).onsubmit = (e) => { e.preventDefault(); busy(e.submitter, async () => { await api.editPost(x.id, $('textarea', bodyEl).value.trim()); route(); }); };
    });
    $$('[data-del]').forEach((b) => b.onclick = () => {
      if (confirm('Delete this post?')) busy(b, async () => { await api.deletePost(+b.dataset.del); toast('Post deleted.'); route(); });
    });
    if ($('#reply')) $('#reply').onsubmit = (e) => {
      e.preventDefault();
      const body = $('#reply-body').value.trim();
      if (!body) return toast('Write something first.', 'error');
      busy(e.submitter, async () => { const post = await api.reply(t.id, body); go(`#/thread/${t.id}/last`); setTimeout(() => document.getElementById('post-' + post.id)?.scrollIntoView(), 300); });
    };
    if ($('#pin')) {
      $('#pin').onclick = (e) => busy(e.target, async () => { await api.setThread(t.id, { pinned: !t.pinned }); route(); });
      $('#lock').onclick = (e) => busy(e.target, async () => { await api.setThread(t.id, { locked: !t.locked }); route(); });
      $('#del-thread').onclick = (e) => { if (confirm('Delete this whole thread and every reply?')) busy(e.target, async () => { await api.deleteThread(t.id); toast('Thread deleted.'); go(`#/forum/${t.category.id}`); }); };
    }
  };

  // ---------- public posts (feed + walls) ----------
  function feedCard(p) {
    const own = S.me && (p.author_id === S.me.id || p.wall_owner_id === S.me.id || isStaff());
    const onWall = p.wall_owner_id !== p.author_id;
    return `<article class="panel feed-post" data-post="${p.id}">
      <div class="fp-head">${avatar(p.author, 44, p.author ? S.online.has(p.author.id) : undefined)}
        <div class="grow">${userLink(p.author)} ${badge(p.author)}${onWall ? ` <span class="muted">▸</span> ${userLink(p.wall_owner)}` : ''}
          <div class="meta" title="${full(p.created_at)}">${ago(p.created_at)}</div></div>
        ${own ? `<button class="link danger" data-delpost="${p.id}" title="Delete">✕</button>` : ''}</div>
      <div class="post-body fp-body">${fmt(p.body)}</div>
      <div class="fp-actions">
        <button class="link ${p.liked_by_me ? 'liked' : ''}" data-like="${p.id}" ${S.me ? '' : 'disabled'}>♥ ${p.like_count || ''} Like</button>
        <button class="link" data-showc="${p.id}">💬 ${p.comment_count || ''} Comment</button>
      </div>
      <div class="fp-comments" ${p.comments.length ? '' : 'hidden'}>
        ${p.comments.map((c) => `<div class="comment">${avatar(c.author, 28)}<div class="c-bubble">${userLink(c.author)} ${fmt(c.body)}
          <div class="meta">${ago(c.created_at)}${S.me && (c.author_id === S.me.id || p.wall_owner_id === S.me.id || isStaff()) ? ` · <button class="link danger" data-delc="${c.id}">delete</button>` : ''}</div></div></div>`).join('')}
        ${canPost() ? `<form class="c-form" data-cform="${p.id}">${avatar(S.me, 28)}<input placeholder="Write a comment…" maxlength="1000"></form>` : ''}
      </div>
    </article>`;
  }
  function wireFeed(root, rerender) {
    $$('[data-like]', root).forEach((b) => b.onclick = () => busy(null, async () => {
      await api.like(+b.dataset.like, !b.classList.contains('liked')); rerender();
    }));
    $$('[data-showc]', root).forEach((b) => b.onclick = () => {
      const box = $(`[data-post="${b.dataset.showc}"] .fp-comments`, root);
      box.hidden = false; $('input', box)?.focus();
    });
    $$('[data-cform]', root).forEach((f) => f.onsubmit = (e) => {
      e.preventDefault();
      const v = $('input', f).value.trim();
      if (v) busy(null, async () => { await api.comment(+f.dataset.cform, v); rerender(); });
    });
    $$('[data-delpost]', root).forEach((b) => b.onclick = () => {
      if (confirm('Delete this post?')) busy(null, async () => { await api.deleteWallPost(+b.dataset.delpost); rerender(); });
    });
    $$('[data-delc]', root).forEach((b) => b.onclick = () => busy(null, async () => { await api.deleteComment(+b.dataset.delc); rerender(); }));
  }
  function composer(placeholder) {
    return canPost() ? `<form class="panel pad composer" id="composer">
      <div class="row top">${avatar(S.me, 44)}<textarea id="wall-text" rows="2" maxlength="2000" placeholder="${esc(placeholder)}"></textarea></div>
      <div class="row end"><span class="meta grow">Public: anyone can see this.</span><button class="btn sm">Post</button></div></form>` : '';
  }

  views.community = async () => {
    setTitle('Community');
    let pageNo = 0;
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Community</div>
      <div class="cols">
        <div class="main-col">
          <div class="page-head"><div><h1>Community</h1><p class="muted">Public posts from everyone. Share drops, screenshots and news.</p></div></div>
          ${composer(S.me ? `What's happening, ${S.me.username}?` : '') || (!S.me ? '<div class="panel pad center"><a href="#/login">Log in</a> to post.</div>' : '')}
          <div id="feed"></div>
          <div class="center"><button class="btn ghost" id="more" hidden>Load more</button></div>
        </div>
        <aside class="side-col">
          <div class="panel"><div class="panel-head"><h3>Your friends</h3><a href="#/friends">Manage →</a></div>
            <div class="pad">${S.me ? (S.friends.map((f) => `<div class="row friend-row">${avatar(f.profile, 30, S.online.has(f.profile.id))}${userLink(f.profile)}</div>`).join('') || '<span class="muted">No friends yet. Find people on the <a href="#/members">Members</a> page.</span>') : '<span class="muted">Log in to see your friends.</span>'}</div></div>
        </aside>
      </div>`;
    const feedEl = $('#feed');
    const load = async (reset) => {
      if (reset) pageNo = 0;
      const rows = [];
      for (let i = 0; i <= pageNo; i++) rows.push(...await api.feed({ page: i }));
      feedEl.innerHTML = rows.map(feedCard).join('') || '<div class="panel pad center muted">No posts yet.</div>';
      $('#more').hidden = rows.length < (pageNo + 1) * 15;
      wireFeed(feedEl, () => load());
    };
    $('#more').onclick = () => { pageNo++; load(); };
    if ($('#composer')) $('#composer').onsubmit = (e) => {
      e.preventDefault();
      const v = $('#wall-text').value.trim();
      if (v) busy(e.submitter, async () => { await api.createWallPost(v); $('#wall-text').value = ''; load(true); });
    };
    await load(true);
  };

  views.profile = async (name) => {
    const p = await api.profile(name);
    if (!p) return notFound('No member with that name.');
    setTitle(p.username);
    const self = S.me?.id === p.id;
    const rel = S.me && !self ? await api.relation(p.id) : { state: 'self' };
    const [threads, counts] = await Promise.all([api.threadsBy(p.id, 8), api.postCounts([p.id])]);
    const onlineNow = S.online.has(p.id);
    let friendBtn = '';
    if (S.me && !self) friendBtn = {
      none: `<button class="btn" id="add-friend">+ Add friend</button>`,
      sent: `<button class="btn ghost" id="cancel-req">Request sent ✕</button>`,
      received: `<button class="btn" id="accept-req">Accept friend request</button>`,
      friends: `<button class="btn" id="msg">💬 Message</button><button class="btn ghost" id="unfriend">Friends ✓</button>`,
    }[rel.state];
    const canWall = canPost() && (self || rel.state === 'friends');
    view.innerHTML = `
      <div class="profile-cover" style="--c:${esc(p.avatar_color)}"></div>
      <div class="panel profile-head">
        ${avatar(p, 120, onlineNow)}
        <div class="grow">
          <h1>${esc(p.username)} ${badge(p)}${p.status === 'banned' ? ' <span class="rank banned">Banned</span>' : ''}</h1>
          <div class="meta">${onlineNow ? '<span class="green">● Online now</span>' : `Last seen ${ago(p.last_seen)}`} · Joined ${date(p.created_at)} · ${counts[p.id] || 0} forum posts
            ${p.game_username ? ` · In-game: <b>${esc(p.game_username)}</b>` : ''}</div>
          ${p.bio ? `<p class="bio">${fmt(p.bio)}</p>` : ''}
        </div>
        <div class="row">${friendBtn}${self ? '<a class="btn ghost" href="#/settings">Edit profile</a>' : ''}</div>
      </div>
      ${isStaff() && !self && p.role === 'member' || S.me?.role === 'owner' && !self ? `<div class="panel pad row staff-tools">
        <b>Staff:</b>
        ${p.role === 'member' ? `<button class="btn ghost sm" id="ban">${p.status === 'banned' ? 'Unban' : 'Ban'}</button>` : ''}
        ${S.me.role === 'owner' ? `<label class="row">Rank <select id="role">${['member', 'moderator', 'admin', 'owner'].map((r) => `<option ${r === p.role ? 'selected' : ''}>${r}</option>`).join('')}</select></label>` : ''}
      </div>` : ''}
      <div class="cols">
        <div class="main-col">
          <h2 class="sub">Wall</h2>
          ${canWall ? composer(self ? 'Post something on your wall…' : `Write something to ${p.username}…`) : ''}
          <div id="feed"></div>
        </div>
        <aside class="side-col">
          <div class="panel"><div class="panel-head"><h3>Recent threads</h3></div>
            ${threads.map((t) => `<div class="mini-post"><div><a href="#/thread/${t.id}">${esc(t.title)}</a><div class="meta">${esc(t.category?.name || '')} · ${ago(t.created_at)}</div></div></div>`).join('') || '<p class="pad muted">No threads yet.</p>'}
          </div>
        </aside>
      </div>`;
    const feedEl = $('#feed');
    const load = async () => {
      const rows = await api.feed({ wallOwner: p.id, size: 30 });
      feedEl.innerHTML = rows.map(feedCard).join('') || '<div class="panel pad center muted">Nothing on this wall yet.</div>';
      wireFeed(feedEl, load);
    };
    if ($('#composer')) $('#composer').onsubmit = (e) => {
      e.preventDefault();
      const v = $('#wall-text').value.trim();
      if (v) busy(e.submitter, async () => { await api.createWallPost(v, p.id); $('#wall-text').value = ''; load(); });
    };
    const after = async (msg) => { toast(msg); await refreshSocial(); route(); };
    if ($('#add-friend')) $('#add-friend').onclick = (e) => busy(e.target, async () => { await api.sendRequest(p.id); after('Friend request sent.'); });
    if ($('#cancel-req')) $('#cancel-req').onclick = (e) => busy(e.target, async () => { await api.removeRequest(rel.id); after('Request cancelled.'); });
    if ($('#accept-req')) $('#accept-req').onclick = (e) => busy(e.target, async () => { await api.acceptRequest(rel.id); after(`You and ${p.username} are now friends!`); });
    if ($('#unfriend')) $('#unfriend').onclick = (e) => { if (confirm(`Remove ${p.username} from your friends?`)) busy(e.target, async () => { await api.removeRequest(rel.id); after('Friend removed.'); }); };
    if ($('#msg')) $('#msg').onclick = () => window.Messenger.open(p);
    if ($('#ban')) $('#ban').onclick = (e) => busy(e.target, async () => { await api.setBanned(p.id, p.status !== 'banned'); route(); });
    if ($('#role')) $('#role').onchange = (e) => busy(null, async () => { await api.setRole(p.id, e.target.value); toast('Rank changed.'); route(); });
    await load();
  };

  views.members = async () => {
    setTitle('Members');
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Members</div>
      <div class="page-head"><div><h1>Members</h1><p class="muted">Find players and add them as friends.</p></div>
        <input id="search" class="search" placeholder="Search by name…"></div>
      <div id="list" class="member-grid"></div><div id="pg"></div>`;
    let pageNo = 0, timer;
    const load = async () => {
      const { rows, total } = await api.members({ search: $('#search').value.trim(), page: pageNo });
      $('#list').innerHTML = rows.map((p) => `
        <a class="panel member-card" href="#/u/${encodeURIComponent(p.username)}">
          ${avatar(p, 56, S.online.has(p.id))}
          <div><b class="user ${window.U.rank(p).cls}">${esc(p.username)}</b><div>${badge(p) || '<span class="meta">Member</span>'}</div>
          <div class="meta">Joined ${date(p.created_at)}</div></div></a>`).join('') || '<p class="muted">Nobody found.</p>';
      const pages = Math.ceil(total / 30);
      $('#pg').innerHTML = pages > 1 ? `<nav class="pager">${Array.from({ length: pages }, (_, i) => `<a href="javascript:void 0" data-pg="${i}" class="${i === pageNo ? 'on' : ''}">${i + 1}</a>`).join('')}</nav>` : '';
      $$('[data-pg]').forEach((a) => a.onclick = () => { pageNo = +a.dataset.pg; load(); });
    };
    $('#search').oninput = () => { clearTimeout(timer); timer = setTimeout(() => { pageNo = 0; load(); }, 250); };
    await load();
  };

  views.friends = async () => {
    if (!S.me) return needLogin();
    setTitle('Friends');
    await refreshSocial();
    const { incoming, outgoing } = S.requests;
    const sorted = [...S.friends].sort((a, b) => S.online.has(b.profile.id) - S.online.has(a.profile.id));
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Friends</div>
      <div class="page-head"><div><h1>Friends</h1><p class="muted">Friends can message you instantly from the chat bar and post on your wall.</p></div>
        <a class="btn ghost" href="#/members">Find people</a></div>
      ${incoming.length ? `<div class="panel"><div class="panel-head"><h2>Friend requests <span class="count inline">${incoming.length}</span></h2></div>
        ${incoming.map((r) => `<div class="list-row">${avatar(r.from, 44)}<div class="grow">${userLink(r.from)}<div class="meta">${ago(r.created_at)}</div></div>
          <button class="btn sm" data-accept="${r.id}">Accept</button><button class="btn ghost sm" data-decline="${r.id}">Decline</button></div>`).join('')}</div>` : ''}
      <div class="panel"><div class="panel-head"><h2>Your friends</h2><span class="muted">${S.friends.length}</span></div>
        ${sorted.map((f) => `<div class="list-row">${avatar(f.profile, 44, S.online.has(f.profile.id))}<div class="grow">${userLink(f.profile)} ${badge(f.profile)}
          <div class="meta">${S.online.has(f.profile.id) ? '<span class="green">Online</span>' : 'Last seen ' + ago(f.profile.last_seen)}</div></div>
          <button class="btn sm" data-chat="${f.profile.id}">💬 Message</button></div>`).join('') || '<p class="pad muted">No friends yet. Visit someone\'s profile and press <b>Add friend</b>.</p>'}</div>
      ${outgoing.length ? `<div class="panel"><div class="panel-head"><h3>Requests you sent</h3></div>
        ${outgoing.map((r) => `<div class="list-row">${avatar(r.to, 36)}<div class="grow">${userLink(r.to)}<div class="meta">sent ${ago(r.created_at)}</div></div>
          <button class="btn ghost sm" data-decline="${r.id}">Cancel</button></div>`).join('')}</div>` : ''}`;
    $$('[data-accept]').forEach((b) => b.onclick = () => busy(b, async () => { await api.acceptRequest(+b.dataset.accept); toast('Friend added!'); route(); }));
    $$('[data-decline]').forEach((b) => b.onclick = () => busy(b, async () => { await api.removeRequest(+b.dataset.decline); route(); }));
    $$('[data-chat]').forEach((b) => b.onclick = () => window.Messenger.open(S.friends.find((f) => f.profile.id === b.dataset.chat).profile));
  };

  // RSPS-style inbox: every conversation, full history, reply box.
  views.inbox = async (partnerName) => {
    if (!S.me) return needLogin();
    setTitle('Messages');
    const convos = await api.conversations();
    S.friends.forEach((f) => { if (!convos.some((c) => c.partner.id === f.profile.id)) convos.push({ partner: f.profile, last_body: '', unread: 0 }); });
    const current = convos.find((c) => c.partner.username.toLowerCase() === (partnerName || '').toLowerCase()) || (partnerName ? null : convos[0]);
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Messages</div>
      <div class="panel inbox">
        <div class="inbox-list">${convos.map((c) => `
          <a href="#/inbox/${encodeURIComponent(c.partner.username)}" class="inbox-item ${c === current ? 'on' : ''}">
            ${avatar(c.partner, 40, S.online.has(c.partner.id))}
            <div class="grow"><div class="row between"><b>${esc(c.partner.username)}</b><span class="meta">${c.last_at ? ago(c.last_at) : ''}</span></div>
            <div class="meta clip">${c.last_from_me ? 'You: ' : ''}${esc(c.last_body || 'Say hi!')}</div></div>
            ${c.unread ? `<b class="count inline">${c.unread}</b>` : ''}</a>`).join('') || '<p class="pad muted">No conversations. Add friends to message them.</p>'}</div>
        <div class="inbox-thread">${current ? `
          <div class="inbox-head">${avatar(current.partner, 36, S.online.has(current.partner.id))}${userLink(current.partner)}
            <button class="btn ghost sm" id="pop">Open in chat bar</button></div>
          <div class="inbox-msgs" id="msgs"></div>
          <form id="send" class="inbox-send"><textarea id="msg" rows="2" maxlength="2000" placeholder="Write a message… (Enter to send)"></textarea><button class="btn">Send</button></form>`
          : '<div class="pad center muted">Pick a conversation.</div>'}</div>
      </div>`;
    if (!current) return;
    const partner = current.partner;
    const box = $('#msgs');
    const draw = async () => {
      const msgs = await api.conversation(partner.id, 200);
      box.innerHTML = msgs.map((m) => `<div class="bubble ${m.sender_id === S.me.id ? 'me' : ''}" title="${full(m.created_at)}">${fmt(m.body)}<span class="meta">${ago(m.created_at)}</span></div>`).join('')
        || '<p class="center muted">No messages yet.</p>';
      box.scrollTop = box.scrollHeight;
      await api.markRead(partner.id); delete S.unread[partner.id]; bus.emit('counts');
    };
    const send = () => {
      const v = $('#msg').value.trim();
      if (v) busy(null, async () => { const m = await api.send(partner.id, v); $('#msg').value = ''; bus.emit('sent', m); draw(); });
    };
    $('#send').onsubmit = (e) => { e.preventDefault(); send(); };
    $('#msg').onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    $('#pop').onclick = () => window.Messenger.open(partner);
    inboxPartner = partner.id; inboxRedraw = draw;
    await draw();
  };
  let inboxPartner = null, inboxRedraw = null;
  bus.on('message', (m) => { if (location.hash.startsWith('#/inbox') && m.sender_id === inboxPartner) inboxRedraw?.(); });

  // ---------- accounts ----------
  const NAME_RE = /^[A-Za-z0-9_ -]{3,12}$/;

  views.login = async () => {
    if (S.me) return go('#/');
    setTitle('Log in');
    view.innerHTML = `
      <div class="auth panel">
        <h1>Welcome back</h1>
        <p class="muted">Log in to post, add friends and chat.</p>
        ${api.mode === 'demo' ? '<div class="note">Demo mode: log in as <b>Maddog</b> (owner) or <b>Kagemaru</b> (admin), password <b>demo123</b>.</div>' : ''}
        <form id="f" class="form">
          <label>Email<input id="login" autocomplete="username" required></label>
          <label>Password<input id="pw" type="password" autocomplete="current-password" required></label>
          <button class="btn block">Log in</button>
        </form>
        <p class="center meta"><a href="#/forgot">Forgot password?</a> · New here? <a href="#/register">Create an account</a></p>
      </div>`;
    $('#f').onsubmit = (e) => {
      e.preventDefault();
      busy(e.submitter, async () => {
        await api.signIn({ login: $('#login').value.trim(), password: $('#pw').value });
        await onLogin(); toast(`Welcome back, ${S.me.username}!`, 'ok');
        const next = afterLogin; afterLogin = '#/'; go(next.startsWith('#/login') || next.startsWith('#/register') ? '#/' : next);
      });
    };
  };

  views.register = async () => {
    if (S.me) return go('#/');
    setTitle('Register');
    view.innerHTML = `
      <div class="auth panel">
        <h1>Join Shadow of Death</h1>
        <p class="muted">Create your community account. Tip: use your in-game name.</p>
        <form id="f" class="form">
          <label>Username<input id="name" maxlength="12" required autocomplete="nickname" placeholder="3–12 letters, numbers, spaces"><small id="name-hint" class="meta"></small></label>
          <label>Email<input id="email" type="email" required autocomplete="email"></label>
          <label>Password<input id="pw" type="password" minlength="8" required autocomplete="new-password" placeholder="At least 8 characters"></label>
          <label>Confirm password<input id="pw2" type="password" required autocomplete="new-password"></label>
          <label class="check"><input type="checkbox" id="rules" required> I agree to the <a href="#/rules" target="_blank">community rules</a></label>
          <button class="btn block">Create account</button>
        </form>
        <p class="center meta">Already have an account? <a href="#/login">Log in</a></p>
      </div>`;
    let t;
    $('#name').oninput = () => {
      clearTimeout(t);
      const v = $('#name').value.trim(), hint = $('#name-hint');
      if (!v) return hint.textContent = '';
      if (!NAME_RE.test(v)) { hint.textContent = '3–12 characters: letters, numbers, spaces, - and _'; hint.className = 'meta red'; return; }
      t = setTimeout(async () => {
        const free = await api.usernameAvailable(v).catch(() => true);
        hint.textContent = free ? '✓ Available' : '✕ Taken'; hint.className = 'meta ' + (free ? 'green' : 'red');
      }, 300);
    };
    $('#f').onsubmit = (e) => {
      e.preventDefault();
      const username = $('#name').value.trim(), email = $('#email').value.trim(), password = $('#pw').value;
      if (!NAME_RE.test(username)) return toast('Usernames are 3–12 letters, numbers, spaces, - or _.', 'error');
      if (password.length < 8) return toast('Passwords need at least 8 characters.', 'error');
      if (password !== $('#pw2').value) return toast('The passwords do not match.', 'error');
      busy(e.submitter, async () => {
        const res = await api.signUp({ username, email, password });
        if (res.needsConfirm) {
          view.innerHTML = `<div class="auth panel center"><h1>Check your email</h1><p>We sent a link to <b>${esc(email)}</b>. Click it to finish making your account, then log in.</p></div>`;
          return;
        }
        await onLogin(); toast(`Welcome to Shadow of Death, ${username}!`, 'ok'); go('#/u/' + encodeURIComponent(username));
      });
    };
  };

  views.forgot = async () => {
    setTitle('Reset password');
    view.innerHTML = `
      <div class="auth panel">
        <h1>Reset password</h1><p class="muted">We'll email you a link to set a new password.</p>
        <form id="f" class="form"><label>Email<input id="email" type="email" required></label><button class="btn block">Send reset link</button></form>
      </div>`;
    $('#f').onsubmit = (e) => {
      e.preventDefault();
      busy(e.submitter, async () => { await api.resetPassword($('#email').value.trim()); toast('If that email has an account, a reset link is on its way.', 'ok'); });
    };
  };

  // Accounts made by the game server (future) land here first.
  views.finish = async () => {
    if (!S.me) return needLogin();
    if (S.me.status !== 'incomplete') return go('#/');
    setTitle('Finish sign-up');
    view.innerHTML = `
      <div class="auth panel">
        <h1>Finish your sign-up</h1>
        <p class="muted">Your forum account was made automatically when you joined in-game as <b>${esc(S.me.game_username || S.me.username)}</b>.
          Add your email to finish. You'll use it to log in from now on.</p>
        <form id="f" class="form"><label>Email<input id="email" type="email" required></label><button class="btn block">Finish sign-up</button></form>
      </div>`;
    $('#f').onsubmit = (e) => {
      e.preventDefault();
      busy(e.submitter, async () => {
        const r = await api.finishSignup($('#email').value.trim());
        if (r.needsConfirm) return toast('Check your email and click the link to finish.', 'ok');
        toast('All done. Welcome!', 'ok'); go('#/');
      });
    };
  };

  views.settings = async () => {
    if (!S.me) return needLogin();
    setTitle('Settings');
    const m = S.me;
    const colors = ['#b3131b', '#e0561b', '#d4a63a', '#2fb37a', '#2f7bb3', '#6b2fb3', '#b32f8c', '#555555'];
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Settings</div>
      <div class="page-head"><h1>Settings</h1></div>
      <div class="cols even">
        <form class="panel pad form" id="prof">
          <h2>Profile</h2>
          <div class="row">${avatar(m, 64)}<div class="swatches">${colors.map((c) => `<button type="button" data-color="${c}" style="--c:${c}" class="${c === m.avatar_color ? 'on' : ''}"></button>`).join('')}</div></div>
          <label>Username<input id="name" maxlength="12" value="${esc(m.username)}"></label>
          <label>About me<textarea id="bio" rows="4" maxlength="500">${esc(m.bio)}</textarea></label>
          <label>Forum signature<textarea id="sig" rows="2" maxlength="200" placeholder="Shown under your forum posts">${esc(m.signature)}</textarea></label>
          <button class="btn">Save profile</button>
        </form>
        <div>
          <form class="panel pad form" id="email-f">
            <h2>Email</h2><p class="meta">Current: ${esc(m.email || '')}</p>
            <label>New email<input id="email" type="email" required></label><button class="btn ghost">Change email</button>
          </form>
          <form class="panel pad form" id="pw-f">
            <h2>Password</h2>
            <label>New password<input id="pw" type="password" minlength="8" required autocomplete="new-password"></label>
            <label>Confirm<input id="pw2" type="password" required autocomplete="new-password"></label>
            <button class="btn ghost">Change password</button>
          </form>
          ${api.mode === 'demo' ? `<div class="panel pad"><h2>Demo data</h2><p class="meta">Wipe every fake account, post and message saved in this browser and start over.</p>
            <button class="btn danger" id="reset">Reset demo</button></div>` : ''}
        </div>
      </div>`;
    let color = m.avatar_color;
    $$('[data-color]').forEach((b) => b.onclick = () => {
      color = b.dataset.color; $$('[data-color]').forEach((x) => x.classList.toggle('on', x === b));
      $('#prof .avatar').style.setProperty('--c', color);
    });
    $('#prof').onsubmit = (e) => {
      e.preventDefault();
      const username = $('#name').value.trim();
      if (!NAME_RE.test(username)) return toast('Usernames are 3–12 letters, numbers, spaces, - or _.', 'error');
      busy(e.submitter, async () => {
        await api.updateProfile({ username, bio: $('#bio').value.trim(), signature: $('#sig').value.trim(), avatar_color: color });
        S.me = api.me(); renderHeader(); toast('Profile saved.', 'ok');
      });
    };
    $('#email-f').onsubmit = (e) => {
      e.preventDefault();
      busy(e.submitter, async () => { await api.changeEmail($('#email').value.trim()); toast(api.mode === 'demo' ? 'Email changed.' : 'Check both inboxes to confirm the change.', 'ok'); });
    };
    $('#pw-f').onsubmit = (e) => {
      e.preventDefault();
      if ($('#pw').value !== $('#pw2').value) return toast('The passwords do not match.', 'error');
      busy(e.submitter, async () => { await api.changePassword($('#pw').value); e.target.reset(); toast('Password changed.', 'ok'); });
    };
    if ($('#reset')) $('#reset').onclick = () => { if (confirm('Reset all demo data?')) api.resetDemo(); };
  };

  views.rules = async () => {
    setTitle('Rules');
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a> › Rules</div>
      <div class="panel pad narrow rules">
        <h1>Community rules</h1>
        <ol>
          <li><b>Be respectful.</b> No harassment, hate speech, threats or targeting other players.</li>
          <li><b>No spam or advertising</b> other servers, sites or services.</li>
          <li><b>No scamming.</b> Trades in Buying &amp; Selling are at your own risk; report scammers to staff.</li>
          <li><b>Keep it in the right place.</b> Post in the forum that fits your topic.</li>
          <li><b>No inappropriate content.</b> Keep posts and pictures safe for everyone.</li>
          <li><b>Don't share personal information</b>, yours or anyone else's.</li>
          <li><b>Never share your password.</b> Staff will never ask for it.</li>
          <li><b>Report bugs, don't abuse them.</b> Post them in Bug Reports.</li>
          <li><b>Only donate to Maddog.</b></li>
          <li>Staff decisions are final. Appeals go in the <b>Appeals</b> forum.</li>
        </ol>
      </div>`;
  };

  function notFound(msg = 'That page does not exist.') {
    setTitle('Not found');
    view.innerHTML = `<div class="panel pad center narrow"><h1>Not found</h1><p class="muted">${esc(msg)}</p><a class="btn" href="#/">Go home</a></div>`;
  }

  // ---------- router ----------
  const routes = [
    [/^\/?$/, views.home],
    [/^\/forums$/, views.forums],
    [/^\/forum\/(\d+)(?:\/(\d+))?$/, views.forum],
    [/^\/thread\/(\d+)(?:\/(\d+|last))?$/, views.thread],
    [/^\/new\/(\d+)$/, views.newThread],
    [/^\/community$/, views.community],
    [/^\/u\/(.+)$/, views.profile],
    [/^\/members$/, views.members],
    [/^\/friends$/, views.friends],
    [/^\/inbox(?:\/(.+))?$/, views.inbox],
    [/^\/login$/, views.login],
    [/^\/register$/, views.register],
    [/^\/forgot$/, views.forgot],
    [/^\/finish$/, views.finish],
    [/^\/settings$/, views.settings],
    [/^\/rules$/, views.rules],
  ];
  let routeToken = 0;
  async function route() {
    const path = decodeURIComponent(location.hash.slice(1) || '/');
    // Links from Supabase emails put login details after the #; Supabase reads them itself.
    if (/^(access_token|error|type)=|&access_token=/.test(path)) return go('#/');
    if (S.me?.status === 'incomplete' && !['/finish', '/rules'].includes(path)) return go('#/finish');
    renderHeader();
    inboxPartner = null;
    const token = ++routeToken;
    for (const [re, fn] of routes) {
      const m = path.match(re);
      if (!m) continue;
      loading();
      try { await fn(...m.slice(1)); }
      catch (e) {
        console.error(e);
        if (token === routeToken) view.innerHTML = `<div class="panel pad error narrow"><h2>Something went wrong</h2><p>${esc(errText(e))}</p>
          <button class="btn ghost" onclick="location.reload()">Try again</button></div>`;
      }
      if (token === routeToken) window.scrollTo(0, 0);
      return;
    }
    notFound();
  }
  window.addEventListener('hashchange', route);

  // ---------- friends / unread counts / live updates ----------
  async function refreshSocial() {
    if (!S.me) { S.friends = []; S.requests = { incoming: [], outgoing: [] }; S.unread = {}; bus.emit('counts'); return; }
    const [friends, requests, convos] = await Promise.all([api.friends(), api.requests(), api.conversations()]);
    S.friends = friends; S.requests = requests;
    S.unread = Object.fromEntries(convos.filter((c) => c.unread).map((c) => [c.partner.id, c.unread]));
    bus.emit('friends'); bus.emit('counts');
  }
  window.refreshSocial = refreshSocial;

  let liveChain = Promise.resolve();
  function startLive() {
    liveChain = liveChain.then(() => api.startLive({
      onPresence: (set) => { if (S.me) set.add(S.me.id); S.online = set; bus.emit('presence'); },
      onTyping: (from) => bus.emit('typing', from),
      onMessage: (m) => { bus.emit('message', m); },
      onFriends: async () => {
        const before = S.requests.incoming.length;
        await refreshSocial();
        if (S.requests.incoming.length > before) toast('You have a new friend request!', 'ok');
      },
    })).catch(console.error);
  }

  // Runs once per account change (log in, log out, or another tab).
  let sessionFor;
  async function syncSession() {
    S.me = api.me();
    const id = S.me?.id || null;
    if (id === sessionFor) return false;
    sessionFor = id;
    await refreshSocial().catch(console.error);
    startLive();
    window.Messenger.reset();
    return true;
  }
  const onLogin = syncSession;

  api.onAuthChange(async (me, event) => {
    if (event === 'PASSWORD_RECOVERY') {
      await syncSession();
      toast('Choose a new password below.', 'ok');
      return go('#/settings');
    }
    const changed = await syncSession();
    if (changed && !/^#\/(login|register)/.test(location.hash)) route();
  });

  // ---------- start ----------
  if (api.mode === 'demo') document.getElementById('demo-banner').hidden = false;
  try { S.me = await api.init(); }
  catch (e) {
    console.error(e);
    toast('Could not reach the database: ' + errText(e), 'error');
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  window.Messenger.init({ api, S, bus, go });
  sessionFor = undefined;
  await syncSession();
  setInterval(() => api.touch().catch(() => {}), 120000);
  api.touch().catch(() => {});
  route();
})();
