'use client';
import { createClient } from '@/app/lib/supabase/browser-client';

export default function HomePage() {
  const supabase = createClient();
  async function SignOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <div>
      <div>Welcome to PATH! This is the home page.</div>
      <button onClick={SignOut}>Sign Out</button>
    </div>
  );
}
