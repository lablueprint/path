'use client';

import ProfileForm from './components/ProfileForm';
import type { User } from '@/app/types/user';

export default function PersonalProfilePage() {
    const user: User = {
        user_id: 'example_user_id',
        first_name: 'example_first_name',
        last_name: 'example_last_name',
        email: 'example@example.com',
        profile_photo_url: 'https://example.com/photo.jpg'
    };

    return (
        <div>
            This is a Profile Page.
            <br />
            <ProfileForm user={user} />
        </div>
    );
}
