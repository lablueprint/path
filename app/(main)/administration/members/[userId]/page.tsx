import { createClient } from '@/app/lib/supabase/server-client';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import Dropdown from '@/app/(main)/administration/members/[userId]/components/Dropdown';
import Image from 'next/image';
import styles from '@/app/(main)/profile/components/ProfileForm.module.css';
import imagePlaceholder from '@/public/image-placeholder.svg';
import { Alert } from 'react-bootstrap';

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

  if (userErr || userRoleErr) {
    return <Alert variant="danger">Failed to load users.</Alert>;
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
              className="object-fit-cover"
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

          <div className="two-col-row">
            <div>
              <p className={styles.textLabel}>Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className={styles.textLabel}>Phone</p>
              <p>{user.phone}</p>
            </div>
          </div>
          <Dropdown userId={userId} roleId={role?.role_id} />
        </div>
      </div>
    </>
  );
}
