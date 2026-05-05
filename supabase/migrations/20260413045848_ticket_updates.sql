CREATE UNIQUE INDEX uq_requestor_user_id_store_id_draft ON public.tickets USING btree (requestor_user_id, store_id) WHERE (status = 'draft'::public.ticket_status);

CREATE UNIQUE INDEX uq_ticket_id_store_item_id_not_null ON public.ticket_items USING btree (ticket_id, store_item_id) WHERE (store_item_id IS NOT NULL);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.handle_ticket_fulfillment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$
;


