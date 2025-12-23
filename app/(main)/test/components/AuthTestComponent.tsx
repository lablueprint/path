'use client';

import { signIn, signUp, signOut } from '@/app/actions/auth';
import { createClient } from '@/app/lib/supabase/browser-client';

export default function AuthTestComponent() {
  const supabase = createClient();

  const data = {
    email: 'test@test.org',
    password: 'test123***',
  };

  const handleSignIn = async () => {
    await signIn(data);
  };

  const handleSignUp = async () => {
    await signUp(data);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleRefresh = async () => {
    const { error: err } = await supabase.auth.refreshSession();

    if (err) {
      console.error('Error refreshing session:', err.message);
    } else {
      console.log('Refresh successful!');
    }
  };

  const handleGetClaims = async () => {
    const { data, error: err } = await supabase.auth.getClaims();
    if (err) {
      console.error('Error getting claims:', err.message);
    } else if (data) {
      console.log(data.claims);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignOut}>Sign out</button>
      <button onClick={handleRefresh}>Refresh auth session</button>
      <button onClick={handleGetClaims}>Get JWT claims</button>
    </div>
  );
}
