alter table "public"."stores" add column "photo_url" text;


  create policy "auth can delete store_photos if >= superadmin"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'store_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))));



  create policy "auth can insert store_photos if >= superadmin"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'store_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))));



  create policy "auth can read store_photos if >= requestor"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'store_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text]))));



  create policy "auth can update store_photos if >= superadmin"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'store_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))))
with check (((bucket_id = 'store_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))));



