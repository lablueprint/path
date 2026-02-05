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

create policy "auth can read store_items if can_manage_store" on public.store_items for
select
  to authenticated using (
    private.can_manage_store (store_id)
    or (
      (
        (
          select
            auth.jwt ()
        ) ->> 'user_role'
      ) in ('requestor', 'admin')
      and not is_hidden
    )
  );

create policy "auth can insert store_items if can_manage_store" on public.store_items for insert to authenticated
with
  check (private.can_manage_store (store_id));

create policy "auth can update store_items if can_manage_store" on public.store_items
for update
  to authenticated using (private.can_manage_store (store_id))
with
  check (private.can_manage_store (store_id));

create policy "auth can delete store_items if can_manage_store" on public.store_items for delete to authenticated using (private.can_manage_store (store_id));
