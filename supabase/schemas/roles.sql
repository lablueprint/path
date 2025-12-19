create table roles (
  role_id int not null primary key,
  name text not null
);

alter table "roles" enable row level security;

create policy "authenticated can read roles" on public.roles for
select
  to authenticated using (true);

create policy "no user can insert roles" on public.roles for insert
with
  check (false);

create policy "no user can update roles" on public.roles
for update
  using (false)
with
  check (false);

create policy "no user can delete roles" on public.roles for delete using (false);
