'use client';

import { useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useUserStore } from '@/app/lib/store/user-store';

export default function InStockTicketItemCard() {
  const supabase = createClient();

  const { setId, setRole, setLoading, clearUserStore } = useUserStore();

  useEffect(() => {
    setLoading(true);
    // Listen for Supabase Auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [setId, setRole, setLoading, clearUserStore]);
  return null;
}
