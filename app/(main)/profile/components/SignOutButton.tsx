'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function signOut() {
    setIsSigningOut(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign-out error:', error.message);
        setErrorMessage(error.message ?? 'Failed to sign out.');
        return;
      }
      router.push('/home');
    } catch (error) {
      console.error('Sign-out error:', error);
      setErrorMessage('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button onClick={signOut} disabled={isSigningOut}>
        {isSigningOut ? 'Signing out...' : 'Sign Out'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </>
  );
}
