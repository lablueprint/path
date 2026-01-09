'use client';

import { createDonation, deleteDonation } from '@/app/actions/donation';

export default function DonationsTestComponent() {
  const handleCreate = async () => {
    try {
      const donation = await createDonation({
        receiver_user_id: '00000000-0000-0000-0000-000000000000',
        store_id: null,
        donor_is_individual: true,
        donor_individual_name: 'Test User',
        donor_business_name: 'Donor Business Name',
        donor_business_contact_name: 'Ms. Donor',
        donor_email: 'test@example.com',
        donor_phone: '123-456-7890',
        donor_street_address: '1234 Bruin Ave',
        donor_receive_mailings: false,
        donor_receive_emails: true,
        donor_remain_anonymous: false,
        estimated_value: 50,
        items_donated: 'Items donated!',
      });

      console.log('Created donation:', donation);
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const handleDelete = async () => {
    const idToDelete = '40b188ab-e9a1-444d-9e6b-6b99d5017c90'; // hard-coded ID for now
    try {
      const result = await deleteDonation(idToDelete);
      console.log('Deleted donation:', result);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Donations</h1>
      <button onClick={handleCreate}>Create Donation</button>
      <button onClick={handleDelete} style={{ marginLeft: 10 }}>
        Delete Donation
      </button>
    </div>
  );
}
