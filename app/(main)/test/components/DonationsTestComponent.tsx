'use client';

import { createDonation, deleteDonation } from '@/app/actions/donation';
import { useState } from 'react';

export default function DonationsTestComponent() {
  const [idToDelete, setIdToDelete] = useState('');

  const handleCreate = async () => {
    try {
      const result = await createDonation({
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
        receiver_first_name: 'DonorFirst',
        receiver_last_name: 'DonorLast',
        store_name: 'Example Store',
        store_street_address: '1234 Example St',
      });

      console.log('Created donation:', result);
      
      if (result.success && result.data) {
        setIdToDelete(result.data.donation_id);
      }
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const handleDelete = async () => {
    if (!idToDelete) {
      alert('Please enter a valid UUID to delete');
      return;
    }

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
