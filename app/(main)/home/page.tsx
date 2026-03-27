'use client';

import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign-out error:', error.message);
    }
    router.push('/home');
  }

  return (
    <div>
      <h1>Home</h1>
      <Link href="/home/donate">
        <p>Submit gift-in-kind form</p>
      </Link>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
