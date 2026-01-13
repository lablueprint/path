create table store_admins (
  store_admin_id uuid default uuid_generate_v4 () primary key,
  user_id uuid not null,
  store_id uuid not null,
  constraint fk_users foreign key (user_id) references users (user_id) on delete cascade,
  constraint fk_stores foreign key (store_id) references stores (store_id) on delete cascade
);

alter table store_admins enable row level security;

create policy "all authenticated users can select" on public.store_admins for
select
  to authenticated using (true);

create policy "all authenticated users can insert" on public.store_admins for insert to authenticated
with
  check (true);

create policy "all authenticated users can update" on public.store_admins
for update
  to authenticated using (true)
with
  check (true);

create policy "all authenticated users can delete" on public.store_admins for delete to authenticated using (true);
