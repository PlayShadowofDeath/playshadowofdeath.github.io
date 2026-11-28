-- =====================================================================
--  High Scores (#/highscores on the website).
--  Run this ONCE in Supabase: SQL Editor > New query > paste > Run.
--
--  The game server fills this table every minute (only accounts that
--  changed). Everyone can read it, even without logging in. Nobody can
--  write it from the website: only the server's secret key can.
-- =====================================================================

create table if not exists public.highscores (
  game_username text primary key,
  display_name text not null,
  mode_key text not null,
  mode_name text not null,
  mode_order int not null default 0,
  total_level int not null default 0,
  total_xp bigint not null default 0,
  levels int[] not null default '{}',
  xp bigint[] not null default '{}',
  updated_at timestamptz not null default now()
);

create index if not exists highscores_mode on public.highscores (mode_key);

alter table public.highscores enable row level security;

drop policy if exists "anyone reads high scores" on public.highscores;
create policy "anyone reads high scores" on public.highscores for select using (true);

-- No insert / update / delete policies on purpose: only the secret key (which skips these rules) can change it.
revoke insert, update, delete on public.highscores from anon, authenticated;
