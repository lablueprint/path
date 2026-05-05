import { createClient } from '@/app/lib/supabase/server-client';
import ProfileForm from '@/app/(main)/profile/components/ProfileForm';
import type { User } from '@/app/types/user';
import UpdatePasswordForm from '@/app/(main)/profile/components/UpdatePasswordForm';
import SignOutButton from '@/app/(main)/profile/components/SignOutButton';

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

  if (err || !profile) {
    console.error('Error fetching profile:', err);
    return <div>User profile not found.</div>;
  }

  return (
    <div className="form-body" style={{ paddingTop: '30px' }}>
      <h1>Profile</h1>
      <div className="form-card">
        <ProfileForm user={profile as User} />
        <UpdatePasswordForm />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 40px 40px',
          }}
        >
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
