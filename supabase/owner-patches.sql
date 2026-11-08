-- =====================================================================
--  Owner-only pages (#/patches on the website).
--  Run this ONCE in Supabase: SQL Editor > New query > paste > Run.
--
--  The text is stored here instead of in the website's files, because the
--  website's files are public on GitHub. Only an account whose rank is
--  'owner' can read it. Nobody can write it from the website: it is only
--  updated from the owner's PC with the secret key (push-owner-patches.sh).
-- =====================================================================

create table if not exists public.owner_docs (
  key text primary key,
  html text not null,
  updated_at timestamptz not null default now()
);

alter table public.owner_docs enable row level security;

drop policy if exists "owner reads owner docs" on public.owner_docs;
create policy "owner reads owner docs" on public.owner_docs for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'owner'));

-- No insert / update / delete policies on purpose: only the secret key (which skips these rules) can change it.
revoke insert, update, delete on public.owner_docs from anon, authenticated;
