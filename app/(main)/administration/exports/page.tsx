import DonationsExportForm from '@/app/(main)/administration/exports/components/DonationsExportForm';
import { createClient } from '@/app/lib/supabase/server-client';
import { Table } from 'react-bootstrap';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function ExportsPage() {
  const supabase = await createClient();

  const { data, error: err } = await supabase
    .from('donations')
    .select(
      'donation_id, receiver_first_name, receiver_last_name, store_name, items_donated, date_submitted',
    )
    .limit(10);

  if (err) {
    console.error('Error fetching donations:', err);
    return <div>Failed to load data.</div>;
  }

  const sortedDonations = [...data].sort((a, b) =>
    b.date_submitted.localeCompare(a.date_submitted),
  );

  return (
    <>
      <Breadcrumbs />
      <h1>Exports</h1>
      <h2>Export Gift-in-Kind Records</h2>
      <DonationsExportForm />
      <h2>Recent Gift-in-Kind Records</h2>
      <Table borderless>
        <thead className="table-header">
          <tr>
            <th>Receiver</th>
            <th>Store</th>
            <th>Items Donated</th>
            <th>Date Submitted</th>
          </tr>
        </thead>
        <tbody>
          {sortedDonations.map((item) => (
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
    </>
  );
}
