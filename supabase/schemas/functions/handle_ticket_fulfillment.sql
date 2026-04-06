create schema if not exists private;

create or replace function private.handle_ticket_fulfillment()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
	-- Logic
    if old.status is distinct from 'fulfilled' 
        and new.status = 'fulfilled' then
    update public.store_items store_item
    set quantity_available = greatest(
        0,
        store_item.quantity_available - ticket_item.quantity_requested
    )
    from public.ticket_items ticket_item
    where ticket_item.ticket_id = new.ticket_id
        and ticket_item.is_in_stock_request = true
        and ticket_item.store_item_id = store_item.store_item_id
        and store_item.store_id = new.store_id;
    
    end if;

    return new;
end;
$$;

create trigger "after update tickets status"
after update of status on public.tickets
for each row
execute function private.handle_ticket_fulfillment();