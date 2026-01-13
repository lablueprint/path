create table store_items (
  store_item_id uuid default uuid_generate_v4 () primary key,
  inventory_item_id uuid not null,
  store_id uuid not null,
  quantity_available int not null,
  is_hidden boolean not null,
  constraint fk_inventory_items foreign key (inventory_item_id) references inventory_items (inventory_item_id) on delete cascade,
  constraint fk_stores foreign key (store_id) references stores (store_id) on delete cascade
);

alter table store_items enable row level security;

create policy "all authenticated users can select" on public.store_items for
select
  to authenticated using (true);

create policy "all authenticated users can insert" on public.store_items for insert to authenticated
with
  check (true);

create policy "all authenticated users can update" on public.store_items
for update
  to authenticated using (true)
with
  check (true);

create policy "all authenticated users can delete" on public.store_items for delete to authenticated using (true);
