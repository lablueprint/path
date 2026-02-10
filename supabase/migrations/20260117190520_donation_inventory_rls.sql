drop policy "public can delete entries in donations" on "public"."donations";

drop policy "public can insert entries in donations" on "public"."donations";

drop policy "public can read entries in donations" on "public"."donations";

drop policy "public can update entries in donations" on "public"."donations";

drop policy "public can delete entries in inventory_items" on "public"."inventory_items";

drop policy "public can insert entries in inventory_items" on "public"."inventory_items";

drop policy "public can select entries in inventory_items" on "public"."inventory_items";

drop policy "public can update entries in inventory_items" on "public"."inventory_items";

drop policy if exists "public can delete entries in stores" on "public"."stores";

drop policy if exists "public can insert entries in stores" on "public"."stores";

drop policy if exists "public can read entries in stores" on "public"."stores";

drop policy if exists "public can update entries in stores" on "public"."stores";

alter table "public"."donations" drop column "receiver_user_id";

alter table "public"."donations" drop column "store_id";

alter table "public"."donations" add column "receiver_first_name" text not null;

alter table "public"."donations" add column "receiver_last_name" text not null;

alter table "public"."donations" add column "store_name" text;

alter table "public"."donations" add column "store_street_address" text;


  create policy "auth can delete donations if >= superadmin"
  on "public"."donations"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "auth can insert donations if >= admin"
  on "public"."donations"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can read donations if >= admin"
  on "public"."donations"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can update donations if >= superadmin"
  on "public"."donations"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])))
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



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
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])))
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "public can delete entries in stores"
  on "public"."stores"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "public can insert entries in stores"
  on "public"."stores"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "public can read entries in stores"
  on "public"."stores"
  as permissive
  for select
  to authenticated
using (true);



  create policy "public can update entries in stores"
  on "public"."stores"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



