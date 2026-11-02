// Real backend: Supabase (accounts, database, live chat).
// Every call returns plain objects in the same shape as backend-demo.js.
window.makeSupabaseBackend = (cfg) => {
  const sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  const P = 'id,username,avatar_color,bio,signature,role,status,game_username,created_at,last_seen,'
    + 'game:game_accounts!linked_profile(game_username,display_name,staff_rank,donator_rank,donator_color,combat_level,total_level,time_played_min,online,last_seen)';
  const gameKey = (name) => name.trim().toLowerCase().replace(/ /g, '_');
  const GAME_DOMAIN = 'players.shadowofdeath.invalid';
  let me = null;           // my profile
  let live = null;         // realtime channel (presence + typing)
  let inbox = null;        // realtime channel (my messages / friend requests)

  const ok = ({ data, error }) => { if (error) throw error; return data; };
  const uid = () => me?.id;

  async function loadMe(session) {
    me = session ? ok(await sb.from('profiles').select(P).eq('id', session.user.id).single()) : null;
    if (me) me.email = session.user.email;
    return me;
  }

  const api = {
    mode: 'live',

    // ---------- accounts ----------
    async init() {
      const { data } = await sb.auth.getSession();
      return loadMe(data.session);
    },
    me: () => me,
    onAuthChange(cb) {
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'TOKEN_REFRESHED') return;
        setTimeout(async () => cb(await loadMe(session).catch(() => null), event), 0);
      });
    },
    async usernameAvailable(name) {
      return (await api.usernameStatus(name)) === 'free';
    },
    // 'free', 'taken', or 'game' (held for the Shadow of Death player with that name)
    async usernameStatus(name) {
      return ok(await sb.rpc('username_status', { p_username: name }));
    },
    async signUp({ username, email, password, linkCode }) {
      const status = await api.usernameStatus(username);
      if (status === 'taken') throw new Error('That username is taken.');
      const code = (linkCode || '').trim().toUpperCase();
      if (status === 'game' && !code)
        throw new Error('That name belongs to a Shadow of Death player. If it\'s you, type ::forums in-game and enter the code.');
      if (code) {
        const game = ok(await sb.rpc('check_link_code', { p_code: code }));
        if (!game) throw new Error('That game code is wrong or has run out. Type ::forums in-game for a new one.');
        if (status === 'game' && game !== gameKey(username)) throw new Error('That code is for a different game account.');
      }
      const meta = code ? { username, link_code: code } : { username };
      const data = ok(await sb.auth.signUp({ email, password, options: { data: meta } }));
      if (!data.session) return { needsConfirm: true };
      await loadMe(data.session);
      return { needsConfirm: false };
    },
    async signIn({ login, password }) {
      // Game-made accounts (future) log in with their game name.
      const email = login.includes('@') ? login : `${login.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')}@${GAME_DOMAIN}`;
      const res = await sb.auth.signInWithPassword({ email, password });
      if (res.error) {
        if (!login.includes('@')) throw new Error('Log in with the email address you signed up with.');
        throw new Error(res.error.message === 'Invalid login credentials' ? 'Wrong email or password.' : res.error.message);
      }
      return loadMe(res.data.session);
    },
    async signOut() { await api.stopLive(); await sb.auth.signOut(); me = null; },
    async resetPassword(email) {
      ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }));
    },
    async changePassword(password) { ok(await sb.auth.updateUser({ password })); },
    async changeEmail(email) { ok(await sb.auth.updateUser({ email })); },
    async finishSignup(email) {
      const data = ok(await sb.auth.updateUser({ email }));
      if (data.user.email && !data.user.email.endsWith(GAME_DOMAIN)) {
        ok(await sb.from('profiles').update({ status: 'active' }).eq('id', uid()));
        me.status = 'active';
        return { needsConfirm: false };
      }
      return { needsConfirm: true };   // Supabase emailed a confirmation link
    },

    // ---------- profiles ----------
    async profile(username) {
      return ok(await sb.from('profiles').select(P).eq('username', username).maybeSingle());
    },
    async profilesByIds(ids) {
      if (!ids.length) return [];
      return ok(await sb.from('profiles').select(P).in('id', [...new Set(ids)]));
    },
    async updateProfile(fields) {
      const row = ok(await sb.from('profiles').update(fields).eq('id', uid()).select(P).single());
      Object.assign(me, row);
      return row;
    },
    async setRole(id, role) { ok(await sb.from('profiles').update({ role }).eq('id', id)); },
    async setBanned(id, banned) { ok(await sb.from('profiles').update({ status: banned ? 'banned' : 'active' }).eq('id', id)); },
    async members({ search = '', page = 0, size = 30 } = {}) {
      let q = sb.from('profiles').select(P, { count: 'exact' }).order('created_at', { ascending: false }).range(page * size, page * size + size - 1);
      if (search) q = q.ilike('username', `%${search.replace(/[%_]/g, '')}%`);
      const { data, error, count } = await q;
      if (error) throw error;
      return { rows: data, total: count };
    },
    // ---------- game link ----------
    async linkGame(code) {
      const name = ok(await sb.rpc('link_game_account', { p_code: code.trim().toUpperCase() }));
      await loadMe((await sb.auth.getSession()).data.session);
      return name;
    },
    async unlinkGame() {
      ok(await sb.rpc('unlink_game_account'));
      await loadMe((await sb.auth.getSession()).data.session);
    },
    async serverStatus() {
      const { data } = await sb.from('server_status').select('*').eq('id', 1).maybeSingle();
      return data;
    },

    async touch() { if (me) await sb.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', uid()); },

    // ---------- forums ----------
    async forumIndex() { return ok(await sb.from('forum_overview').select('*').order('sort')); },
    async category(id) { return ok(await sb.from('forum_categories').select('*').eq('id', id).single()); },
    async threads(catId, page = 0, size = 25) {
      const { data, error, count } = await sb.from('forum_threads')
        .select(`*, author:profiles!author_id(${P}), last_poster:profiles!last_post_by(${P})`, { count: 'exact' })
        .eq('category_id', catId).order('pinned', { ascending: false }).order('last_post_at', { ascending: false })
        .range(page * size, page * size + size - 1);
      if (error) throw error;
      return { rows: data, total: count };
    },
    async recentThreads(n = 6, catId) {
      let q = sb.from('forum_threads')
        .select(`*, author:profiles!author_id(${P}), last_poster:profiles!last_post_by(${P}), category:forum_categories(id,name)`)
        .order(catId ? 'created_at' : 'last_post_at', { ascending: false }).limit(n);
      if (catId) q = q.eq('category_id', catId);
      return ok(await q);
    },
    async threadsBy(userId, n = 10) {
      return ok(await sb.from('forum_threads').select('*, category:forum_categories(id,name)')
        .eq('author_id', userId).order('created_at', { ascending: false }).limit(n));
    },
    async thread(id) {
      sb.rpc('bump_thread_view', { p_thread: id }).then(() => {});
      return ok(await sb.from('forum_threads')
        .select(`*, author:profiles!author_id(${P}), category:forum_categories(*)`).eq('id', id).maybeSingle());
    },
    async posts(threadId, page = 0, size = 15) {
      const { data, error, count } = await sb.from('forum_posts')
        .select(`*, author:profiles!author_id(${P})`, { count: 'exact' })
        .eq('thread_id', threadId).order('created_at').range(page * size, page * size + size - 1);
      if (error) throw error;
      return { rows: data, total: count };
    },
    async postCounts(ids) {
      const rows = ok(await sb.rpc('post_counts', { p_ids: [...new Set(ids)] }));
      return Object.fromEntries(rows.map((r) => [r.author_id, Number(r.n)]));
    },
    async createThread(catId, title, body) {
      return ok(await sb.rpc('create_thread', { p_category: catId, p_title: title, p_body: body }));
    },
    async reply(threadId, body) {
      return ok(await sb.from('forum_posts').insert({ thread_id: threadId, author_id: uid(), body }).select().single());
    },
    async editPost(id, body) { ok(await sb.from('forum_posts').update({ body }).eq('id', id)); },
    async deletePost(id) { ok(await sb.from('forum_posts').delete().eq('id', id)); },
    async setThread(id, fields) { ok(await sb.from('forum_threads').update(fields).eq('id', id)); },
    async deleteThread(id) { ok(await sb.from('forum_threads').delete().eq('id', id)); },
    async stats() {
      const [m, t, p] = await Promise.all([
        sb.from('profiles').select('id', { count: 'exact', head: true }),
        sb.from('forum_threads').select('id', { count: 'exact', head: true }),
        sb.from('forum_posts').select('id', { count: 'exact', head: true }),
      ]);
      const newest = ok(await sb.from('profiles').select(P).order('created_at', { ascending: false }).limit(1));
      return { members: m.count || 0, threads: t.count || 0, posts: p.count || 0, newest: newest[0] };
    },

    // ---------- public posts ----------
    async feed({ wallOwner, page = 0, size = 15 } = {}) {
      let q = sb.from('wall_posts')
        .select(`*, author:profiles!author_id(${P}), wall_owner:profiles!wall_owner_id(${P}),
                 comments:wall_comments(*, author:profiles!author_id(${P}))`)
        .order('created_at', { ascending: false }).range(page * size, page * size + size - 1);
      if (wallOwner) q = q.eq('wall_owner_id', wallOwner);
      const rows = ok(await q);
      let liked = new Set();
      if (me && rows.length) {
        const likes = ok(await sb.from('wall_likes').select('post_id').eq('user_id', uid()).in('post_id', rows.map((r) => r.id)));
        liked = new Set(likes.map((l) => l.post_id));
      }
      rows.forEach((r) => {
        r.liked_by_me = liked.has(r.id);
        r.comments.sort((a, b) => a.created_at.localeCompare(b.created_at));
      });
      return rows;
    },
    async createWallPost(body, wallOwnerId) {
      ok(await sb.from('wall_posts').insert({ author_id: uid(), wall_owner_id: wallOwnerId || uid(), body }));
    },
    async deleteWallPost(id) { ok(await sb.from('wall_posts').delete().eq('id', id)); },
    async like(postId, on) {
      if (on) ok(await sb.from('wall_likes').insert({ post_id: postId, user_id: uid() }));
      else ok(await sb.from('wall_likes').delete().eq('post_id', postId).eq('user_id', uid()));
    },
    async comment(postId, body) { ok(await sb.from('wall_comments').insert({ post_id: postId, author_id: uid(), body })); },
    async deleteComment(id) { ok(await sb.from('wall_comments').delete().eq('id', id)); },

    // ---------- friends ----------
    async friendRows() {
      const rows = ok(await sb.from('friend_requests').select(`*, from:profiles!from_id(${P}), to:profiles!to_id(${P})`));
      return rows;
    },
    async friends() {
      return (await api.friendRows()).filter((r) => r.status === 'accepted')
        .map((r) => ({ profile: r.from_id === uid() ? r.to : r.from, since: r.responded_at || r.created_at, id: r.id }))
        .sort((a, b) => a.profile.username.localeCompare(b.profile.username));
    },
    async requests() {
      const rows = (await api.friendRows()).filter((r) => r.status === 'pending');
      return { incoming: rows.filter((r) => r.to_id === uid()), outgoing: rows.filter((r) => r.from_id === uid()) };
    },
    async relation(otherId) {
      const rows = ok(await sb.from('friend_requests').select('*')
        .or(`and(from_id.eq.${uid()},to_id.eq.${otherId}),and(from_id.eq.${otherId},to_id.eq.${uid()})`));
      const r = rows[0];
      if (!r) return { state: 'none' };
      if (r.status === 'accepted') return { state: 'friends', id: r.id };
      return { state: r.from_id === uid() ? 'sent' : 'received', id: r.id };
    },
    async sendRequest(toId) {
      const res = await sb.from('friend_requests').insert({ from_id: uid(), to_id: toId });
      if (res.error?.code === '23505') throw new Error('There is already a friend request between you two.');
      ok(res);
    },
    async acceptRequest(id) { ok(await sb.from('friend_requests').update({ status: 'accepted' }).eq('id', id)); },
    async removeRequest(id) { ok(await sb.from('friend_requests').delete().eq('id', id)); },

    // ---------- messages ----------
    async conversation(friendId, limit = 50) {
      const rows = ok(await sb.from('messages').select('*')
        .or(`and(sender_id.eq.${uid()},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${uid()})`)
        .order('created_at', { ascending: false }).limit(limit));
      return rows.reverse();
    },
    async send(friendId, body) {
      return ok(await sb.from('messages').insert({ sender_id: uid(), recipient_id: friendId, body }).select().single());
    },
    async markRead(friendId) { ok(await sb.rpc('mark_read', { p_friend: friendId })); },
    async conversations() {
      const rows = ok(await sb.rpc('my_conversations'));
      const profs = await api.profilesByIds(rows.map((r) => r.partner_id));
      const byId = Object.fromEntries(profs.map((p) => [p.id, p]));
      return rows.map((r) => ({ partner: byId[r.partner_id], last_body: r.last_body, last_at: r.last_at,
        last_from_me: r.last_from_me, unread: Number(r.unread) })).filter((r) => r.partner);
    },

    // ---------- live: who's online, typing, new messages ----------
    async startLive({ onPresence, onTyping, onMessage, onFriends }) {
      await api.stopLive();
      live = sb.channel('sod-live', { config: { presence: { key: uid() || 'guest-' + Math.random().toString(36).slice(2) } } });
      live.on('presence', { event: 'sync' }, () => {
        onPresence(new Set(Object.keys(live.presenceState()).filter((k) => !k.startsWith('guest-'))));
      });
      live.on('broadcast', { event: 'typing' }, ({ payload }) => { if (payload.to === uid()) onTyping(payload.from); });
      live.subscribe(async (s) => { if (s === 'SUBSCRIBED' && me) await live.track({ at: Date.now() }); });
      if (me) {
        inbox = sb.channel('inbox-' + uid())
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=eq.${uid()}` },
            (p) => onMessage(p.new))
          .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests', filter: `to_id=eq.${uid()}` }, () => onFriends())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests', filter: `from_id=eq.${uid()}` }, () => onFriends())
          .subscribe();
      }
    },
    async stopLive() {
      if (live) { await sb.removeChannel(live); live = null; }
      if (inbox) { await sb.removeChannel(inbox); inbox = null; }
    },
    typing(toId) { live?.send({ type: 'broadcast', event: 'typing', payload: { from: uid(), to: toId } }); },
  };
  return api;
};
