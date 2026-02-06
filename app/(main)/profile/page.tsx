import { createClient } from '@/app/lib/supabase/server-client';
import ProfileForm from './components/ProfileForm';
import type { User } from '@/app/types/user';
import { UpdatePasswordForm } from './components/UpdatePasswordForm';

export default async function PersonalProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <div>Please sign in.</div>;
  }

  const { data: profile, error: err } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (err) {
    console.error('Error fetching profile:', err);
  }

  if (!profile) {
    return <div>User profile not found.</div>;
  }

  return (
    <div>
      <h2>Public Profile</h2>
      <ProfileForm user={profile as User} />
      <h2>Authentication</h2>
      <UpdatePasswordForm />
    </div>
  );
}
