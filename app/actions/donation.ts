'use server';

import { DonationInsert } from '@/app/types/donation';
import { createClient } from '@/app/lib/supabase/server-client';

export async function createDonation(data: DonationInsert) {
  const supabase = await createClient();

  const { data: entry, error: err } = await supabase
    .from('donations')
    .insert(data)
    .select() // after inserting, return full new row
    .single(); // expect just one row, if more or less, throw an error

  if (err) {
    console.error('Error creating donation:', err);
    return { success: false, error: err.message };
  }
  return { success: true, data: entry }; // return the row that was created
}

// deletes donation based on donation_id
export async function deleteDonation(donationId: string) {
  const supabase = await createClient();

  const { error: err } = await supabase
    .from('donations')
    .delete()
    .eq('donation_id', donationId);

  if (err) {
    console.error('Error deleting donation:', err);
    return { success: false, error: err.message };
  }
  return { success: true };
}
