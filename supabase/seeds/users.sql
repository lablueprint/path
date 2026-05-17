update public.users
set
  profile_photo_url = 'http://127.0.0.1:54321/storage/v1/object/public/profile_photos/00000000-0000-0000-0000-000000000001/profile.jpg'
where
  user_id = '00000000-0000-0000-0000-000000000001';
