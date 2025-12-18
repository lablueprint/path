create table roles 
(
    role_id INT not null  primary key,
    name TEXT not null
);

alter table "roles" enable row level security;

create policy "authenticated users can select entries"
on public.roles
for select to authenticated
using (true);


create policy "no users can insert entries"
on public.roles
for insert
with check (false);

create policy "no users can update entries"
on public.roles
for update
using (false);
with check (false);

create policy "no user can delete entries"
on public.roles
for delete
using (false);
