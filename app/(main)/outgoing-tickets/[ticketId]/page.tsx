'use server';
import { createClient } from '@/app/lib/supabase/server-client';

interface OutGoingTicketsDetailsPageProps{
    params: {
        ticketId : string;
    };
}

async function fetchTicket(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}


async function fetchStore(storeId: string) {
    const supabase = await createClient();
    const { error, data } = await supabase
        .from('stores')
        .select('*')
        .eq('store_id', storeId)
        .single()
    if (error) throw error;
    return data; 
}
export default async function OutGoingTicketsDetailsPage({
    params
}: OutGoingTicketsDetailsPageProps) {
    const { ticketId } = await params;
    //1. Fetch Ticket
    const ticket = await fetchTicket(ticketId)
    if(!ticketId){
        throw new Error('Ticket not found');
    }

    //2. Fetch store using ticket object
    const store = await fetchStore(ticket.store_id);
    if(!ticket.store_id){
        throw new Error('Store not found')
    }
    return (
        <div>{ticket.status}</div>
    );
}