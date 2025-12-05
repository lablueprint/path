"use server"; // directive that indicates that the functions we define are server actions

import { Ticket } from "@/app/types/Ticket";
import { createClient } from "@/app/lib/supabase/server-client";

export async function createTicket(formData: Ticket) {
    const supabase = await createClient();
    // pulling out the error from the insert into tickets table
    const { error: err } = await supabase.from("tickets").insert({
        requestor_user_id: formData.requestor_user_id,
        store_id: formData.store_id,
        status: formData.status,
    });

    if (err) {
        return { success: false, error: err };
    }
    return { success: true };
}

export async function deleteTicket(ticketId: string) {
    const supabase = await createClient();
    const { error: err } = await supabase.from("tickets").delete().eq("ticket_id", ticketId);
    if (err) {
        return { success: false, error: err };
    }
    return { success: true };
}

export async function updateTicketStatus(newStatus: string, ticketId: string) {
    const supabase = await createClient();
    const { error: err } = await supabase.from("tickets").update({status: newStatus }).eq("ticket_id", ticketId);
    if (err) {
        return { success : false, error: err};
    }
    return { success : true };
}
