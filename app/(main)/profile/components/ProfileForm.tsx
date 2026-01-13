import type { User } from '@/app/types/user';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user'

export default function ProfileForm( {user} : {user: User} ) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            first_name: user.first_name ?? 'unknown_first_name',
            last_name: user.last_name ?? 'unknown_last_name',
        },
    });

    const onSubmit = (data: { first_name: string; last_name: string }) => {
        updateUser(user.user_id, {
            first_name: data.first_name,
            last_name: data.last_name,
            email: user.email,
            profile_photo_url: user.profile_photo_url,
        });
    };

    return (
        <div>This is the profile form.
            <form onSubmit={handleSubmit(onSubmit)}>
                <br />
                {/* First name */}
                <div>
                    <label>First name</label>
                    <input {...register('first_name', { required: true })} />
                </div>
                <br />
                {/* Last name */}
                <div>
                    <label>Last name</label>
                    <input {...register('last_name', { required: true })} />
                </div>
                <br />
                {/* save button */}
                <button type='submit'>Save</button>
            </form>
        </div>
    );
}