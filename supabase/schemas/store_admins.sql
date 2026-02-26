create table store_admins (
  store_admin_id uuid default uuid_generate_v4 () primary key,
  user_id uuid not null,
  store_id uuid not null,
  constraint fk_users foreign key (user_id) references users (user_id) on delete cascade,
  constraint fk_stores foreign key (store_id) references stores (store_id) on delete cascade
);

alter table store_admins enable row level security;

alter table store_admins
add constraint uq_user_store_id unique (user_id, store_id);

-- Auth user can read entries if "requestor", "admin", "superadmin", or "owner"
create policy "auth can read store_admins if >= requestor" on public.store_admins for
select
  to authenticated using (
    (
      (
        select
          auth.jwt ()
      ) ->> 'user_role'
    ) in ('requestor', 'admin', 'owner', 'superadmin')
  );

-- Auth user can insert an entry if private.can_manage_store(store_id) returns true
create policy "auth can insert store_admins if can_manage_store" on public.store_admins for insert to authenticated
with
  check (private.can_manage_store (store_id));

-- No user can update entries
create policy "no user can update store_admins" on public.store_admins
for update
  using (false)
with
  check (false);

-- Auth user can delete entry if private.can_manage_store(store_id) returns true
create policy "all authenticated users can delete" on public.store_admins for delete to authenticated using (private.can_manage_store (store_id));
