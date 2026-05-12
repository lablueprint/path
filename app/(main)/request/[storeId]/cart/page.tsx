import { createClient } from '@/app/lib/supabase/server-client';
import TicketItemsList from '@/app/(main)/components/TicketItemsList';
import SubmitTicketButton from '@/app/(main)/request/components/SubmitTicketButton';
import Link from 'next/link';
import styles from '@/app/(main)/request/CartPage.module.css';
export default async function CartPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ submitted?: string; ticketId?: string }>;
}) {
  const { storeId } = await params;
  const { submitted, ticketId } = await searchParams;
  const showSuccess = submitted === '1' && !!ticketId;
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>User not found</div>;
  }

  // Query for draft ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('store_id', storeId)
    .eq('requestor_user_id', user.id)
    .eq('status', 'draft')
    .single();

  if (ticketError || !ticket) {
    return (
      <div>
        <h1>Cart</h1>
        {showSuccess && (
          <div>
            <p>Ticket submitted successfully!</p>
            <Link href={`/outgoing-tickets/${ticketId}`}>Go to ticket</Link>
          </div>
        )}
        <div className={styles.itemsCard}>
          <div className={styles.itemsCardHeader}>
            <h1>ITEMS</h1>
            <h2>0 in-stock · 0 out-of-stock</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Cart</h1>
      {showSuccess && (
        <div>
          <p>Ticket submitted successfully!</p>
          <Link href={`/outgoing-tickets/${ticketId}`}>Go to ticket</Link>
        </div>
      )}
      <div>
        <TicketItemsList ticketId={ticket.ticket_id} />
        <SubmitTicketButton ticketId={ticket.ticket_id} />
      </div>
    </div>
  );
}
