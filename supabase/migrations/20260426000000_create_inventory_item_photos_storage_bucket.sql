create policy "auth can read inventory_item_photos if >= requestor"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'inventory_item_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text]))));



create policy "auth can insert inventory_item_photos if >= admin"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'inventory_item_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text, 'owner'::text]))));



create policy "auth can update inventory_item_photos if >= superadmin"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'inventory_item_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))))
with check (((bucket_id = 'inventory_item_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))));



create policy "auth can delete inventory_item_photos if >= superadmin"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'inventory_item_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text]))));
