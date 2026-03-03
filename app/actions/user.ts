'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import { User, UserUpdate } from '@/app/types/user';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@/app/types/user';

export async function updateUserRole(userId: string, roleId: number) {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('user_roles')
    .update({ role_id: roleId })
    .eq('user_id', userId)
    .select()
    .single();
  if (err) {
    console.error('Error updating user role:', err);
    return { success: false, data: null, error: err.message };
  }
  revalidatePath('/profile');
  revalidatePath('/team/[userId]');
  return { success: true, data: entry as UserRole };
}

export const updateUser = async (userId: string, data: UserUpdate) => {
  const supabase = await createClient();
  const updateData = { email: data.email, first_name: data.first_name, last_name: data.last_name, profile_photo_url: data.profile_photo_url };
  const { error: authError } = await supabase.auth.updateUser({
    email: data.email,
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      profile_photo_url: data.profile_photo_url,
    },
  });

  if (authError) {
    console.error('Auth error:', authError);
    return { success: false, data: null, error: authError.message };
  }

  const { data: updatedUser, error: err } = await supabase
    .from('users')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();
  if (err) {
    console.error('Error updating user:', err);
    return { success: false, data: null, error: err.message };
  }

  revalidatePath('/profile');

  return { success: true, data: updatedUser as User };
};
