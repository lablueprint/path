'use server';

import { createClient } from '@/app/lib/supabase/server-client';
import { UserUpdate } from '@/app/types/user';
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

  const updateData: UserUpdate = {};
  if (data.first_name !== undefined) updateData.first_name = data.first_name;
  if (data.last_name !== undefined) updateData.last_name = data.last_name;
  if (data.profile_photo_url !== undefined) {
    updateData.profile_photo_url = data.profile_photo_url;
  }

  if (data.email || data.first_name || data.last_name) {
    const { error: authError } = await supabase.auth.updateUser({
      ...(data.email && { email: data.email }),
      data: {
        ...(data.first_name && { first_name: data.first_name }),
        ...(data.last_name && { last_name: data.last_name }),
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { success: false, data: null, error: authError.message };
    }
  }

  if (updateData) {
    const { error: err } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', userId);

    if (err) {
      console.error('Error updating user:', err);
      return { success: false, data: null, error: err.message };
    }
  }

  revalidatePath('/profile');

  return { success: true, data: null };
};
