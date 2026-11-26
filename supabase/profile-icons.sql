-- Enable saved profile icons on an existing database.
-- Donator emblems resolve from the linked game account's current rank.
alter table public.profiles
  add column if not exists avatar_icon text not null default 'initials'
  check (avatar_icon in ('initials','knight','dragon','citadel','portal','donator'));
