create policy "auth can read profile_photos if >= requestor" on storage.objects for
select
  to authenticated using (
    bucket_id = 'profile_photos'
    and (auth.jwt () ->> 'user_role') in ('requestor', 'admin', 'superadmin', 'owner')
    and (storage.foldername (name)) [1] = auth.uid ()::text
  );

create policy "auth can insert profile_photos if user_id" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'profile_photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()::text
    )
  );

create policy "auth can update profile_photos if user_id" on storage.objects
for update
  to authenticated using (
    bucket_id = 'profile_photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()::text
    )
  )
with
  check (
    bucket_id = 'profile_photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()::text
    )
  );

create policy "auth can delete profile_photos if user_id" on storage.objects for delete to authenticated using (
  bucket_id = 'profile_photos'
  and (storage.foldername (name)) [1] = auth.uid ()::text
);
