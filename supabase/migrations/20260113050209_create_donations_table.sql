
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



  create policy "auth can read donations if >= superadmin"
  on "public"."donations"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "auth can update donations if >= superadmin"
  on "public"."donations"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



