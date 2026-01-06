create table roles (role_id serial primary key, name text not null);

alter table "roles" enable row level security;

create policy "auth can read roles" on public.roles for
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

grant all on table public.roles to supabase_auth_admin;

create policy "supabase auth admin can read roles" on public.roles as permissive for
select
  to supabase_auth_admin using (true);
