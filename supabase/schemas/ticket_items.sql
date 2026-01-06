create table ticket_items (
  ticket_item_id uuid default uuid_generate_v4 () primary key,
  ticket_id uuid not null,
  store_item_id uuid,
  free_text_description text,
  quantity_requested int,
  is_in_stock_request boolean not null,
  /*constraint fk_store_items
  foreign key (store_item_id)
  references store_items (store_item_id)
  on update cascade,*/
  constraint fk_tickets foreign key (ticket_id) references tickets (ticket_id) on delete cascade on update cascade
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
        t.ticket_id = ticket_id
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
