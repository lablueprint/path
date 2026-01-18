import { createClient } from '@/app/lib/supabase/server-client';

export default async function ticketIdPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userTicket, error: err } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();

  if (err) {
    console.error('Error fetching tickets:', err);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      {userTicket ? (
        <div>
          <h1>Ticket - {userTicket.ticket_id}</h1>
          <h2>Your Email Address: {user?.email ? user.email : "User not Found"} </h2>
          <h3>---Your Requestor ID: {userTicket.requestor_user_id}---</h3>
          <h2>Store ID: {userTicket.store_id}</h2>
          <h2>Status: {userTicket.status}</h2>
        </div>
      ) : (
        <h1>Ticket Not Found</h1>
      )}
      <a href="./"><button>--Back--</button></a>
    </div>
  );
}
