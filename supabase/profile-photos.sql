-- Enable profile photos on an existing database. Photos use the profile's existing access rules.
alter table public.profiles
  add column if not exists avatar_photo text
  check (length(avatar_photo) <= 32768 and avatar_photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$');
