drop policy "auth can insert donations if >= admin" on "public"."donations";

drop policy "auth can read stores if >= requestor" on "public"."stores";


  create policy "auth can insert donations if >= default"
  on "public"."donations"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['default'::text, 'requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can read stores if >= default"
  on "public"."stores"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['default'::text, 'requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



