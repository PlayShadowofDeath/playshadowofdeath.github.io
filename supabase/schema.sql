-- =====================================================================
--  SHADOW OF DEATH WEBSITE - DATABASE
--  Run this ONCE in Supabase:  SQL Editor  >  New query  >  paste ALL  >  Run
--  It is safe to run again later (it skips things that already exist).
--
--  Security model: the website only ever holds the PUBLIC "anon" key.
--  Every table has Row Level Security (RLS) turned on, and the rules
--  below decide who may read / write what. Never put the secret
--  "service_role" key in the website.
-- =====================================================================

create extension if not exists citext;

-- ---------------------------------------------------------------------
--  PROFILES (one per account, created automatically on sign-up)
--
--  status:
--    active      normal account
--    incomplete  made automatically by the game server (future feature):
--                the player logs in on the site and finishes sign-up
--                (adds a real email), which turns it into 'active'
--    banned      can read but not post
--  game_username: the in-game name this account is linked to (future).
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      citext not null unique check (username ~ '^[A-Za-z0-9_ -]{3,12}$'),
  avatar_color  text not null default '#b3131b' check (avatar_color ~ '^#[0-9a-fA-F]{6}$'),
  bio           text not null default '' check (char_length(bio) <= 500),
  signature     text not null default '' check (char_length(signature) <= 200),
  role          text not null default 'member' check (role in ('member','moderator','admin','owner')),
  status        text not null default 'active' check (status in ('active','incomplete','banned')),
  game_username citext unique,
  created_at    timestamptz not null default now(),
  last_seen     timestamptz not null default now()
);

-- Email address used for accounts the game server creates (future).
-- The player replaces it with their real email when they finish sign-up.
create or replace function public.game_email_domain() returns text
language sql immutable as $$ select 'players.shadowofdeath.invalid' $$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''),
                           'user' || substr(replace(new.id::text, '-', ''), 1, 8)));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_staff(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = uid and role in ('moderator','admin','owner'));
$$;

create or replace function public.is_active(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = uid and status = 'active');
$$;

-- Stops members giving themselves a rank, un-banning themselves, etc.
-- Only the owner can change ranks. Mods/admins can ban/unban members.
-- (Changes made in the SQL Editor or by the game server always work.)
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
declare actor_role text;
begin
  if auth.uid() is null then return new; end if;
  select role into actor_role from profiles where id = auth.uid();
  new.id := old.id;
  new.created_at := old.created_at;
  if actor_role = 'owner' then return new; end if;
  new.role := old.role;
  new.game_username := old.game_username;
  if new.status is distinct from old.status then
    if auth.uid() = old.id and old.status = 'incomplete' and new.status = 'active'
       and (select email from auth.users where id = old.id) not like '%@' || game_email_domain() then
      null;  -- finishing sign-up after adding a real email
    elsif actor_role in ('moderator','admin') and old.role = 'member'
       and old.status in ('active','banned') and new.status in ('active','banned') then
      null;  -- staff ban / unban
    else
      new.status := old.status;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

alter table public.profiles enable row level security;
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles for select using (true);
drop policy if exists "edit own profile" on public.profiles;
create policy "edit own profile" on public.profiles for update
  using (auth.uid() = id or public.is_staff()) with check (auth.uid() = id or public.is_staff());

-- Lets the sign-up form check a name is free before creating the account.
create or replace function public.username_available(p_username text) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (select 1 from profiles where username = p_username::citext);
$$;

-- ---------------------------------------------------------------------
--  FORUMS
-- ---------------------------------------------------------------------
create table if not exists public.forum_categories (
  id          serial primary key,
  section     text not null default 'Community',
  name        text not null,
  description text not null default '',
  icon        text not null default '💬',
  sort        int  not null default 0,
  staff_only  boolean not null default false   -- only staff can start threads here
);

