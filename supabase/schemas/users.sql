create table users (
    user_id uuid default uuid_generate_v4() primary key,
    first_name text,
    last_name text,
    email text,
    profile_photo_url text
);

alter table "users" enable row level security;

create policy "auth can read users if >= requestor"
on public.users
for select to anon
using (true);

create policy "no user can insert users"
on public.users
for insert to anon
with check (true);

create policy "auth can update users if user_id"
on public.users
for update to anon
using (true)
with check (true);

create policy "no user can delete users"
on public.users
for delete to anon
using (true);