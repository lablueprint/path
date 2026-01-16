import { createClient } from '@/app/lib/supabase/server-client';
import ProfileForm from './components/ProfileForm';
import type { User } from '@/app/types/user';

export default async function PersonalProfilePage() {
    const supabase = await createClient();

    const { data: { user }, } = await supabase.auth.getUser();
    console.log('AUTH USER ID (server):', user?.id);
    if (!user) { return <div>Please sign in.</div>; }

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();
    console.log('profile error:', error);
    if (!profile) { return <div>User profile not found.</div>; }

    return (
        <div>
            This is a Profile Page.
            <br />
            <ProfileForm user={profile as User} />
        </div>
    );
}