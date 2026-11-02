-- =====================================================================
--  SHADOW OF DEATH - GAME SERVER <-> FORUMS LINK
--  Run this ONCE in Supabase, after schema.sql:
--  SQL Editor > New query > paste ALL > Run.  Safe to run again.
--
--  How it works:
--   * The game server (holding the SECRET key, server-side only) keeps
--     one row per game account in game_accounts: staff rank, donator rank,
--     levels, time played, in game now. New game names are "held" so only
--     their owner can take that forum name.
--   * In-game, ::forums makes a one-time code (15 minutes). Entering it on
--     the site (Register or Settings) links the game account to the forum
--     account. Game passwords never leave the game server.
--   * Staff ranks follow the game: game owner/admin/mod -> same forum rank.
--   * server_status has the online / players count for the home page.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- "Lily Reaper" / "lily_reaper" -> "lily_reaper" (how the game stores names)
create or replace function public.game_name_key(p text) returns text
language sql immutable as $$ select lower(replace(trim(p), ' ', '_')) $$;

create table if not exists public.game_accounts (
  game_username   text primary key,                 -- login name, e.g. lily_reaper
  display_name    text,
  staff_rank      text not null default 'player' check (staff_rank in ('player','moderator','admin','owner')),
  donator_rank    text not null default '',          -- 'Lost Soul' ... 'Death', '' = none
  donator_color   text not null default '',          -- hex without #
  combat_level    int,
  total_level     int,
  time_played_min int,
  online          boolean not null default false,
  last_seen       timestamptz,
  linked_profile  uuid unique references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

create table if not exists public.game_link_codes (
  code_hash     text primary key,                    -- sha256 of the code, never the code itself
  game_username text not null references public.game_accounts(game_username) on delete cascade,
  expires_at    timestamptz not null
);

create table if not exists public.server_status (
  id         int primary key default 1 check (id = 1),
  online     boolean not null default false,
  players    int not null default 0,
  uptime_min int not null default 0,
  updated_at timestamptz not null default now()
);
insert into public.server_status (id) values (1) on conflict do nothing;

alter table public.profiles add column if not exists role_from_game boolean not null default false;

-- Everyone can read game stats and server status; only the game server
-- (secret key) can write them. Link codes are never readable by the site.
alter table public.game_accounts   enable row level security;
alter table public.game_link_codes enable row level security;
alter table public.server_status   enable row level security;
drop policy if exists "read game accounts" on public.game_accounts;
create policy "read game accounts" on public.game_accounts for select using (true);
drop policy if exists "read server status" on public.server_status;
create policy "read server status" on public.server_status for select using (true);
revoke all on public.game_link_codes from anon, authenticated;
grant select on public.game_accounts, public.server_status to anon, authenticated;

-- Profile changes made by these functions are trusted (rank sync).
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
declare actor_role text;
begin
  if auth.uid() is null or current_setting('sod.trusted', true) = '1' then return new; end if;
  select role into actor_role from profiles where id = auth.uid();
  new.id := old.id;
  new.created_at := old.created_at;
  -- a held game name can only be taken by the account linked to it
  if new.username is distinct from old.username and exists (
       select 1 from game_accounts g where g.game_username = game_name_key(new.username)
       and g.linked_profile is distinct from old.id) then
    raise exception 'That name belongs to a Shadow of Death player. Link your game account to use your own game name.';
  end if;
  if actor_role = 'owner' then return new; end if;
  new.role := old.role;
  new.role_from_game := old.role_from_game;
  new.game_username := old.game_username;
  if new.status is distinct from old.status then
    if auth.uid() = old.id and old.status = 'incomplete' and new.status = 'active'
       and (select email from auth.users where id = old.id) not like '%@' || game_email_domain() then
      null;
    elsif actor_role in ('moderator','admin') and old.role = 'member'
       and old.status in ('active','banned') and new.status in ('active','banned') then
      null;
    else
      new.status := old.status;
    end if;
  end if;
  return new;
end $$;

-- Game staff rank -> forum rank. A game "player" only loses a forum rank
-- that came from the game, so forum-only moderators keep theirs.
create or replace function public.apply_game_role(p_game text) returns void
language plpgsql security definer set search_path = public as $$
declare g game_accounts;
begin
  select * into g from game_accounts where game_username = p_game;
  if g.linked_profile is null then return; end if;
  perform set_config('sod.trusted', '1', true);
  if g.staff_rank in ('owner','admin','moderator') then
    update profiles set role = case g.staff_rank when 'moderator' then 'moderator' else g.staff_rank end,
                        role_from_game = true
    where id = g.linked_profile and role is distinct from g.staff_rank;
  else
    update profiles set role = 'member', role_from_game = false
    where id = g.linked_profile and role_from_game;
  end if;
  perform set_config('sod.trusted', '', true);
end $$;

create or replace function public.game_account_changed() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.staff_rank is distinct from old.staff_rank
     or new.linked_profile is distinct from old.linked_profile then
    perform apply_game_role(new.game_username);
  end if;
  return null;
end $$;
drop trigger if exists game_account_changed on public.game_accounts;
create trigger game_account_changed after insert or update on public.game_accounts
  for each row execute function public.game_account_changed();

-- Links the logged-in forum account to the game account the code belongs to.
create or replace function public.link_game_account(p_code text) returns text
language plpgsql security definer set search_path = public as $$
declare c game_link_codes; g game_accounts;
begin
  if auth.uid() is null then raise exception 'Log in first.'; end if;
  select * into c from game_link_codes
   where code_hash = encode(extensions.digest(upper(trim(p_code)), 'sha256'), 'hex') and expires_at > now();
  if c is null then raise exception 'That code is wrong or has run out. Type ::forums in-game for a new one.'; end if;
  select * into g from game_accounts where game_username = c.game_username;
  if g.linked_profile is not null and g.linked_profile <> auth.uid() then
    raise exception 'That game account is already linked to another forum account.';
  end if;
  delete from game_link_codes where game_username = c.game_username;
  update game_accounts set linked_profile = null where linked_profile = auth.uid() and game_username <> g.game_username;
  update game_accounts set linked_profile = auth.uid() where game_username = g.game_username;
  perform set_config('sod.trusted', '1', true);
  update profiles set game_username = g.display_name where id = auth.uid();
  perform set_config('sod.trusted', '', true);
  return coalesce(g.display_name, g.game_username);
end $$;

create or replace function public.unlink_game_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  update game_accounts set linked_profile = null where linked_profile = auth.uid();
  perform set_config('sod.trusted', '1', true);
  update profiles set game_username = null,
         role = case when role_from_game then 'member' else role end, role_from_game = false
   where id = auth.uid();
  perform set_config('sod.trusted', '', true);
end $$;

-- Sign-up: a held game name needs that player's ::forums code, which also links it.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare uname text := coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''),
                               'user' || substr(replace(new.id::text, '-', ''), 1, 8));
        code text := nullif(trim(new.raw_user_meta_data->>'link_code'), '');
        c game_link_codes;
