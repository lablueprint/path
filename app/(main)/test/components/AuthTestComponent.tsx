'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { useUserStore } from '@/app/lib/store/user-store';

export default function AuthTestComponent() {
  const supabase = createClient();

  const data = {
    email: 'luka@mavs.org',
    password: 'test123***',
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword(data);
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      },
    });
    if (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleRefresh = async () => {
    await supabase.auth.refreshSession();
  };

  const handleGetClaims = async () => {
    const { data } = await supabase.auth.getClaims();
    if (data) {
      console.log(data.claims);
    }
  };

  const role = useUserStore((state) => state.role);

  return (
    <div>
      <div>{role ? <div>Logged in as {role}.</div> : null}</div>
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignOut}>Sign out</button>
      <button onClick={handleRefresh}>Refresh auth session</button>
      <button onClick={handleGetClaims}>Get JWT claims</button>
    </div>
  );
}
