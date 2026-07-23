import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import LightweightDonationForm from '@/app/(main)/home/donate/components/LightweightDonationForm';
import { createClient } from '@/app/lib/supabase/server-client';
import { Alert } from 'react-bootstrap';

export default async function DonationPage() {
  const supabase = await createClient();

  const { data: stores, error } = await supabase
    .from('stores')
    .select('name, street_address')
    .overrideTypes<
      {
        name: string;
        street_address: string;
      }[],
      { merge: false }
    >();

  if (error) {
    return <Alert variant="danger">Failed to load stores.</Alert>;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // extract user id
  const userId = user?.id;

  // fetch user's entry from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userError) return <Alert variant="danger">Failed to load user.</Alert>;

  return (
    <>
      <Breadcrumbs
        labelMap={{
          home: 'Home',
          donate: 'Record Gift-in-Kind',
        }}
      />
      <h1>Record Gift-in-Kind</h1>
      <LightweightDonationForm stores={stores || []} user={userData} />
    </>
  );
}
