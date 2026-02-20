'use server';
import DonationForm from './components/DonationForm';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function AddStoreItemsPage({ params, }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.from('stores').select('*').eq('store_id', storeId).single();
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <DonationForm />
    </div>
  );
}