create table if not exists public.forum_threads (
  id           bigserial primary key,
  category_id  int  not null references public.forum_categories(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null check (char_length(title) between 3 and 100),
  pinned       boolean not null default false,
  locked       boolean not null default false,
  reply_count  int not null default 0,
  view_count   int not null default 0,
  last_post_at timestamptz not null default now(),
  last_post_by uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists forum_threads_cat on public.forum_threads (category_id, pinned desc, last_post_at desc);

create table if not exists public.forum_posts (
  id         bigserial primary key,
  thread_id  bigint not null references public.forum_threads(id) on delete cascade,
  author_id  uuid   not null references public.profiles(id) on delete cascade,
  body       text   not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  edited_at  timestamptz
);
create index if not exists forum_posts_thread on public.forum_posts (thread_id, created_at);
create index if not exists forum_posts_author on public.forum_posts (author_id);

-- Keeps reply counts / "last post" up to date, and slows down spammers.
create or replace function public.forum_post_changed() returns trigger
language plpgsql security definer set search_path = public as $$
declare tid bigint := coalesce(new.thread_id, old.thread_id);
begin
  if tg_op = 'INSERT' and auth.uid() is not null and not is_staff() and
     (select count(*) from forum_posts where author_id = new.author_id and created_at > now() - interval '1 minute') > 6 then
    raise exception 'You are posting too fast. Wait a minute and try again.';
  end if;
  update forum_threads t set
    reply_count  = greatest((select count(*) from forum_posts p where p.thread_id = tid) - 1, 0),
    last_post_at = coalesce((select max(created_at) from forum_posts p where p.thread_id = tid), t.created_at),
    last_post_by = coalesce((select author_id from forum_posts p where p.thread_id = tid order by created_at desc limit 1), t.author_id)
  where t.id = tid;
  return null;
end $$;

drop trigger if exists forum_post_changed on public.forum_posts;
create trigger forum_post_changed after insert or delete on public.forum_posts
  for each row execute function public.forum_post_changed();

-- Editing a post: body only, and it gets an "edited" time.
create or replace function public.forum_post_edit() returns trigger
language plpgsql as $$
begin
  new.thread_id := old.thread_id; new.author_id := old.author_id; new.created_at := old.created_at;
  new.edited_at := now();
  return new;
end $$;
drop trigger if exists forum_post_edit on public.forum_posts;
create trigger forum_post_edit before update on public.forum_posts
  for each row execute function public.forum_post_edit();

alter table public.forum_categories enable row level security;
alter table public.forum_threads    enable row level security;
alter table public.forum_posts      enable row level security;

drop policy if exists "read categories" on public.forum_categories;
create policy "read categories" on public.forum_categories for select using (true);

drop policy if exists "read threads" on public.forum_threads;
create policy "read threads" on public.forum_threads for select using (true);
drop policy if exists "staff manage threads" on public.forum_threads;
create policy "staff manage threads" on public.forum_threads for update using (public.is_staff());
drop policy if exists "delete threads" on public.forum_threads;
create policy "delete threads" on public.forum_threads for delete
  using (public.is_staff() or (author_id = auth.uid() and reply_count = 0));

drop policy if exists "read posts" on public.forum_posts;
create policy "read posts" on public.forum_posts for select using (true);
drop policy if exists "reply to threads" on public.forum_posts;
create policy "reply to threads" on public.forum_posts for insert with check (
  author_id = auth.uid() and public.is_active()
  and (public.is_staff() or not exists (select 1 from public.forum_threads t where t.id = thread_id and t.locked)));
drop policy if exists "edit own posts" on public.forum_posts;
create policy "edit own posts" on public.forum_posts for update
  using (author_id = auth.uid() or public.is_staff());
drop policy if exists "delete own posts" on public.forum_posts;
create policy "delete own posts" on public.forum_posts for delete
  using (author_id = auth.uid() or public.is_staff());

-- Starting a thread = thread + first post in one go.
create or replace function public.create_thread(p_category int, p_title text, p_body text) returns bigint
language plpgsql security definer set search_path = public as $$
declare tid bigint;
begin
  if auth.uid() is null or not is_active() then
    raise exception 'Log in with a finished account to post.';
  end if;
  if (select staff_only from forum_categories where id = p_category) and not is_staff() then
    raise exception 'Only staff can start threads in this forum.';
  end if;
  if not is_staff() and (select count(*) from forum_threads where author_id = auth.uid()
                          and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'You have started a lot of threads. Wait a few minutes.';
  end if;
  insert into forum_threads (category_id, author_id, title, last_post_by)
    values (p_category, auth.uid(), trim(p_title), auth.uid()) returning id into tid;
  insert into forum_posts (thread_id, author_id, body) values (tid, auth.uid(), p_body);
  return tid;
end $$;

create or replace function public.bump_thread_view(p_thread bigint) returns void
language sql security definer set search_path = public as $$
  update forum_threads set view_count = view_count + 1 where id = p_thread;
$$;

-- Forum post counts shown beside each post.
create or replace function public.post_counts(p_ids uuid[]) returns table (author_id uuid, n bigint)
language sql stable security definer set search_path = public as $$
  select author_id, count(*) from forum_posts where author_id = any(p_ids) group by author_id;
$$;

-- The forum index: every category with its counts and latest post.
create or replace view public.forum_overview with (security_invoker = on) as
select c.id, c.section, c.name, c.description, c.icon, c.sort, c.staff_only,
  (select count(*) from public.forum_threads t where t.category_id = c.id) as thread_count,
  (select coalesce(sum(t.reply_count + 1), 0) from public.forum_threads t where t.category_id = c.id) as post_count,
  lt.id as last_thread_id, lt.title as last_thread_title, lt.last_post_at,
  lp.username::text as last_post_username
from public.forum_categories c
left join lateral (select * from public.forum_threads t where t.category_id = c.id
                   order by t.last_post_at desc limit 1) lt on true
left join public.profiles lp on lp.id = lt.last_post_by;

-- Starting categories (only added if there are none yet).
insert into public.forum_categories (section, name, description, icon, sort, staff_only)
select * from (values
  ('Shadow of Death', 'Announcements',        'Official news from the Shadow of Death team.',             '📢', 10, true),
  ('Shadow of Death', 'Updates & Patch Notes','Every new feature, change and fix.',                       '📜', 20, true),
  ('Shadow of Death', 'Events',               'Double XP weekends, boss events, competitions.',           '🎉', 30, false),
  ('Community',       'General Discussion',   'Talk about anything Shadow of Death.',                     '💬', 40, false),
  ('Community',       'Introductions',        'New here? Say hello!',                                     '👋', 50, false),
  ('Community',       'Drops & Achievements', 'Show off your best drops, maxed stats and pets.',          '🏆', 60, false),
  ('Community',       'Off-topic',            'Anything not about the game.',                             '☕', 70, false),
  ('Game',            'Guides',               'Money making, bossing, skilling and starter guides.',      '📖', 80, false),
  ('Game',            'Suggestions',          'Ideas to make Shadow of Death better.',                    '💡', 90, false),
  ('Game',            'Buying & Selling',     'Trade items and gold with other players.',                 '💰', 100, false),
  ('Support',         'Help & Questions',     'Stuck? Ask the community.',                                '❓', 110, false),
  ('Support',         'Bug Reports',          'Found something broken? Tell us how to make it happen.',   '🐞', 120, false),
  ('Support',         'Appeals',              'Banned or muted? Appeal here.',                            '⚖️', 130, false)
) v(section, name, description, icon, sort, staff_only)
where not exists (select 1 from public.forum_categories);

-- ---------------------------------------------------------------------
--  PUBLIC POSTS (community feed + profile walls)
-- ---------------------------------------------------------------------
create table if not exists public.wall_posts (
  id            bigserial primary key,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  wall_owner_id uuid not null references public.profiles(id) on delete cascade,
  body          text not null check (char_length(body) between 1 and 2000),
  like_count    int not null default 0,
  comment_count int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists wall_posts_time  on public.wall_posts (created_at desc);
create index if not exists wall_posts_owner on public.wall_posts (wall_owner_id, created_at desc);

create table if not exists public.wall_likes (
  post_id bigint not null references public.wall_posts(id) on delete cascade,
  user_id uuid   not null references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table if not exists public.wall_comments (
  id         bigserial primary key,
  post_id    bigint not null references public.wall_posts(id) on delete cascade,
  author_id  uuid   not null references public.profiles(id) on delete cascade,
  body       text   not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists wall_comments_post on public.wall_comments (post_id, created_at);

create or replace function public.wall_counts_changed() returns trigger
language plpgsql security definer set search_path = public as $$
declare pid bigint := coalesce(new.post_id, old.post_id);
begin
  update wall_posts set
    like_count    = (select count(*) from wall_likes where post_id = pid),
    comment_count = (select count(*) from wall_comments where post_id = pid)
  where id = pid;
  return null;
end $$;
drop trigger if exists wall_likes_changed on public.wall_likes;
create trigger wall_likes_changed after insert or delete on public.wall_likes
  for each row execute function public.wall_counts_changed();
drop trigger if exists wall_comments_changed on public.wall_comments;
create trigger wall_comments_changed after insert or delete on public.wall_comments
  for each row execute function public.wall_counts_changed();

create or replace function public.wall_post_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not is_staff() and (select count(*) from wall_posts where author_id = new.author_id
                          and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'You are posting too fast. Wait a minute and try again.';
  end if;
  new.like_count := 0; new.comment_count := 0;
  return new;
end $$;
drop trigger if exists wall_post_limit on public.wall_posts;
create trigger wall_post_limit before insert on public.wall_posts
  for each row execute function public.wall_post_limit();

-- ---------------------------------------------------------------------
--  FRIENDS
-- ---------------------------------------------------------------------
create table if not exists public.friend_requests (
  id           bigserial primary key,
  from_id      uuid not null references public.profiles(id) on delete cascade,
  to_id        uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending','accepted')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  check (from_id <> to_id)
);
create unique index if not exists friend_pair on public.friend_requests
  (least(from_id, to_id), greatest(from_id, to_id));

create or replace function public.are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from friend_requests where status = 'accepted'
                 and ((from_id = a and to_id = b) or (from_id = b and to_id = a)));
$$;

create or replace function public.friend_request_edit() returns trigger
language plpgsql as $$
begin
  new.from_id := old.from_id; new.to_id := old.to_id; new.created_at := old.created_at;
  new.responded_at := now();
  return new;
end $$;
drop trigger if exists friend_request_edit on public.friend_requests;
create trigger friend_request_edit before update on public.friend_requests
  for each row execute function public.friend_request_edit();

-- ---------------------------------------------------------------------
--  INSTANT MESSAGES (friends only)
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id           bigserial primary key,
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body         text not null check (char_length(body) between 1 and 2000),
  created_at   timestamptz not null default now(),
  read_at      timestamptz
);
create index if not exists messages_pair on public.messages
  (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at desc);
create index if not exists messages_unread on public.messages (recipient_id) where read_at is null;

create or replace function public.message_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from messages where sender_id = new.sender_id
      and created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Slow down! You are sending messages too fast.';
  end if;
  new.created_at := now(); new.read_at := null;
  return new;
end $$;
drop trigger if exists message_limit on public.messages;
create trigger message_limit before insert on public.messages
  for each row execute function public.message_limit();

create or replace function public.mark_read(p_friend uuid) returns void
language sql security definer set search_path = public as $$
  update messages set read_at = now()
  where recipient_id = auth.uid() and sender_id = p_friend and read_at is null;
$$;

-- Inbox: one row per person you've talked to.
create or replace function public.my_conversations() returns table
  (partner_id uuid, last_body text, last_at timestamptz, last_from_me boolean, unread bigint)
language sql stable security definer set search_path = public as $$
  with mine as (
    select *, case when sender_id = auth.uid() then recipient_id else sender_id end as partner
    from messages where sender_id = auth.uid() or recipient_id = auth.uid()
  ), last as (
    select distinct on (partner) partner, body, created_at, sender_id = auth.uid() as from_me
    from mine order by partner, created_at desc
  )
  select l.partner, l.body, l.created_at, l.from_me,
         (select count(*) from mine m where m.partner = l.partner and m.recipient_id = auth.uid() and m.read_at is null)
  from last l order by l.created_at desc;
$$;

-- ---------------------------------------------------------------------
--  ROW LEVEL SECURITY for posts, friends and messages
-- ---------------------------------------------------------------------
alter table public.wall_posts      enable row level security;
alter table public.wall_likes      enable row level security;
alter table public.wall_comments   enable row level security;
alter table public.friend_requests enable row level security;
alter table public.messages        enable row level security;

drop policy if exists "read wall posts" on public.wall_posts;
create policy "read wall posts" on public.wall_posts for select using (true);
drop policy if exists "write wall posts" on public.wall_posts;
create policy "write wall posts" on public.wall_posts for insert with check (
  author_id = auth.uid() and public.is_active()
  and (wall_owner_id = auth.uid() or public.are_friends(auth.uid(), wall_owner_id)));
drop policy if exists "delete wall posts" on public.wall_posts;
create policy "delete wall posts" on public.wall_posts for delete
  using (author_id = auth.uid() or wall_owner_id = auth.uid() or public.is_staff());

drop policy if exists "read likes" on public.wall_likes;
create policy "read likes" on public.wall_likes for select using (true);
drop policy if exists "like" on public.wall_likes;
create policy "like" on public.wall_likes for insert with check (user_id = auth.uid() and public.is_active());
drop policy if exists "unlike" on public.wall_likes;
create policy "unlike" on public.wall_likes for delete using (user_id = auth.uid());

drop policy if exists "read comments" on public.wall_comments;
create policy "read comments" on public.wall_comments for select using (true);
drop policy if exists "comment" on public.wall_comments;
create policy "comment" on public.wall_comments for insert with check (author_id = auth.uid() and public.is_active());
drop policy if exists "delete comments" on public.wall_comments;
create policy "delete comments" on public.wall_comments for delete using (
  author_id = auth.uid() or public.is_staff()
  or exists (select 1 from public.wall_posts p where p.id = post_id and p.wall_owner_id = auth.uid()));

drop policy if exists "see own friend requests" on public.friend_requests;
create policy "see own friend requests" on public.friend_requests for select
  using (from_id = auth.uid() or to_id = auth.uid());
drop policy if exists "send friend requests" on public.friend_requests;
create policy "send friend requests" on public.friend_requests for insert
  with check (from_id = auth.uid() and status = 'pending' and public.is_active());
drop policy if exists "accept friend requests" on public.friend_requests;
create policy "accept friend requests" on public.friend_requests for update
  using (to_id = auth.uid()) with check (status = 'accepted');
drop policy if exists "remove friends" on public.friend_requests;
create policy "remove friends" on public.friend_requests for delete
  using (from_id = auth.uid() or to_id = auth.uid());

drop policy if exists "read own messages" on public.messages;
create policy "read own messages" on public.messages for select
  using (sender_id = auth.uid() or recipient_id = auth.uid());
drop policy if exists "message friends" on public.messages;
create policy "message friends" on public.messages for insert with check (
  sender_id = auth.uid() and public.is_active() and public.are_friends(auth.uid(), recipient_id));

-- ---------------------------------------------------------------------
--  LIVE UPDATES (instant messages + friend requests arrive instantly)
-- ---------------------------------------------------------------------
do $$ begin
  begin alter publication supabase_realtime add table public.messages;        exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.friend_requests; exception when duplicate_object then null; end;
end $$;

-- ---------------------------------------------------------------------
--  ACCESS FOR THE WEBSITE (the security rules above still decide
--  exactly which rows each person can see or change)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;

-- =====================================================================
--  FUTURE: GAME SERVER LINK (not used yet)
--  When a player registers in-game, the game server (running on the VPS,
--  holding the secret service_role key server-side, NEVER in the site) will:
--    1. create an auth user with email  <name>@players.shadowofdeath.invalid
--       and the player's game password (Supabase Admin API)
--    2. update profiles set username = <name>, game_username = <name>,
--       status = 'incomplete' where id = <new user id>
--  The player then logs in on the site with their game name + password;
--  the site sees status 'incomplete' and shows "Finish your sign-up",
--  where they add a real email. That turns the account 'active'.
-- =====================================================================
