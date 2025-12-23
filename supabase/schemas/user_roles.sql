create schema if not exists private;

create table user_roles (
  user_role_id uuid default uuid_generate_v4 () primary key,
  user_id uuid not null,
  role_id int not null,
  /*constraint fk_users
  foreign key (user_id)
  references users(user_id)*/
  constraint fk_roles foreign key (role_id) references roles (role_id) on delete cascade,
  constraint uq_user_id_role_id unique (user_id, role_id)
);

alter table user_roles enable row level security;

create policy "auth can read user_roles" on public.user_roles for
select
  to authenticated using (true);

create policy "auth can insert user_roles if can_assign_role" on public.user_roles for insert to authenticated
with
  check (private.can_assign_role (role_id));

create policy "no user can update user_roles" on public.user_roles
for update
  using (false)
with
  check (false);

create policy "auth can delete user_roles if can_assign_role" on public.user_roles for delete using (private.can_assign_role (role_id));

grant all on table public.user_roles to supabase_auth_admin;

create policy "supabase auth admin can read user_roles" on public.user_roles as permissive for
select
  to supabase_auth_admin using (true);
