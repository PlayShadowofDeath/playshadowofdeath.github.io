// The chat bar: pops up from the bottom-right like old Facebook chat.
// Friends list with online dots, and small chat windows that dock along
// the bottom. Messages arrive instantly (Supabase Realtime).
window.Messenger = (() => {
  const { esc, fmt, time, full, avatar, toast, errText } = window.U;
  let api, S, bus, go;
  const root = document.getElementById('chatbar');
  const KEY = 'sod_chat_windows';
  let windows = [];          // [{ id, profile, min }]
  let listOpen = false;
  let muted = false;
  const typingUntil = {};    // friendId -> time
  let lastTypingSent = 0;
  let titleFlash = null;
  try { muted = localStorage.getItem('sod_chat_muted') === '1'; } catch { /* storage blocked */ }

  const maxWindows = () => (innerWidth < 700 ? 1 : innerWidth < 1100 ? 2 : 3);
  const saveWindows = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify(windows.map((w) => ({ id: w.id, min: w.min })))); } catch { /* ignore */ }
  };

  function beep() {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.3);
      o.onended = () => ctx.close();
    } catch { /* no audio */ }
  }

  function flashTitle(name) {
    if (!document.hidden || titleFlash) return;
    const original = document.title;
    let on = false;
    titleFlash = setInterval(() => { document.title = (on = !on) ? `💬 ${name} messaged you` : original; }, 1000);
    const stop = () => { clearInterval(titleFlash); titleFlash = null; document.title = original; document.removeEventListener('visibilitychange', stop); };
    document.addEventListener('visibilitychange', stop);
  }

  // ---------- drawing ----------
  function render() {
    if (!S.me) {
      root.innerHTML = `<div class="cb-main"><a class="cb-tab" href="#/login">💬 Log in to chat</a></div>`;
      return;
    }
    const onlineFriends = S.friends.filter((f) => S.online.has(f.profile.id));
    const unreadTotal = Object.values(S.unread).reduce((a, b) => a + b, 0);
    root.innerHTML = `
      <div class="cb-windows">${windows.map(windowHtml).join('')}</div>
      <div class="cb-main ${listOpen ? 'open' : ''}">
        <div class="cb-list" ${listOpen ? '' : 'hidden'}>
          <div class="cb-head"><b>Chat</b><span class="grow"></span>
            <button class="cb-icon" data-mute title="${muted ? 'Sound off' : 'Sound on'}">${muted ? '🔕' : '🔔'}</button>
            <button class="cb-icon" data-close-list title="Hide">▾</button></div>
          <input class="cb-search" placeholder="Search friends…" data-search>
          <div class="cb-friends">${friendRows()}</div>
          <a class="cb-foot" href="#/friends">Manage friends</a>
        </div>
        <button class="cb-tab" data-toggle-list><i class="dot on"></i> Chat (${onlineFriends.length})${unreadTotal ? `<b class="count">${unreadTotal}</b>` : ''}</button>
      </div>`;
    windows.forEach((w) => fillWindow(w, true));
  }

  function friendRows(filter = '') {
    const list = S.friends.filter((f) => f.profile.username.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => (S.online.has(b.profile.id) - S.online.has(a.profile.id)) || a.profile.username.localeCompare(b.profile.username));
    if (!list.length) return `<p class="cb-empty">${S.friends.length ? 'Nobody found.' : 'No friends yet.<br><a href="#/members">Find people</a> and add them.'}</p>`;
    return list.map((f) => {
      const on = S.online.has(f.profile.id), n = S.unread[f.profile.id];
      return `<button class="cb-friend ${on ? '' : 'off'}" data-open="${f.profile.id}">${avatar(f.profile, 28, on)}
        <span class="grow">${esc(f.profile.username)}</span>${n ? `<b class="count">${n}</b>` : ''}</button>`;
    }).join('');
  }

  function windowHtml(w) {
    const on = S.online.has(w.id), n = S.unread[w.id];
    return `<section class="cb-win ${w.min ? 'min' : ''} ${n && w.min ? 'flash' : ''}" data-win="${w.id}">
      <header data-min="${w.id}">${avatar(w.profile, 22, on)}<b class="grow">${esc(w.profile.username)}</b>${n && w.min ? `<b class="count">${n}</b>` : ''}
        <a class="cb-icon" href="#/u/${encodeURIComponent(w.profile.username)}" title="Profile" data-stop>👤</a>
        <button class="cb-icon" data-x="${w.id}" title="Close">✕</button></header>
      <div class="cb-msgs" data-msgs><div class="cb-loading">…</div></div>
      <div class="cb-typing" data-typing hidden>${esc(w.profile.username)} is typing…</div>
      <form data-send="${w.id}"><textarea rows="1" maxlength="2000" placeholder="Message ${esc(w.profile.username)}…"></textarea></form>
    </section>`;
  }

  const winEl = (id) => root.querySelector(`[data-win="${id}"]`);

  async function fillWindow(w, keepScroll) {
    const el = winEl(w.id);
    if (!el || w.min) return;
    const box = el.querySelector('[data-msgs]');
    if (!w.msgs) w.msgs = await api.conversation(w.id, 60).catch(() => []);
    const atBottom = !keepScroll || box.scrollHeight - box.scrollTop - box.clientHeight < 40;
    let lastDay = '';
    box.innerHTML = w.msgs.map((m) => {
      const day = new Date(m.created_at).toDateString();
      const sep = day !== lastDay ? `<div class="cb-day">${day === new Date().toDateString() ? 'Today' : new Date(m.created_at).toLocaleDateString()}</div>` : '';
      lastDay = day;
      return `${sep}<div class="cb-msg ${m.sender_id === S.me.id ? 'me' : ''}" title="${full(m.created_at)}"><span>${fmt(m.body)}</span><time>${time(m.created_at)}</time></div>`;
    }).join('') || `<p class="cb-empty">Say hi to ${esc(w.profile.username)}! 👋</p>`;
    if (atBottom) box.scrollTop = box.scrollHeight;
    if (S.unread[w.id] && !document.hidden) {
      delete S.unread[w.id];
      api.markRead(w.id).catch(() => {});
      bus.emit('counts'); refreshBadges();
    }
  }

  function refreshBadges() {
    const tab = root.querySelector('[data-toggle-list]');
    if (!tab) return;
    const unreadTotal = Object.values(S.unread).reduce((a, b) => a + b, 0);
    tab.innerHTML = `<i class="dot on"></i> Chat (${S.friends.filter((f) => S.online.has(f.profile.id)).length})${unreadTotal ? `<b class="count">${unreadTotal}</b>` : ''}`;
    const fl = root.querySelector('.cb-friends');
    if (fl) fl.innerHTML = friendRows(root.querySelector('[data-search]')?.value || '');
  }

  // ---------- actions ----------
  function open(profile, { focus = true, min = false } = {}) {
    if (!S.me) return go('#/login');
    if (!S.friends.some((f) => f.profile.id === profile.id)) return toast(`Add ${profile.username} as a friend to chat.`, 'error');
    let w = windows.find((x) => x.id === profile.id);
    if (!w) {
      w = { id: profile.id, profile, min };
      windows.unshift(w);
      while (windows.length > maxWindows()) windows.pop();
    } else if (!min) w.min = false;
    saveWindows();
    render();
    if (focus && !w.min) setTimeout(() => winEl(w.id)?.querySelector('textarea')?.focus(), 30);
  }

  function close(id) { windows = windows.filter((w) => w.id !== id); saveWindows(); render(); }

  async function send(id, ta) {
    const body = ta.value.trim();
    if (!body) return;
    ta.value = ''; ta.style.height = '';
    const w = windows.find((x) => x.id === id);
    try {
      const m = await api.send(id, body);
      if (w) { w.msgs = [...(w.msgs || []), m]; fillWindow(w); }
    } catch (e) { ta.value = body; toast(errText(e), 'error'); }
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('button, a, header');
    if (!t || !root.contains(t)) return;
    if (t.matches('[data-toggle-list]')) { listOpen = !listOpen; render(); if (listOpen) root.querySelector('[data-search]')?.focus(); return; }
    if (t.matches('[data-close-list]')) { listOpen = false; render(); return; }
    if (t.matches('[data-mute]')) {
      muted = !muted; try { localStorage.setItem('sod_chat_muted', muted ? '1' : '0'); } catch { /* ignore */ }
      render(); return;
    }
    if (t.matches('[data-open]')) {
      const f = S.friends.find((x) => x.profile.id === t.dataset.open);
      if (innerWidth < 700) listOpen = false;
      if (f) open(f.profile);
      return;
    }
    if (t.matches('[data-x]')) { e.stopPropagation(); close(t.dataset.x); return; }
    if (t.matches('[data-stop]')) return;
    if (t.matches('[data-min]')) {
      const w = windows.find((x) => x.id === t.dataset.min);
      w.min = !w.min; saveWindows(); render();
      if (!w.min) winEl(w.id)?.querySelector('textarea')?.focus();
    }
  });
  root.addEventListener('input', (e) => {
    if (e.target.matches('[data-search]')) { root.querySelector('.cb-friends').innerHTML = friendRows(e.target.value); return; }
    if (e.target.tagName === 'TEXTAREA') {
      const ta = e.target;
      ta.style.height = ''; ta.style.height = Math.min(ta.scrollHeight, 90) + 'px';
      const id = ta.closest('[data-send]').dataset.send;
      if (Date.now() - lastTypingSent > 2000) { lastTypingSent = Date.now(); api.typing(id); }
    }
  });
  root.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(e.target.closest('[data-send]').dataset.send, e.target);
    }
    if (e.key === 'Escape' && e.target.tagName === 'TEXTAREA') {
      const w = windows.find((x) => x.id === e.target.closest('[data-send]').dataset.send);
      if (w) { w.min = true; saveWindows(); render(); }
    }
  });
  root.addEventListener('submit', (e) => e.preventDefault());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) windows.forEach((w) => fillWindow(w, true)); });

  // ---------- live events ----------
  function onMessage(m) {
    if (!S.me || m.sender_id === S.me.id) return;
    const friend = S.friends.find((f) => f.profile.id === m.sender_id);
    delete typingUntil[m.sender_id];
    S.unread[m.sender_id] = (S.unread[m.sender_id] || 0) + 1;
    let w = windows.find((x) => x.id === m.sender_id);
    if (w) w.msgs = w.msgs ? [...w.msgs, m] : null;
    if (!w && friend) { open(friend.profile, { focus: false }); w = windows.find((x) => x.id === m.sender_id); }
    else render();
    beep();
    flashTitle(friend?.profile.username || 'Someone');
    bus.emit('counts');
  }

  function onTyping(from) {
    typingUntil[from] = Date.now() + 3500;
    const el = winEl(from)?.querySelector('[data-typing]');
    if (el) el.hidden = false;
    setTimeout(() => {
      if ((typingUntil[from] || 0) <= Date.now()) { const e2 = winEl(from)?.querySelector('[data-typing]'); if (e2) e2.hidden = true; }
    }, 3600);
  }

  return {
    init(ctx) {
      ({ api, S, bus, go } = ctx);
      bus.on('message', onMessage);
      bus.on('typing', onTyping);
      bus.on('presence', () => { refreshBadges(); windows.forEach((w) => {
        const d = winEl(w.id)?.querySelector('header .dot'); if (d) d.classList.toggle('on', S.online.has(w.id)); }); });
      bus.on('friends', () => {
        windows = windows.filter((w) => S.friends.some((f) => f.profile.id === w.id));
        render();
      });
      bus.on('sent', (m) => { const w = windows.find((x) => x.id === m.recipient_id); if (w) { w.msgs = null; fillWindow(w); } });
      render();
    },
    // Called after log in / log out: reopen the windows from this tab.
    reset() {
      windows = [];
      if (S.me) {
        try {
          const saved = JSON.parse(sessionStorage.getItem(KEY) || '[]');
          saved.forEach((s) => { const f = S.friends.find((x) => x.profile.id === s.id); if (f) windows.push({ id: s.id, profile: f.profile, min: s.min || innerWidth < 700 }); });
        } catch { /* ignore */ }
      } else saveWindows();
      render();
    },
    open,
  };
})();
