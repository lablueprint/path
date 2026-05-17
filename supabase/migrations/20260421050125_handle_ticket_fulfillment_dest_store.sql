alter table "public"."tickets" add column "dest_store_id" uuid;

alter table "public"."tickets" add constraint "ck_store_id_dest_store_id" CHECK ((store_id <> dest_store_id)) not valid;

alter table "public"."tickets" validate constraint "ck_store_id_dest_store_id";

alter table "public"."tickets" add constraint "fk_dest_stores" FOREIGN KEY (dest_store_id) REFERENCES public.stores(store_id) not valid;

alter table "public"."tickets" validate constraint "fk_dest_stores";

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
  
    if new.dest_store_id is not null then
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
$function$
;


