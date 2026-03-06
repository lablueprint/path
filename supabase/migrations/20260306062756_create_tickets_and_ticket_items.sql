-- Add 'draft' to ticket_status enum
alter type ticket_status add value 'draft';

commit;

-- Unique index: one draft ticket per user per store
create unique index unique_draft_ticket_per_user_store
on tickets (requestor_user_id, store_id)
where status = 'draft';

-- Unique index: one ticket item per store item per ticket
create unique index uq_ticket_id_store_item_id_not_null
on public.ticket_items (ticket_id, store_item_id)
where store_item_id is not null;