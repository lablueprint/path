alter table "public"."donations" drop column "receiver_user_id";

alter table "public"."donations" drop column "store_id";

alter table "public"."donations" add column "receiver_first_name" text not null;

alter table "public"."donations" add column "receiver_last_name" text not null;

alter table "public"."donations" add column "store_name" text not null;

alter table "public"."donations" add column "store_street_address" text not null;


  create policy "auth can delete inventory_items if >= superadmin"
  on "public"."inventory_items"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "auth can insert inventory_items if >= admin"
  on "public"."inventory_items"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can read inventory_items if >= requestor"
  on "public"."inventory_items"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can update inventory_items if >= superadmin"
  on "public"."inventory_items"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



