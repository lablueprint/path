'use server';
import React from 'react';
import { createClient } from '@/app/lib/supabase/server-client';
import Dropdown from './components/Dropdown';

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: user, error: user_err } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
  const { data: user_roles, error: user_role_err } = await supabase
    .from('user_roles')
    .select(`role_id, roles(role_id)`)
    .eq('user_id', userId)
    .single();

  if (user_err) {
    console.error('Error fetching users:', user_err);
    return <div>Failed to load data.</div>;
  }

  if (user_role_err) {
    console.error('Error fetching user role:', user_role_err);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <p>
        Full Name: {user.first_name || 'No FirstName'}{' '}
        {user.last_name || 'No LastName'}
      </p>
      <p>Email: {user.email}</p>
      <p>Role Id: {user_roles?.role_id} </p>
      <Dropdown userId={userId} roleId={user_roles?.role_id} />
    </div>
  );
}
