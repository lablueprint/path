'use server';

import { Donation, DonationInsert } from '@/app/types/donation';
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
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Donation }; // return the row that was created
}

// deletes donation based on donation_id
export async function deleteDonation(donationId: string) {
  const supabase = await createClient();

  const { data: entry, error: err } = await supabase
    .from('donations')
    .delete()
    .eq('donation_id', donationId)
    .select()
    .single();

  if (err) {
    console.error('Error deleting donation:', err);
    return { success: false, data: null, error: err.message };
  }
  return { success: true, data: entry as Donation };
}

export async function exportDonations() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('donations').select().csv();
  if (error) {
    console.error('Error exporting donations:', error.message);
    return { success: false, data: null, error: error.message };
  }
  if (data) {
    return { success: true, data };
  }
}

export async function exportDonationsInRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('donations')
    .select()
    .gte('date_submitted', startDate)
    .lte('date_submitted', endDate)
    .csv();
  if (error) {
    console.error('Error exporting donations in range:', error.message);
    return { success: false, data: null, error: error.message };
  }
  if (data) {
    return { success: true, data };
  }
}
