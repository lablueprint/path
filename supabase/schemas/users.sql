create table users (
  user_id uuid default uuid_generate_v4 () primary key,
  first_name text,
  last_name text,
  full_name text generated always as (btrim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))) stored,
  email text,
  profile_photo_url text,
  constraint fk_auth_users foreign key (user_id) references auth.users (id) on delete cascade
);

alter table "users" enable row level security;

create policy "auth can read users if >= requestor" on public.users for
select
  to authenticated using (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('requestor', 'admin', 'superadmin', 'owner')
  );

create policy "no user can insert users" on public.users for insert
with
  check (false);

create policy "auth can update users if user_id" on public.users
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = user_id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = user_id
  );

create policy "no user can delete users" on public.users for delete using (false);
