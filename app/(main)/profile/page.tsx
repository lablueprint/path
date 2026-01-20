import { createClient } from '@/app/lib/supabase/server-client';
import ProfileForm from './components/ProfileForm';
import type { User } from '@/app/types/user';

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
      <ProfileForm user={profile as User} />
    </div>
  );
}
