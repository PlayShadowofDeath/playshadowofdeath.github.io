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
  const staffEmblems = Object.freeze({
    owner: ['owner-crowned-skull.png', 'Crowned Skull (Owner)'],
    admin: ['staff-admin-crown.png', 'Gold Crown (Admin)'],
    moderator: ['staff-moderator-crown.png', 'Silver Crown (Moderator)'],
  });
  const staffEmblem = (p) => Object.hasOwn(staffEmblems, p?.role) ? staffEmblems[p.role] : null;
  const badge = (p) => {
    if (!p || p.role === 'member') return '';
    const emblem = staffEmblem(p);
    return `<span class="rank ${rank(p).cls}">${emblem ? `<img class="staff-emblem" src="img/cinematic/${emblem[0]}" alt="">` : ''}${rank(p).label}</span>`;
  };

  const avatarIcons = Object.freeze({
    initials: 'Initials',
    knight: 'Shadow Knight',
    dragon: 'Dragon',
    citadel: 'Citadel',
    portal: 'Crimson Portal',
  });
  const avatarArt = {
    knight: 'shadow-knight-mobile.webp',
    dragon: 'bossing.webp',
    citadel: 'progression.webp',
    portal: 'new-content.webp',
  };
  const donorRanks = new Set(['lost-soul', 'wraith', 'phantom', 'shade', 'revenant', 'reaper', 'death', 'eternal', 'oblivion']);
  const demoRankIcons = (p) => p?.id === 'u-shadow'
    ? [...donorRanks].map((key) => [`test-${key}`, key.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')])
    : [];
  const donorArt = (p) => {
    const key = p?.game?.donator_rank?.trim().toLowerCase().replace(/\s+/g, '-');
    return donorRanks.has(key) ? `rank-${key}-reforged.png` : '';
  };

  function avatar(p, size = 40, online) {
    const name = p?.username || '?';
    const icon = p?.avatar_icon;
    const staff = staffEmblem(p);
    const testRank = p?.id === 'u-shadow' && icon?.startsWith('test-') && donorRanks.has(icon.slice(5)) ? icon.slice(5) : '';
    const rankArt = testRank ? `rank-${testRank}-reforged.png` : icon === 'donator' ? donorArt(p) : '';
    const art = rankArt || (Object.hasOwn(avatarArt, icon) ? avatarArt[icon] : '');
    const closeup = size <= 48 && rankArt
      ? ` avatar-closeup avatar-closeup-${rankArt.slice(5, -'-reforged.png'.length)}` : '';
    const face = art
      ? `<span class="avatar-image${closeup}"><img class="avatar-icon avatar-icon-${rankArt ? 'donator' : icon}" src="img/cinematic/${art}" alt=""></span>`
      : staff
        ? `<span class="avatar-image"><img class="avatar-icon avatar-icon-staff avatar-icon-${rank(p).cls}" src="img/cinematic/${staff[0]}" alt=""></span>`
        : esc(name[0].toUpperCase());
    return `<span class="avatar" style="--s:${size}px;--c:${esc(p?.avatar_color || '#555')}">${face}${
      online === undefined ? '' : `<i class="dot ${online ? 'on' : ''}" data-dot="${esc(p?.id || '')}"></i>`}</span>`;
  }
  // Donator rank from the game ("Death", "Reaper", ...) in that rank's in-game colour.
  const donor = (p) => p?.game?.donator_rank
    ? `<span class="donor" style="--d:#${esc(/^[0-9a-f]{6}$/i.test(p.game.donator_color) ? p.game.donator_color : 'd4a63a')}">${donorArt(p) ? `<img src="img/cinematic/${donorArt(p)}" alt="">` : ''}<span>${esc(p.game.donator_rank)}</span></span>` : '';
  // The game server updates this every minute, so an old "online" means the server is down.
  const serverUp = (s) => !!s && s.online && Date.now() - new Date(s.updated_at).getTime() < 3 * 60000;
  const inGame = (p, s) => !!p?.game?.online && serverUp(s);
  const played = (min) => min >= 60 ? `${Math.floor(min / 1440) ? Math.floor(min / 1440) + 'd ' : ''}${Math.floor(min / 60) % 24}h` : `${min || 0}m`;

  const userLink =(p) => p ? `<a class="user ${rank(p).cls}" href="#/u/${encodeURIComponent(p.username)}">${esc(p.username)}</a>` : '<span class="muted">[deleted]</span>';

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

  return { esc, fmt, ago, date, time, full, rank, badge, staffEmblem, donor, donorArt, serverUp, inGame, played, avatar, avatarIcons, demoRankIcons, userLink, toast, errText };
})();
