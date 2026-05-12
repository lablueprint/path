create schema if not exists private;

create or replace function private.handle_ticket_fulfillment () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
	-- Logic
  if old.status is distinct from 'fulfilled' 
    and new.status = 'fulfilled' then
  
    if new.dest_store_id is not null then
      -- update destination store items that already exist 
      update public.store_items dest_store_item
      set quantity_available = dest_store_item.quantity_available + deduction.quantity_deducted from (
        select
          source_store_item.inventory_item_id,
          least(source_store_item.quantity_available, ticket_item.quantity_requested) as quantity_deducted
        from public.ticket_items ticket_item
        join public.store_items source_store_item on source_store_item.store_item_id = ticket_item.store_item_id
        where ticket_item.ticket_id = new.ticket_id
          and ticket_item.is_in_stock_request = true
      ) deduction
      where dest_store_item.store_id = new.dest_store_id
        and dest_store_item.inventory_item_id = deduction.inventory_item_id;

      -- insert new store items that don't already exist
      insert into public.store_items (
        store_id,
        inventory_item_id,
        quantity_available,
        is_hidden
      )
      select
        new.dest_store_id,
        deduction.inventory_item_id,
        deduction.quantity_deducted,
        false
      from (
        select
          source_store_item.inventory_item_id,
          least(source_store_item.quantity_available, ticket_item.quantity_requested) as quantity_deducted
        from public.ticket_items ticket_item
        join public.store_items source_store_item on source_store_item.store_item_id = ticket_item.store_item_id
        where ticket_item.ticket_id = new.ticket_id and ticket_item.is_in_stock_request = true
      ) deduction
      where deduction.quantity_deducted > 0
        and not exists (
          select 1
          from public.store_items existing_dest_store_item
          where existing_dest_store_item.store_id = new.dest_store_id and existing_dest_store_item.inventory_item_id = deduction.inventory_item_id
        );

    end if;

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
after
update of status on public.tickets for each row
execute function private.handle_ticket_fulfillment ();
