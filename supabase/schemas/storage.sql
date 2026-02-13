create policy "auth can read profile_photos if >= requestor"
on storage.objects  
for select
to authenticated
using (
  bucket_id = 'profile_photos' 
  AND 
  (auth.jwt() ->> 'user_role') IN ('requestor', 'admin', 'superadmin', 'owner')
  AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "auth can insert profile_photos if user_id"
on storage.objects
for insert 
to authenticated 
with check (
    bucket_id = 'profile_photos' AND
    (storage.foldername(name))[1] = (select auth.uid()::text)
);


create policy "auth can update profile_photos if user_id"
on storage.objects
for update 
to authenticated 
with check (
    bucket_id = 'profile_photos' AND
    (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "auth can delete profile_photos if user_id" 
on storage.objects
for delete 
to authenticated 
using (
  bucket_id = 'profile_photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
