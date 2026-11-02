// DEMO backend: used while js/config.js has no Supabase keys.
// Everything is saved in this browser only (localStorage), so nobody else
// sees it. Open the site in two tabs, log in as two different accounts and
// you can chat between them. "ShadowBot" is always online and replies.
window.makeDemoBackend = () => {
  const KEY = 'sod_demo_v1';
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('sod_demo') : null;
  const tabId = Math.random().toString(36).slice(2);
  const BOT = 'bot-shadow';
  let me = null, liveHandlers = null, authCb = null;
  const seen = {};          // uid -> last heartbeat time (other tabs)
  const delay = (ms = 60) => new Promise((r) => setTimeout(r, ms));
  const now = () => new Date().toISOString();
  const ago = (min) => new Date(Date.now() - min * 60000).toISOString();

  function seed() {
    const u = (id, username, role, color, bio, mins) => ({ id, username, role, avatar_color: color, bio, signature: '',
      status: 'active', game_username: username, created_at: ago(mins), last_seen: ago(5), email: username.toLowerCase() + '@demo.local', password: 'demo123' });
    const db = {
      seq: 100,
      users: [
        u('u-maddog', 'Maddog', 'owner', '#b3131b', 'Owner of Shadow of Death. Only donate to Maddog!', 60 * 24 * 30),
        u('u-kage', 'Kagemaru', 'admin', '#6b2fb3', 'Admin. Bossing all day.', 60 * 24 * 25),
        u(BOT, 'ShadowBot', 'moderator', '#d4a63a', 'I am the demo helper bot. Message me in the chat bar!', 60 * 24 * 20),
        u('u-grim', 'IronGrim', 'member', '#2f7bb3', 'Ironman. No trading, no problem.', 60 * 24 * 3),
        u('u-lily', 'LilyReaper', 'member', '#2fb37a', 'Skiller. 99 Woodcutting at the Halloween tree.', 60 * 10),
      ],
      categories: [
        ['Shadow of Death', 'Announcements', 'Official news from the Shadow of Death team.', '📢', true],
        ['Shadow of Death', 'Updates & Patch Notes', 'Every new feature, change and fix.', '📜', true],
        ['Shadow of Death', 'Events', 'Double XP weekends, boss events, competitions.', '🎉', false],
        ['Community', 'General Discussion', 'Talk about anything Shadow of Death.', '💬', false],
        ['Community', 'Introductions', 'New here? Say hello!', '👋', false],
        ['Community', 'Drops & Achievements', 'Show off your best drops, maxed stats and pets.', '🏆', false],
        ['Community', 'Off-topic', 'Anything not about the game.', '☕', false],
        ['Game', 'Guides', 'Money making, bossing, skilling and starter guides.', '📖', false],
        ['Game', 'Suggestions', 'Ideas to make Shadow of Death better.', '💡', false],
        ['Game', 'Buying & Selling', 'Trade items and gold with other players.', '💰', false],
        ['Support', 'Help & Questions', 'Stuck? Ask the community.', '❓', false],
        ['Support', 'Bug Reports', 'Found something broken? Tell us how to make it happen.', '🐞', false],
        ['Support', 'Appeals', 'Banned or muted? Appeal here.', '⚖️', false],
      ].map(([section, name, description, icon, staff_only], i) => ({ id: i + 1, section, name, description, icon, sort: (i + 1) * 10, staff_only })),
      threads: [], posts: [], wall: [], likes: [], comments: [], requests: [], messages: [],
    };
    const thread = (cat, author, title, body, mins, replies = [], extra = {}) => {
      const id = ++db.seq;
      db.threads.push({ id, category_id: cat, author_id: author, title, pinned: false, locked: false, view_count: 10 + replies.length * 7, created_at: ago(mins), ...extra });
      db.posts.push({ id: ++db.seq, thread_id: id, author_id: author, body, created_at: ago(mins), edited_at: null });
      replies.forEach(([a, b, m]) => db.posts.push({ id: ++db.seq, thread_id: id, author_id: a, body: b, created_at: ago(m), edited_at: null }));
    };
    thread(1, 'u-maddog', 'Welcome to the Shadow of Death forums!',
      'Welcome everyone!\n\nThis is the new home of the **Shadow of Death** community. Make an account, say hi in *Introductions*, add your friends and use the chat bar at the bottom of the screen to talk instantly.\n\nPlease read the rules before posting. Have fun!',
      60 * 24 * 2, [['u-kage', 'Looks great, nice work!', 60 * 24], ['u-lily', 'Love the chat bar :D', 60 * 5]], { pinned: true });
    thread(2, 'u-maddog', 'Update: Custom items, Quests panel and Blackjack',
      'Big update today:\n\n**NEW** Quests panel - `::quests`\n**NEW** Blackjack - `::blackjack name amount`\n**NEW** Custom items made in the Server Manager\n\nFull list in the patch notes.', 60 * 30);
    thread(4, 'u-grim', 'Best money making for ironmen?', 'What is everyone doing for money as an ironman? Skilling contracts seem good.',
      60 * 8, [['u-kage', '> Skilling contracts seem good.\nThey are! Elite contracts pay 10-35M each.', 60 * 3]]);
    thread(5, 'u-lily', 'Hi from LilyReaper', 'Hey all, I mostly skill. Add me!', 60 * 9);
    thread(8, 'u-kage', '[Guide] Theatre of Blood for beginners', 'Gear, inventory and what each boss does. Scythe drop is about 1 in 95 now.', 60 * 24 * 4);
    thread(12, 'u-grim', 'Item pictures blank after switching graphics', 'Fixed in the last update, can be locked.', 60 * 24 * 6, [], { locked: true });
    const wall = (author, owner, body, mins, likes = [], comments = []) => {
      const id = ++db.seq;
      db.wall.push({ id, author_id: author, wall_owner_id: owner, body, created_at: ago(mins) });
      likes.forEach((l) => db.likes.push({ post_id: id, user_id: l }));
      comments.forEach(([a, b, m]) => db.comments.push({ id: ++db.seq, post_id: id, author_id: a, body: b, created_at: ago(m) }));
    };
    wall('u-lily', 'u-lily', 'Just got a Legendary chest from the Halloween AFK tree!!! 🎃', 50, ['u-kage', 'u-grim'], [['u-grim', 'No way, gz!', 40]]);
    wall('u-kage', 'u-kage', 'Double XP this weekend - who is grinding Slayer with me?', 60 * 6, ['u-maddog']);
    wall('u-maddog', 'u-maddog', 'The new website is up. Tell your friends!', 60 * 26, ['u-kage', 'u-lily', 'u-grim']);
    db.requests.push({ id: ++db.seq, from_id: 'u-maddog', to_id: 'u-kage', status: 'accepted', created_at: ago(9000), responded_at: ago(9000) });
    db.requests.push({ id: ++db.seq, from_id: 'u-grim', to_id: 'u-lily', status: 'accepted', created_at: ago(900), responded_at: ago(900) });
    return db;
  }

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
  let cache = load() || seed();
  const db = () => (cache = load() || cache);
  const save = (d) => { cache = d; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* full or blocked */ } };
  const pub = (u) => { if (!u) return null; const { password, email, ...p } = u; return p; };
  const prof = (d, id) => pub(d.users.find((u) => u.id === id));
  const need = () => { if (!me) throw new Error('Log in first.'); if (me.status === 'banned') throw new Error('Your account is banned.'); };
  const isStaff = (p = me) => p && ['moderator', 'admin', 'owner'].includes(p.role);
  const emit = (msg) => { bc?.postMessage(msg); };
  const areFriends = (d, a, b) => d.requests.some((r) => r.status === 'accepted' &&
    ((r.from_id === a && r.to_id === b) || (r.from_id === b && r.to_id === a)));
  const page = (rows, p, size) => ({ rows: rows.slice(p * size, p * size + size), total: rows.length });
  const threadView = (d, t) => {
    const posts = d.posts.filter((p) => p.thread_id === t.id).sort((a, b) => a.created_at.localeCompare(b.created_at));
    const last = posts[posts.length - 1];
    return { ...t, reply_count: Math.max(posts.length - 1, 0), last_post_at: last?.created_at || t.created_at,
      last_post_by: last?.author_id, author: prof(d, t.author_id), last_poster: prof(d, last?.author_id) };
  };

  function refreshMe() {
    const id = sessionStorage.getItem('sod_demo_uid');
    const u = id && db().users.find((x) => x.id === id);
    me = u ? { ...pub(u), email: u.email } : null;
    return me;
  }

  // Other tabs tell us about new messages / friend changes / who is online.
  bc && (bc.onmessage = ({ data }) => {
    if (data.type === 'hb') seen[data.uid] = Date.now();
    if (data.type === 'bye') delete seen[data.uid];
    if (!liveHandlers || !me) return;
    if (data.type === 'msg' && data.msg.recipient_id === me.id) liveHandlers.onMessage(data.msg);
    if (data.type === 'friends' && data.ids.includes(me.id)) liveHandlers.onFriends();
    if (data.type === 'typing' && data.to === me.id) liveHandlers.onTyping(data.from);
  });
  setInterval(() => { if (me) emit({ type: 'hb', uid: me.id }); pushPresence(); }, 4000);
  addEventListener('pagehide', () => me && emit({ type: 'bye', uid: me.id }));
  function online() {
    const s = new Set([BOT, ...Object.keys(seen).filter((k) => Date.now() - seen[k] < 10000)]);
    if (me) s.add(me.id);
    return s;
  }
  function pushPresence() { liveHandlers?.onPresence(online()); }

  function botReply(to, text) {
    const lines = [
      'Hey! I am ShadowBot. This is demo mode, so messages only live in your browser.',
      'Tip: open the site in a second tab, log in as Kagemaru (password demo123) and chat with yourself!',
      'Once Supabase keys go in js/config.js, chat works for real between players.',
      'Nice! Messages pop up instantly here, just like Facebook chat used to.',
    ];
    const n = db().messages.filter((m) => m.sender_id === BOT && m.recipient_id === to).length;
    const reply = /hi|hey|hello|yo/i.test(text) && n === 0 ? lines[0] : lines[Math.min(n, lines.length - 1)];
    setTimeout(() => liveHandlers?.onTyping(BOT), 400);
    setTimeout(() => {
      const d = db();
      const msg = { id: ++d.seq, sender_id: BOT, recipient_id: to, body: reply, created_at: now(), read_at: null };
      d.messages.push(msg); save(d);
      if (me?.id === to) liveHandlers?.onMessage(msg);
    }, 1600);
  }

  const api = {
    mode: 'demo',

    async init() { return refreshMe(); },
    me: () => me,
    onAuthChange(cb) { authCb = cb; },
    async usernameAvailable(name) {
      return !db().users.some((u) => u.username.toLowerCase() === name.toLowerCase());
    },
    async signUp({ username, email, password }) {
      await delay();
      const d = db();
      if (!(await api.usernameAvailable(username))) throw new Error('That username is taken.');
      if (d.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('That email already has an account.');
      const id = 'u-' + (++d.seq);
      d.users.push({ id, username, role: 'member', avatar_color: '#b3131b', bio: '', signature: '', status: 'active',
        game_username: null, created_at: now(), last_seen: now(), email, password });
      // Demo only: everyone starts as friends with ShadowBot so the chat has someone in it.
      d.requests.push({ id: ++d.seq, from_id: BOT, to_id: id, status: 'accepted', created_at: now(), responded_at: now() });
      save(d);
      sessionStorage.setItem('sod_demo_uid', id);
      refreshMe(); authCb?.(me);
      return { needsConfirm: false };
    },
    async signIn({ login, password }) {
      await delay();
      const l = login.trim().toLowerCase();
      const u = db().users.find((x) => (x.email.toLowerCase() === l || x.username.toLowerCase() === l) && x.id !== BOT);
      if (!u || u.password !== password) throw new Error('Wrong email or password.');
      sessionStorage.setItem('sod_demo_uid', u.id);
      refreshMe(); authCb?.(me);
      return me;
    },
    async signOut() { emit({ type: 'bye', uid: me?.id }); sessionStorage.removeItem('sod_demo_uid'); me = null; authCb?.(null); },
    async resetPassword() { await delay(); },
    async changePassword(password) {
      need(); const d = db(); d.users.find((u) => u.id === me.id).password = password; save(d);
    },
    async changeEmail(email) {
      need(); const d = db(); d.users.find((u) => u.id === me.id).email = email; save(d); me.email = email;
    },
    async finishSignup(email) {
      need(); const d = db(); const u = d.users.find((x) => x.id === me.id);
      u.email = email; u.status = 'active'; save(d); refreshMe();
      return { needsConfirm: false };
    },

    async profile(username) { await delay(20); return pub(db().users.find((u) => u.username.toLowerCase() === username.toLowerCase())); },
    async profilesByIds(ids) { const d = db(); return ids.map((id) => prof(d, id)).filter(Boolean); },
    async updateProfile(fields) {
      need();
      const d = db();
      if (fields.username && d.users.some((u) => u.id !== me.id && u.username.toLowerCase() === fields.username.toLowerCase()))
        throw new Error('That username is taken.');
      const u = d.users.find((x) => x.id === me.id);
      ['username', 'bio', 'signature', 'avatar_color'].forEach((k) => { if (k in fields) u[k] = fields[k]; });
      save(d); refreshMe();
      return pub(u);
    },
    async setRole(id, role) {
      if (me?.role !== 'owner') throw new Error('Only the owner can change ranks.');
      const d = db(); d.users.find((u) => u.id === id).role = role; save(d);
    },
    async setBanned(id, banned) {
      if (!isStaff()) throw new Error('Staff only.');
      const d = db(); d.users.find((u) => u.id === id).status = banned ? 'banned' : 'active'; save(d);
    },
    async members({ search = '', page: p = 0, size = 30 } = {}) {
      await delay(20);
      const rows = db().users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.created_at.localeCompare(a.created_at)).map(pub);
      return page(rows, p, size);
    },
    async touch() {},

    async forumIndex() {
      await delay(20);
      const d = db();
      return d.categories.map((c) => {
        const ts = d.threads.filter((t) => t.category_id === c.id).map((t) => threadView(d, t))
          .sort((a, b) => b.last_post_at.localeCompare(a.last_post_at));
        const lt = ts[0];
        return { ...c, thread_count: ts.length, post_count: ts.reduce((n, t) => n + t.reply_count + 1, 0),
          last_thread_id: lt?.id, last_thread_title: lt?.title, last_post_at: lt?.last_post_at, last_post_username: lt?.last_poster?.username };
      });
    },
    async category(id) { return db().categories.find((c) => c.id === +id); },
    async threads(catId, p = 0, size = 25) {
      await delay(20);
      const d = db();
      const rows = d.threads.filter((t) => t.category_id === +catId).map((t) => threadView(d, t))
        .sort((a, b) => (b.pinned - a.pinned) || b.last_post_at.localeCompare(a.last_post_at));
      return page(rows, p, size);
    },
    async recentThreads(n = 6, catId) {
      const d = db();
      return d.threads.filter((t) => !catId || t.category_id === catId).map((t) => ({ ...threadView(d, t),
        category: d.categories.find((c) => c.id === t.category_id) }))
        .sort((a, b) => catId ? b.created_at.localeCompare(a.created_at) : b.last_post_at.localeCompare(a.last_post_at)).slice(0, n);
    },
    async threadsBy(userId, n = 10) {
      const d = db();
      return d.threads.filter((t) => t.author_id === userId).map((t) => ({ ...threadView(d, t),
        category: d.categories.find((c) => c.id === t.category_id) }))
        .sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, n);
    },
    async thread(id) {
      await delay(20);
      const d = db();
      const t = d.threads.find((x) => x.id === +id);
      if (!t) return null;
      t.view_count++; save(d);
      return { ...threadView(d, t), category: d.categories.find((c) => c.id === t.category_id) };
    },
    async posts(threadId, p = 0, size = 15) {
      const d = db();
      const rows = d.posts.filter((x) => x.thread_id === +threadId).sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((x) => ({ ...x, author: prof(d, x.author_id) }));
      return page(rows, p, size);
    },
    async postCounts(ids) {
      const d = db();
      return Object.fromEntries(ids.map((id) => [id, d.posts.filter((p) => p.author_id === id).length]));
    },
    async createThread(catId, title, body) {
      need(); await delay();
      const d = db();
      if (d.categories.find((c) => c.id === +catId)?.staff_only && !isStaff()) throw new Error('Only staff can start threads in this forum.');
      const id = ++d.seq;
      d.threads.push({ id, category_id: +catId, author_id: me.id, title: title.trim(), pinned: false, locked: false, view_count: 0, created_at: now() });
      d.posts.push({ id: ++d.seq, thread_id: id, author_id: me.id, body, created_at: now(), edited_at: null });
      save(d);
      return id;
    },
    async reply(threadId, body) {
      need(); await delay();
      const d = db();
      if (d.threads.find((t) => t.id === +threadId)?.locked && !isStaff()) throw new Error('This thread is locked.');
      const post = { id: ++d.seq, thread_id: +threadId, author_id: me.id, body, created_at: now(), edited_at: null };
      d.posts.push(post); save(d);
      return post;
    },
    async editPost(id, body) {
      need(); const d = db(); const p = d.posts.find((x) => x.id === id);
      if (p.author_id !== me.id && !isStaff()) throw new Error('Not your post.');
      p.body = body; p.edited_at = now(); save(d);
    },
    async deletePost(id) {
      need(); const d = db(); const p = d.posts.find((x) => x.id === id);
      if (p.author_id !== me.id && !isStaff()) throw new Error('Not your post.');
      d.posts = d.posts.filter((x) => x.id !== id); save(d);
    },
    async setThread(id, fields) {
      if (!isStaff()) throw new Error('Staff only.');
      const d = db(); Object.assign(d.threads.find((t) => t.id === id), fields); save(d);
    },
    async deleteThread(id) {
      need(); const d = db();
      const t = threadView(d, d.threads.find((x) => x.id === id));
      if (!isStaff() && !(t.author_id === me.id && t.reply_count === 0)) throw new Error('Only staff can delete threads with replies.');
      d.threads = d.threads.filter((x) => x.id !== id); d.posts = d.posts.filter((p) => p.thread_id !== id); save(d);
    },
    async stats() {
      const d = db();
      const newest = [...d.users].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      return { members: d.users.length, threads: d.threads.length, posts: d.posts.length, newest: pub(newest) };
    },

    async feed({ wallOwner, page: p = 0, size = 15 } = {}) {
      await delay(20);
      const d = db();
      return d.wall.filter((w) => !wallOwner || w.wall_owner_id === wallOwner)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(p * size, p * size + size)
        .map((w) => {
          const likes = d.likes.filter((l) => l.post_id === w.id);
          const comments = d.comments.filter((c) => c.post_id === w.id).sort((a, b) => a.created_at.localeCompare(b.created_at))
            .map((c) => ({ ...c, author: prof(d, c.author_id) }));
          return { ...w, author: prof(d, w.author_id), wall_owner: prof(d, w.wall_owner_id), like_count: likes.length,
            liked_by_me: !!me && likes.some((l) => l.user_id === me.id), comment_count: comments.length, comments };
        });
    },
    async createWallPost(body, wallOwnerId) {
      need(); const d = db();
      const owner = wallOwnerId || me.id;
      if (owner !== me.id && !areFriends(d, me.id, owner)) throw new Error('You can only post on your friends\' walls.');
      d.wall.push({ id: ++d.seq, author_id: me.id, wall_owner_id: owner, body, created_at: now() }); save(d);
    },
    async deleteWallPost(id) {
      need(); const d = db(); const w = d.wall.find((x) => x.id === id);
      if (![w.author_id, w.wall_owner_id].includes(me.id) && !isStaff()) throw new Error('Not your post.');
      d.wall = d.wall.filter((x) => x.id !== id); save(d);
    },
    async like(postId, on) {
      need(); const d = db();
      d.likes = d.likes.filter((l) => !(l.post_id === postId && l.user_id === me.id));
      if (on) d.likes.push({ post_id: postId, user_id: me.id });
      save(d);
    },
    async comment(postId, body) {
      need(); const d = db(); d.comments.push({ id: ++d.seq, post_id: postId, author_id: me.id, body, created_at: now() }); save(d);
    },
    async deleteComment(id) {
      need(); const d = db(); d.comments = d.comments.filter((c) => c.id !== id); save(d);
    },

    async friends() {
      if (!me) return [];
      const d = db();
      return d.requests.filter((r) => r.status === 'accepted' && (r.from_id === me.id || r.to_id === me.id))
        .map((r) => ({ id: r.id, since: r.responded_at, profile: prof(d, r.from_id === me.id ? r.to_id : r.from_id) }))
        .filter((f) => f.profile).sort((a, b) => a.profile.username.localeCompare(b.profile.username));
    },
    async requests() {
      if (!me) return { incoming: [], outgoing: [] };
      const d = db();
      const rows = d.requests.filter((r) => r.status === 'pending').map((r) => ({ ...r, from: prof(d, r.from_id), to: prof(d, r.to_id) }));
      return { incoming: rows.filter((r) => r.to_id === me.id), outgoing: rows.filter((r) => r.from_id === me.id) };
    },
    async relation(otherId) {
      const r = db().requests.find((x) => (x.from_id === me.id && x.to_id === otherId) || (x.from_id === otherId && x.to_id === me.id));
      if (!r) return { state: 'none' };
      if (r.status === 'accepted') return { state: 'friends', id: r.id };
      return { state: r.from_id === me.id ? 'sent' : 'received', id: r.id };
    },
    async sendRequest(toId) {
      need(); const d = db();
      if ((await api.relation(toId)).state !== 'none') throw new Error('There is already a friend request between you two.');
      d.requests.push({ id: ++d.seq, from_id: me.id, to_id: toId, status: 'pending', created_at: now(), responded_at: null });
      save(d); emit({ type: 'friends', ids: [toId] });
      if (toId === BOT) setTimeout(() => api.acceptRequest(d.seq, true), 800);
    },
    async acceptRequest(id, asBot) {
      const d = db(); const r = d.requests.find((x) => x.id === id);
      if (!r || (!asBot && r.to_id !== me?.id)) throw new Error('Request not found.');
      r.status = 'accepted'; r.responded_at = now(); save(d);
      emit({ type: 'friends', ids: [r.from_id, r.to_id] });
      if (asBot) liveHandlers?.onFriends();
    },
    async removeRequest(id) {
      const d = db(); const r = d.requests.find((x) => x.id === id);
      if (!r) return;
      d.requests = d.requests.filter((x) => x.id !== id); save(d);
      emit({ type: 'friends', ids: [r.from_id, r.to_id] });
    },

    async conversation(friendId, limit = 50) {
      const d = db();
      return d.messages.filter((m) => (m.sender_id === me.id && m.recipient_id === friendId) || (m.sender_id === friendId && m.recipient_id === me.id))
        .sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(-limit);
    },
    async send(friendId, body) {
      need(); const d = db();
      if (!areFriends(d, me.id, friendId)) throw new Error('You can only message friends.');
      const msg = { id: ++d.seq, sender_id: me.id, recipient_id: friendId, body, created_at: now(), read_at: null };
      d.messages.push(msg); save(d);
      emit({ type: 'msg', msg });
      if (friendId === BOT) botReply(me.id, body);
      return msg;
    },
    async markRead(friendId) {
      const d = db(); let changed = false;
      d.messages.forEach((m) => { if (m.recipient_id === me.id && m.sender_id === friendId && !m.read_at) { m.read_at = now(); changed = true; } });
      if (changed) save(d);
    },
    async conversations() {
      const d = db(); const map = {};
      d.messages.filter((m) => m.sender_id === me.id || m.recipient_id === me.id)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)).forEach((m) => {
          const partner = m.sender_id === me.id ? m.recipient_id : m.sender_id;
          const c = map[partner] || (map[partner] = { partner: prof(d, partner), unread: 0 });
          c.last_body = m.body; c.last_at = m.created_at; c.last_from_me = m.sender_id === me.id;
          if (m.recipient_id === me.id && !m.read_at) c.unread++;
        });
      return Object.values(map).filter((c) => c.partner).sort((a, b) => b.last_at.localeCompare(a.last_at));
    },

    startLive(handlers) {
      liveHandlers = handlers;
      if (me) emit({ type: 'hb', uid: me.id });
      setTimeout(pushPresence, 50);
    },
    async stopLive() { liveHandlers = null; },
    typing(toId) { if (me) emit({ type: 'typing', from: me.id, to: toId }); },

    resetDemo() { localStorage.removeItem(KEY); sessionStorage.removeItem('sod_demo_uid'); location.reload(); },
  };
  return api;
};
