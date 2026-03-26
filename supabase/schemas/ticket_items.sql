create table ticket_items (
  ticket_item_id uuid default uuid_generate_v4 () primary key,
  ticket_id uuid not null,
  store_item_id uuid,
  free_text_description text,
  quantity_requested int,
  is_in_stock_request boolean not null,
  constraint fk_store_items foreign key (store_item_id) references store_items (store_item_id) on update cascade,
  constraint fk_tickets foreign key (ticket_id) references tickets (ticket_id) on delete cascade on update cascade
);

alter table "ticket_items"
add constraint uq_ticket_id_store_item_id unique (ticket_id, store_item_id);

alter table "ticket_items"
add constraint ck_quantity_requested check (quantity_requested >= 0);

alter table "ticket_items"
add constraint ck_free_text_description_presence check (
  (
    is_in_stock_request = true
    and free_text_description is null
  )
  or (
    is_in_stock_request = false
    and free_text_description is not null
  )
);

alter table "ticket_items"
add constraint ck_quantity_requested_presence check (
  (
    is_in_stock_request = true
    and quantity_requested is not null
  )
  or (
    is_in_stock_request = false
    and quantity_requested is null
  )
);

alter table "ticket_items"
add constraint ck_store_item_id_presence check (
  (
    is_in_stock_request = true
    and store_item_id is not null
  )
  or (
    is_in_stock_request = false
    and store_item_id is null
  )
);

alter table "ticket_items" enable row level security;

create policy "auth can read ticket_items if can read tickets" on public.ticket_items for
select
  to authenticated using (
    exists (
      select
        1 -- selects the constant '1' each time there is a match
      from
        tickets as t -- Shows only tickets caller can read, essentially filtering to the tickets table's select rls
      where
        t.ticket_id = ticket_items.ticket_id -- Link to parent ticket so we can reference other fields for rls
    )
  );

create policy "auth can insert ticket_items if can read tickets" on public.ticket_items for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        tickets as t
      where
        t.ticket_id = ticket_items.ticket_id --need to specifically reference the ticket_items' ticket_id
    )
  );

create policy "auth can update ticket_items if can read tickets" on public.ticket_items
for update
  to authenticated using (
    exists (
      select
        1
      from
        tickets as t
      where
        t.ticket_id = ticket_items.ticket_id
    )
  )
with
  check (
    exists (
      select
        1
      from
        tickets as t
      where
        t.ticket_id = ticket_items.ticket_id
    )
  );

create policy "auth can delete ticket_items if can read tickets" on public.ticket_items for delete to authenticated using (
  exists (
    select
      1
    from
      tickets as t
    where
      t.ticket_id = ticket_items.ticket_id
  )
);
