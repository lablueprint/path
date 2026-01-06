drop policy "public can delete ticket_items" on "public"."ticket_items";

drop policy "public can insert ticket_items" on "public"."ticket_items";

drop policy "public can read ticket_items" on "public"."ticket_items";

drop policy "public can update ticket_items" on "public"."ticket_items";

drop policy "public can delete entries in tickets" on "public"."tickets";

drop policy "public can insert entries in tickets" on "public"."tickets";

drop policy "public can read entries in tickets" on "public"."tickets";

drop policy "public can update entries in tickets" on "public"."tickets";

alter table "public"."ticket_items" drop column "inventory_item_id";

alter table "public"."ticket_items" add column "store_item_id" uuid;

alter table "public"."ticket_items" add constraint "fk_tickets" FOREIGN KEY (ticket_id) REFERENCES public.tickets(ticket_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_items" validate constraint "fk_tickets";

alter table "public"."tickets" add constraint "fk_stores" FOREIGN KEY (store_id) REFERENCES public.stores(store_id) not valid;

alter table "public"."tickets" validate constraint "fk_stores";


  create policy "auth can delete ticket_items if can read tickets"
  on "public"."ticket_items"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE (t.ticket_id = ticket_items.ticket_id))));



  create policy "auth can insert ticket_items if can read tickets"
  on "public"."ticket_items"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE (t.ticket_id = ticket_items.ticket_id))));



  create policy "auth can read ticket_items if can read tickets"
  on "public"."ticket_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE (t.ticket_id = ticket_items.ticket_id))));



  create policy "auth can update ticket_items if can read tickets"
  on "public"."ticket_items"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE (t.ticket_id = ticket_items.ticket_id))))
with check ((EXISTS ( SELECT 1
   FROM public.tickets t
  WHERE (t.ticket_id = t.ticket_id))));



  create policy "auth can delete tickets if requestor_user_id or >= superadmin"
  on "public"."tickets"
  as permissive
  for delete
  to authenticated
using ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])) OR (( SELECT auth.uid() AS uid) = requestor_user_id)));



  create policy "auth can insert tickets if >= requestor"
  on "public"."tickets"
  as permissive
  for insert
  to authenticated
with check ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])) AND (( SELECT auth.uid() AS uid) = requestor_user_id)));



  create policy "auth can read tickets if requestor_user_id or >= superadmin"
  on "public"."tickets"
  as permissive
  for select
  to authenticated
using ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])) OR (( SELECT auth.uid() AS uid) = requestor_user_id)));



  create policy "auth can update tickets if requestor_user_id"
  on "public"."tickets"
  as permissive
  for update
  to authenticated
using ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])) OR (( SELECT auth.uid() AS uid) = requestor_user_id)))
with check ((((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])) OR (( SELECT auth.uid() AS uid) = requestor_user_id)));



