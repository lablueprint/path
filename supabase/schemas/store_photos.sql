create policy "auth can read store_photos if >= requestor" on storage.objects for
select
  to authenticated using (
    bucket_id = 'store_photos'
    and (auth.jwt () ->> 'user_role') in ('requestor', 'admin', 'superadmin', 'owner')
  );

create policy "auth can insert store_photos if >= superadmin" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'store_photos'
    and (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
  );

create policy "auth can update store_photos if >= superadmin" on storage.objects
for update
  to authenticated using (
    bucket_id = 'store_photos'
    and (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
  )
with
  check (
    bucket_id = 'store_photos'
    and (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
  );

create policy "auth can delete store_photos if >= superadmin" on storage.objects for delete to authenticated using (
  bucket_id = 'store_photos'
  and (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
);
