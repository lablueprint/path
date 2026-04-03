'use client';

import { useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useUserStore } from '@/app/lib/store/user-store';

const supabase = createClient();

export default function AuthListener() {
  const { setId, setRole, setIsLoading, clearUserStore } = useUserStore();

  useEffect(() => {
    // Listen for Supabase Auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      console.log('Supabase Auth event:', event, session?.user);
      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED'
      ) {
        if (session && session.user) {
          setId(session.user.id);
          const { data } = await supabase.auth.getClaims(session.access_token);
          setRole(data?.claims.user_role);
        }
      } else if (event === 'SIGNED_OUT') {
        clearUserStore();
      }
      setIsLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setId, setRole, setIsLoading, clearUserStore]);
  return null;
}
