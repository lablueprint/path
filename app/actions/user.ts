'use server';

import { User, UserUpdate } from '@/app/types/user';
import { createClient } from '@/app/lib/supabase/server-client';
import { revalidatePath } from 'next/cache';

export const updateUser = async (userId: string, data: UserUpdate) => {
  const supabase = await createClient();
  const updateData = { first_name: data.first_name, last_name: data.last_name };
  const { data: authData, error: authError } = await supabase.auth.updateUser({
    email: data.email,
    data: {
    first_name: data.first_name,
    last_name: data.last_name,
    },
  });
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
