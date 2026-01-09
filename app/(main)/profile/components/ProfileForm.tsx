import type { User } from '@/app/types/user';
import { useForm } from 'react-hook-form';

export default function ProfileForm( {user} : {user: User} ) {
    const { register } = useForm({
        defaultValues: {
            first_name: user.first_name ?? 'unknown_first_name',
            last_name: user.last_name ?? 'unknown_last_name',
        },
    });

    return (
        <div>This is the profile form.
            <form>
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
                <button
                    type='submit'
                >
                    Save
                </button>
            </form>
        </div>
    );
}