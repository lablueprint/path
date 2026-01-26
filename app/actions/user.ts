'use server';

import { createClient } from '@/app/lib/supabase/server-client';
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
    console.error('Error creating example:', err);
    return { success: false, data: null, error: err.message };
  }
  console.log(entry);
  revalidatePath('/profile');
  revalidatePath('/team/[userId]');
  return { success: true, data: entry as UserRole };
}
