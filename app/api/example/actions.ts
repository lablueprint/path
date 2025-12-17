'use server';

import { Example } from '@/app/types/example';
import { createClient } from '@/app/lib/supabase/server-client';

export const createExampleEntry = async (data: Example) => {
  const supabase = await createClient();
  const { error } = await supabase.from('example').insert(data);

  if (error) {
    throw error;
  }
};
