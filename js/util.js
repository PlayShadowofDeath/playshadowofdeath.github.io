// Small helpers shared by every page.
window.U = (() => {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Safe text formatting: HTML is escaped first, then a few simple codes
  // are turned on: **bold**, *italic*, __underline__, `code`, links, and
  // lines starting with "> " become a quote box.
  function inline(s) {
    return s
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
      .replace(/__([^_\n]+)__/g, '<u>$1</u>')
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<i>$2</i>')
      .replace(/\bhttps?:\/\/[^\s<]+[^\s<.,;:!?)'"]/g,
        (u) => `<a href="${u}" target="_blank" rel="noopener nofollow ugc">${u}</a>`);
  }
  function fmt(text) {
    const lines = esc(text).split('\n');
    let out = '', quote = [];
    const flush = () => {
      if (!quote.length) return;
      out += `<blockquote>${quote.map(inline).join('<br>')}</blockquote>`;
      quote = [];
    };
    for (const line of lines) {
      if (line.startsWith('&gt; ') || line === '&gt;') { quote.push(line.replace(/^&gt; ?/, '')); continue; }
      flush();
      out += inline(line) + '<br>';
    }
    flush();
    return out.replace(/(<br>)+$/, '');
  }

  function ago(ts) {
    if (!ts) return '';
    const s = Math.max(0, (Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 45) return 'just now';
    if (s < 3600) return Math.round(s / 60) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    if (s < 86400 * 7) return Math.round(s / 86400) + 'd ago';
    return date(ts);
  }
  const date = (ts) => new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const time = (ts) => new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const full = (ts) => new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  const RANKS = {
    owner: { label: 'Owner', cls: 'owner' },
    admin: { label: 'Administrator', cls: 'admin' },
    moderator: { label: 'Moderator', cls: 'mod' },
    member: { label: 'Member', cls: 'member' },
  };
  const rank = (p) => RANKS[p?.role] || RANKS.member;
  const badge = (p) => p && p.role !== 'member' ? `<span class="rank ${rank(p).cls}">${rank(p).label}</span>` : '';

  function avatar(p, size = 40, online) {
    const name = p?.username || '?';
    return `<span class="avatar" style="--s:${size}px;--c:${esc(p?.avatar_color || '#555')}">${esc(name[0].toUpperCase())}${
      online === undefined ? '' : `<i class="dot ${online ? 'on' : ''}" data-dot="${esc(p?.id || '')}"></i>`}</span>`;
  }
  const userLink = (p) => p ? `<a class="user ${rank(p).cls}" href="#/u/${encodeURIComponent(p.username)}">${esc(p.username)}</a>` : '<span class="muted">[deleted]</span>';

  function toast(msg, kind = 'info') {
    const box = document.getElementById('toasts');
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3500);
    setTimeout(() => t.remove(), 4000);
  }

  const errText = (e) => (e && (e.message || e.error_description)) || String(e);

  return { esc, fmt, ago, date, time, full, rank, badge, avatar, userLink, toast, errText };
})();
