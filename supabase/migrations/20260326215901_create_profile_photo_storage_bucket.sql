alter table "public"."users" alter column "email" drop not null;

alter table "public"."users" alter column "first_name" drop not null;

alter table "public"."users" alter column "last_name" drop not null;


  create policy "auth can delete profile_photos if user_id"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'profile_photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "auth can insert profile_photos if user_id"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'profile_photos'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



  create policy "auth can read profile_photos if >= requestor"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'profile_photos'::text) AND ((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "auth can update profile_photos if user_id"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'profile_photos'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))))
with check (((bucket_id = 'profile_photos'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



