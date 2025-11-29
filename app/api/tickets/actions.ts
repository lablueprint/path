"use server"; // directive that indicates that the functions we define are server actions

import { createClient } from "@/app/lib/supabase/server-client";

/*export async function createTicket(formData) {
    const supabase = await createClient();
    // pulling out the error from the insert into tickets table
    const { error: err } = await supabase.from('tickets').insert({ticket_id: })
}*/
