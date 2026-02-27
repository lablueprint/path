'use server';
import DonationForm from './components/DonationForm';
import { createClient } from '@/app/lib/supabase/server-client';

import { StoreItemsDonationForm } from './components/StoreItemsForm'

export default async function AddStoreItemsPage({ params, }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const supabase = await createClient()
  // fetch store's entry
  const { data: storeData, error } = await supabase.from('stores').select('*').eq('store_id', storeId).single();
  const { data: { user } } = await supabase.auth.getUser()
  // extract user id
  const userId = user?.id
  // fetch user's entry from users table
  const { data: userData, error: userError } = await supabase.from('users').select('*').eq('user_id', userId).single()


  return (
    <div>
      <DonationForm />
      <StoreItemsDonationForm store={storeData} user={userData} />
    </div>
  );
}
