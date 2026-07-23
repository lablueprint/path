import { createClient } from '@/app/lib/supabase/server-client';
import ProfileForm from '@/app/(main)/profile/components/ProfileForm';
import type { User } from '@/app/types/user';
import UpdatePasswordForm from '@/app/(main)/profile/components/UpdatePasswordForm';
import SignOutButton from '@/app/(main)/profile/components/SignOutButton';
import { Alert } from 'react-bootstrap';

export default async function PersonalProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

  const { data: profile, error: err } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (err || !profile) {
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

  return (
    <>
      <h1>Profile</h1>
      <ProfileForm user={profile as User} />
      <h2>Change Password</h2>
      <UpdatePasswordForm />
      <SignOutButton />
    </>
  );
}
