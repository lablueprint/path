'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { Button } from 'react-bootstrap';

export default function SignOutButton() {
  const supabase = createClient();
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign-out error:', error.message);
    }
    window.location.assign('/home');
  }

  return (
    <Button className="btn-submit" onClick={signOut}>
      Sign Out
    </Button>
  );
}
