CREATE TABLE ticket_items
(

    ticket_item_id UUID default uuid_generate_v4() /*primary key*/,
    ticket_id UUID not null,
    inventory_item_id UUID,
    free_text_description TEXT,
    quantity_requested INT, 
    is_in_stock_request BOOLEAN not null

    /* CONSTRAINT fk_tickets
        FOREIGN KEY ticket_id
        REFERENCES tickets(ticket_id)
    CONSTRAINT fk_inventory_items
        FOREIGN KEY inventory_item_id
        REFERENCES inventory_items(inventory_item_id)*/
);
alter table "ticket_items" enable row level security;

create policy "public can read ticket_items"
on public.ticket_items
for select to anon
using (true);

create policy "public can insert ticket_items"
on public.ticket_items
for insert to anon
with check (true);

create policy "public can update ticket_items"
on public.ticket_items
for update to anon
using (true)
with check (true);

create policy "public can delete tiecket_items"
on public.ticket_items
for delete to anon
using (true);