alter table public.ticket_items
drop constraint if exists ck_quantity_requested;

alter table public.ticket_items
add constraint ck_quantity_requested check (quantity_requested >= 1);
