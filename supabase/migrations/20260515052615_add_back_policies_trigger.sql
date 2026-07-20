alter type "public"."ticket_status" rename to "ticket_status__old_version_to_be_dropped";

create type "public"."ticket_status" as enum ('draft', 'requested', 'ready', 'rejected', 'fulfilled', 'approved');

alter table "public"."tickets" alter column status type "public"."ticket_status" using status::text::"public"."ticket_status";

drop type "public"."ticket_status__old_version_to_be_dropped";

CREATE UNIQUE INDEX uq_requestor_user_id_store_id_draft ON public.tickets USING btree (requestor_user_id, store_id) WHERE (status = 'draft'::public.ticket_status);


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


CREATE TRIGGER "after update tickets status" AFTER UPDATE OF status ON public.tickets FOR EACH ROW EXECUTE FUNCTION private.handle_ticket_fulfillment();


