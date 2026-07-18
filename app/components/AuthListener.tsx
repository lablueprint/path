'use client';

import { useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';

const supabase = createClient();

export default function AuthListener() {
  useEffect(() => {
    // Listen for Supabase Auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth event:', event, session?.user);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return null;
}
