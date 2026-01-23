"use server";

import { DonationInsert } from '@/app/types/donation';
import { createClient } from '@/app/lib/supabase/server-client';

export async function createDonation(data: DonationInsert) {
    const supabase = await createClient();

    const { data: inserted, error } = await supabase
        .from("donations")
        .insert(data)
        .select() // after inserting, return full new row
        .single(); // expect just one row, if more or less, throw an error

        if (error) {
            console.error("Error creating donation: ", error);
            throw new Error(error.message);
        }

        return inserted; // return the row that was created
}

// deletes donation based on donation_id
export async function deleteDonation(donation_id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("donations")
        .delete()
        .eq("donation_id", donation_id);
    
    if (error) {
        console.error("Error deleting donation:", error);
        throw new Error(error.message);
    }

    return { success: true };
}

