import { createClient } from '@/app/lib/supabase/server-client';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Dropdown from '@/app/(main)/administration/members/[userId]/components/Dropdown';
import Image from 'next/image';
import styles from '@/app/(main)/profile/components/ProfileForm.module.css';
import imagePlaceholder from '@/public/image-placeholder.svg';

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
    <>
      <Breadcrumbs
        labelMap={{
          [`/administration/members/${userId}`]: `${user.first_name || 'FirstName'} ${user.last_name || 'LastName'}`,
        }}
      />
      <h1>
        {user.first_name} {user.last_name}
      </h1>
      {/* same styling as profile page */}
      <div className={`form-card ${styles.card}`}>
        <div className={`form-body ${styles.cardBody}`}>
          <div className={styles.avatarCircle}>
            <Image
              src={user.profile_photo_url || imagePlaceholder}
              alt={user.first_name + ' ' + user.last_name}
              width={96}
              height={96}
              unoptimized
            />
          </div>

          <div className="two-col-row">
            <div>
              <p className={styles.textLabel}>First Name</p>
              <p>{user.first_name}</p>
            </div>
            <div>
              <p className={styles.textLabel}>Last Name</p>
              <p>{user.last_name}</p>
            </div>
          </div>

          <div>
            <p className={styles.textLabel}>Email</p>
            <p>{user.email}</p>
          </div>

          <Dropdown userId={userId} roleId={role?.role_id} />
        </div>
      </div>
    </>
  );
}
