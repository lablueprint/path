drop policy "auth can read tickets if requestor_user_id or >= superadmin" on "public"."tickets";

drop policy "auth can update tickets if requestor_user_id" on "public"."tickets";

drop policy "auth can delete tickets if requestor_user_id or >= superadmin" on "public"."tickets";

drop policy "auth can insert tickets if requestor_user_id and >= requestor" on "public"."tickets";

alter type "public"."ticket_status" rename to "ticket_status__old_version_to_be_dropped";

create type "public"."ticket_status" as enum ('draft', 'requested', 'ready', 'rejected', 'fulfilled');

alter table "public"."tickets" alter column status type "public"."ticket_status" using status::text::"public"."ticket_status";

drop type "public"."ticket_status__old_version_to_be_dropped";

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


  create policy "auth can read tickets if requestor_user_id or can_manage_store"
  on "public"."tickets"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = requestor_user_id) OR private.can_manage_store(store_id)));



  create policy "auth can update tickets if requestor_user_id or can_manage_stor"
  on "public"."tickets"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.uid() AS uid) = requestor_user_id) OR private.can_manage_store(store_id)))
with check (((( SELECT auth.uid() AS uid) = requestor_user_id) OR private.can_manage_store(store_id)));



  create policy "auth can delete tickets if requestor_user_id or >= superadmin"
  on "public"."tickets"
  as permissive
  for delete
  to authenticated
using ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])) OR ((( SELECT auth.uid() AS uid) = requestor_user_id) AND (status = 'requested'::public.ticket_status))));



  create policy "auth can insert tickets if requestor_user_id and >= requestor"
  on "public"."tickets"
  as permissive
  for insert
  to authenticated
with check ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])) AND (( SELECT auth.uid() AS uid) = requestor_user_id) AND (status = 'draft'::public.ticket_status)));


CREATE TRIGGER "after update tickets status" AFTER UPDATE OF status ON public.tickets FOR EACH ROW EXECUTE FUNCTION private.handle_ticket_fulfillment();


