drop policy "all authenticated users can delete" on "public"."store_admins";

drop policy "auth can read users if >= requestor" on "public"."users";


  create policy "auth can delete store_admins if can_manage_store"
  on "public"."store_admins"
  as permissive
  for delete
  to authenticated
using (private.can_manage_store(store_id));



  create policy "auth can read users if >= default"
  on "public"."users"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['default'::text, 'requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



