import LightweightDonationForm from '@/app/(main)/home/donate/components/LightweightDonationForm';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function DonationPage() {
  const supabase = await createClient();

  const { data: stores, error } = await supabase
    .from('stores')
    .select('name');

  if (error) {
    console.error('Error fetching stores:', error);
  }

  const storeNames = stores?.map((store: any) => store.name) || [];

  return <LightweightDonationForm storeNames={storeNames} />;
}