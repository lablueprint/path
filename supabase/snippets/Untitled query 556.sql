create table if not exists public.users (
  user_id uuid primary key,
  first_name text,
  last_name text,
  email text,
  profile_photo_url text
);
