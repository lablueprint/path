'use client';

import { signIn, signUp, signOut } from '@/app/actions/auth';

export default function AuthTestComponent() {
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

  return (
    <div>
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
