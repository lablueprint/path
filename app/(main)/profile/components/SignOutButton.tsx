'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { Button, Alert } from 'react-bootstrap';
import { useState } from 'react';

export default function SignOutButton() {
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
      window.location.assign('/home');
    } catch (error) {
      console.error('Sign-out error:', error);
      setErrorMessage('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <Button
        className="btn-submit align-self-start"
        onClick={signOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? 'Signing Out...' : 'Sign Out'}
      </Button>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </>
  );
}
