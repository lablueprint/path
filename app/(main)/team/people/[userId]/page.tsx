import { createClient } from '@/app/lib/supabase/server-client';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Dropdown from '@/app/(main)/team/people/[userId]/components/Dropdown';
import Image from 'next/image';
import imagePlaceholder from '@/public/image-placeholder.svg'

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: role, error: userRoleErr } = await supabase
    .from('user_roles')
    .select(`role_id, roles(role_id)`)
    .eq('user_id', userId)
    .single();

  if (userErr) {
    console.error('Error fetching users:', userErr);
    return <div>Failed to load data.</div>;
  }

  if (userRoleErr) {
    console.error('Error fetching user role:', userRoleErr);
    return <div>Failed to load data.</div>;
  }

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          '/team': 'Team',
          '/team/people': 'People',
          [`/team/people/${userId}`]: `${user.first_name || 'FirstName'} ${user.last_name || 'LastName'}`,
        }}
      />

      <Image
        src={user.profile_photo_url || imagePlaceholder}
        alt={`Profile picture for ${user.first_name}`}
        height={64}
        width={64}
        unoptimized
      />
      <p>
        Name: {user.first_name || 'FirstName'} {user.last_name || 'LastName'}
      </p>
      <p>Email: {user.email}</p>
      <Dropdown userId={userId} roleId={role?.role_id} />
    </div>
  );
}
