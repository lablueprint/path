'use server';

import { Example } from '@/app/types/example';
import { createClient } from '@/app/lib/supabase/server-client';

export const createExampleEntry = async (data: Example) => {
  const supabase = await createClient();
  const { data: entry, error: err } = await supabase
    .from('example')
    .insert(data)
    .select()
    .single();

  if (err) {
    console.error('Error creating example:', err);
    return { success: false, error: err };
  }
  return { success: true, data: entry };
};