begin
  if code is not null then
    select * into c from game_link_codes
     where code_hash = encode(extensions.digest(upper(code), 'sha256'), 'hex') and expires_at > now();
    if c is null then raise exception 'That game code is wrong or has run out. Type ::forums in-game for a new one.'; end if;
  end if;
  if exists (select 1 from game_accounts g where g.game_username = game_name_key(uname)
             and (c is null or c.game_username <> g.game_username)) then
    raise exception 'That name belongs to a Shadow of Death player. Type ::forums in-game and enter the code to claim it.';
  end if;
  insert into public.profiles (id, username) values (new.id, uname);
  if c is not null then
    if exists (select 1 from game_accounts where game_username = c.game_username and linked_profile is not null) then
      raise exception 'That game account is already linked to another forum account.';
    end if;
    delete from game_link_codes where game_username = c.game_username;
    update game_accounts set linked_profile = new.id where game_username = c.game_username;
    perform set_config('sod.trusted', '1', true);
    update profiles set game_username = (select display_name from game_accounts where game_username = c.game_username)
     where id = new.id;
    perform set_config('sod.trusted', '', true);
  end if;
  return new;
end $$;

-- The sign-up form asks this before creating the account.
create or replace function public.username_status(p_username text) returns text
language sql stable security definer set search_path = public as $$
  select case
    when exists (select 1 from profiles where username = p_username::citext) then 'taken'
    when exists (select 1 from game_accounts where game_username = game_name_key(p_username)) then 'game'
    else 'free' end;
$$;

-- Lets the sign-up form check a code first (returns the game name, or null).
create or replace function public.check_link_code(p_code text) returns text
language sql stable security definer set search_path = public as $$
  select g.game_username from game_link_codes c join game_accounts g using (game_username)
  where c.code_hash = encode(extensions.digest(upper(trim(p_code)), 'sha256'), 'hex')
    and c.expires_at > now() and g.linked_profile is null;
$$;

grant execute on function public.link_game_account(text), public.unlink_game_account(),
  public.username_status(text), public.game_name_key(text), public.check_link_code(text) to authenticated, anon;
revoke execute on function public.apply_game_role(text) from anon, authenticated, public;
