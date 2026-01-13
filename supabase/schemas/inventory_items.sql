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

create policy "auth can read inventory_items if >= requestor" on public.inventory_items 
for select to authenticated 
using ((select auth.jwt()) ->> 'user_role' in ('requestor', 'admin', 'superadmin','owner')); 

create policy "auth can insert inventory_items if >= admin" on public.inventory_items 
for insert to authenticated 
with check ((select auth.jwt()) ->> 'user_role' in ('admin', 'superadmin','owner')); 

create policy "auth can update inventory_items if >= superadmin" on public.inventory_items
for update to authenticated 
using ((select auth.jwt()) ->> 'user_role' in ('superadmin','owner')); 

create policy "auth can delete inventory_items if >= superadmin" on public.inventory_items
for delete to authenticated 
using ((select auth.jwt()) ->> 'user_role' in ('superadmin','owner')); 