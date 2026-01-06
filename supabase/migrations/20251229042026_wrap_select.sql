drop policy "auth can read user_roles if >= requestor" on "public"."user_roles";


  create policy "auth can read user_roles if >= requestor"
  on "public"."user_roles"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



