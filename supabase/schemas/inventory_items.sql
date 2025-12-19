create table "inventory_items" (
  "inventory_item_id" uuid primary key default uuid_generate_v4 (),
  "store_id" uuid not null,
  "subcategory_id" int not null,
  "item" varchar(255) not null,
  "description" text not null,
  "photo_url" text,
  "quantity_available" int not null,
  "is_hidden" boolean not null
);

alter table "inventory_items" enable row level security;

create policy "public can select entries in inventory_items" on public.inventory_items for
select
  to anon using (true);

create policy "public can insert entries in inventory_items" on public.inventory_items for insert to anon
with
  check (true);

create policy "public can update entries in inventory_items" on public.inventory_items
for update
  to anon using (true)
with
  check (true);

create policy "public can delete entries in inventory_items" on public.inventory_items for delete to anon using (true);
