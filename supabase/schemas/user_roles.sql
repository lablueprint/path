create schema if not exists private;

create table user_roles (
  user_role_id uuid default uuid_generate_v4 () primary key,
  user_id uuid not null,
  role_id int not null,
  constraint fk_users foreign key (user_id) references users (user_id) on delete cascade,
  constraint fk_roles foreign key (role_id) references roles (role_id) on delete cascade,
  constraint uq_user_id unique (user_id)
);

alter table user_roles enable row level security;

create policy "auth can read user_roles if >= requestor" on public.user_roles for
select
  to authenticated using (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('requestor', 'admin', 'superadmin', 'owner')
  );

create policy "no user can insert user_roles" on public.user_roles for insert
with
  check (false);

create policy "auth can update user_roles if can_assign_role" on public.user_roles
for update
  to authenticated using (private.can_assign_role (role_id))
with
  check (private.can_assign_role (role_id));

create policy "no user can delete user_roles" on public.user_roles for delete using (false);

grant all on table public.user_roles to supabase_auth_admin;

create policy "supabase auth admin can read user_roles" on public.user_roles as permissive for
select
  to supabase_auth_admin using (true);
