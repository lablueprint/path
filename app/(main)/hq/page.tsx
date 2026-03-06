import DonationsExportForm from '@/app/(main)/hq/components/DonationsExportForm';
import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import AddStoreForm from '@/app/(main)/hq/components/AddStoreForm';

export default async function HqPage() {
  const supabase = await createClient();

  const { data, error: err } = await supabase
    .from('donations')
    .select(
      'donation_id, receiver_first_name, receiver_last_name, store_name, items_donated',
    )
    .limit(10);

  const { data: storesData, error: storesErr } = await supabase
    .from('stores')
    .select('store_id, name, street_address');

  if (err) {
    console.error('Error fetching donations:', err);
    return <div>Failed to load data.</div>;
  }

  if (storesErr) {
    console.error('Error fetching stores:', storesErr);
  }

  const stores = storesData || [];

  return (
    <div>
      <h1>HQ</h1>

      <h2>Donations</h2>
      <h3>Recent Donations</h3>
      <table>
        <thead>
          <tr>
            <th>Receiver First Name</th>
            <th>Receiver Last Name</th>
            <th>Store</th>
            <th>Items Donated</th>
          </tr>
        </thead>
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

      <h3>Export Donations</h3>
      <DonationsExportForm />

      <h2>Edit Stores</h2>
      <h3>Edit Store Details</h3>
      {stores.length > 0 ? <StoresList stores={stores} /> : <p>No stores found.</p>}

      <h2>Add Store</h2>
      <AddStoreForm />
    </div>
  );
}