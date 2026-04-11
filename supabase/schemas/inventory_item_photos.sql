create policy "auth can read inventory_item_photos if >= requestor"
on storage.objects for select to authenticated
using (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('requestor', 'admin', 'superadmin', 'owner')
);

create policy "auth can insert inventory_item_photos if >= admin"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('admin', 'superadmin', 'owner')
);

create policy "auth can update inventory_item_photos if >= superadmin"
on storage.objects for update to authenticated
using (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('superadmin', 'owner')
)
with check (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('superadmin', 'owner')
);

create policy "auth can delete inventory_item_photos if >= superadmin"
on storage.objects for delete to authenticated
using (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('superadmin', 'owner')
);
