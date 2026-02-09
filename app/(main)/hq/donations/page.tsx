'use server';
import DonationsExportForm from './components/DonationsExportForm';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function DonationsPage() {
  const supabase = await createClient();

  const { data, error: err } = await supabase
    .from('donations')
    .select(
      'donation_id, receiver_first_name, receiver_last_name, store_name, items_donated',
    )
    .limit(10);

  if (err) {
    console.error('Error fetching donations:', err);
    return <div>Failed to load data.</div>;
  }
  return (
    <>
      <p>Donations Table: </p>
      <table>
        <tbody>
          {data.map((item) => (
            <tr key={item.donation_id}>
              <td>{item.receiver_first_name}</td>
              <td>{item.receiver_last_name}</td>
              <td>{item.store_name}</td>
              <td>{item.items_donated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Form:</p>
      <DonationsExportForm />
    </>
  );
}
