import Link from 'next/link';

import ActionButton from '@/app/(main)/home/components/ActionButton';
import { createClient } from '@/app/lib/supabase/server-client';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    console.error('Error fetching claims:', claimsError);
  }

  const userRole = claimsData?.claims?.user_role;

  return (
    <>
      <h1>Home</h1>

      <ActionButton
        text="Submit gift-in-kind form"
        url="/home/donate"
      />

      {['requestor', 'admin', 'superadmin', 'owner'].includes(
        userRole ?? '',
      ) && (
        <ActionButton text="Request inventory" url="/request" />
      )}

      {['admin', 'superadmin', 'owner'].includes(userRole ?? '') && (
        <ActionButton text="Manage inventory" url="/manage" />
      )}

      {['superadmin', 'owner'].includes(userRole ?? '') && (
        <ActionButton text="HQ" url="/hq" />
      )}
    </>
  );
}

