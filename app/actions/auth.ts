'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server-client';

export async function signIn(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error: err } = await supabase.auth.signInWithPassword(data);

  if (err) {
    console.error('Error signing in:', err);
    // TODO: Redirect to error page
    redirect('/test');
  }
  revalidatePath('/', 'layout');
  // TODO: Redirect to home page
  redirect('/test');
}

export async function signUp(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error: err } = await supabase.auth.signUp(data);

  if (err) {
    console.error('Error signing up:', err);
    // TODO: Redirect to error page
    redirect('/test');
  }
  revalidatePath('/', 'layout');
  // TODO: Redirect to home page
  redirect('/test');
}

export async function signOut() {
  const supabase = await createClient();

  // Check if a user is signed in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.signOut();
  }
  revalidatePath('/', 'layout');
  // TODO: Redirect to sign-up page
  redirect('/test');
}
