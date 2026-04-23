import DonationsExportForm from '@/app/(main)/hq/components/DonationsExportForm';
import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/(main)/components/StoresList';
import AddStoreForm from '@/app/(main)/hq/components/AddStoreForm';
import { Table } from 'react-bootstrap';
import styles from '@/app/(main)/hq/page.module.css';

export default async function HqPage() {
  const supabase = await createClient();

  const { data, error: err } = await supabase
    .from('donations')
    .select(
      'donation_id, receiver_first_name, receiver_last_name, store_name, items_donated, date_submitted',
    )
    .limit(10);

  const { data: storesData, error: storesErr } = await supabase
    .from('stores')
    .select('store_id, name, street_address, photo_url');

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
      <Table borderless>
        <thead>
          <tr>
            <th className={`w-20`}>Receiver</th>
            <th className={`w-20 `}>Store</th>
            <th className={`w-30`}>Items Donated</th>
            <th className={`w-30`}>Date Submitted</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.donation_id}>
              <td>
                {item.receiver_first_name} {item.receiver_last_name}
              </td>
              <td>{item.store_name}</td>
              <td>{item.items_donated}</td>
              <td>{new Date(item.date_submitted).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Export Donations</h3>
      <DonationsExportForm />

      <h2>Stores</h2>
      <h3>Add Store</h3>
      <AddStoreForm />
      <h3>Edit Stores</h3>
      {stores.length > 0 ? (
        <StoresList stores={stores} />
      ) : (
        <p>No stores found.</p>
      )}
    </div>
  );
}
