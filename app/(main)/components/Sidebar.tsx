import Link from 'next/link';
import styles from '@/app/(main)/components/Sidebar.module.css';
import Image from 'next/image';
import { createClient } from '@/app/lib/supabase/server-client';
import SidebarNavLink from './SidebarNavLink';

type Role = 'default' | 'requestor' | 'admin' | 'superadmin' | 'owner';

export default async function Sidebar() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.auth.getClaims();
  const role = data?.claims?.user_role as Role | undefined;

  if (!user || !role) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name, profile_photo_url')
    .eq('user_id', user.id)
    .single();

  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const profilePhotoUrl = profile?.profile_photo_url || '';
  const displayName = `${firstName} ${lastName}`.trim() || 'Profile';

  const sidebarGroups = [
    {
      heading: 'Requesting',
      links: [
        {
          label: 'Request Inventory',
          href: '/request',
          allowedRoles: ['requestor', 'admin', 'superadmin', 'owner'],
        },
        {
          label: 'Outgoing Tickets',
          href: '/outgoing-tickets',
          allowedRoles: ['requestor', 'admin', 'superadmin', 'owner'],
        },
      ],
    },
    {
      heading: 'Managing',
      links: [
        {
          label: 'Manage Inventory',
          href: '/manage',
          allowedRoles: ['admin', 'superadmin', 'owner'],
        },
        {
          label: 'Incoming Tickets',
          href: '/incoming-tickets',
          allowedRoles: ['admin', 'superadmin', 'owner'],
        },
        {
          label: 'Team',
          href: '/team',
          allowedRoles: ['requestor', 'admin', 'superadmin', 'owner'],
        },
        {
          label: 'HQ',
          href: '/hq',
          allowedRoles: ['superadmin', 'owner'],
        },
      ],
    },
  ];

  return (
    <aside>
      <nav className={styles.navContainer}>
        <Link href="/home" className={styles.pathHomeLink}>
          <Image
            src="/path.png"
            alt="Path Home Logo"
            width={160}
            height={76}
            className={styles.pathHomeImage}
            priority
          />
        </Link>

        {sidebarGroups.map((group, index) => {
          const visibleLinks = group.links.filter((link) =>
            link.allowedRoles.includes(role),
          );

          // PREVENTS THE HEADING FROM SHOWING IF THERE ARE NO LINKS
          if (visibleLinks.length === 0) return null;

          return (
            <div key={index}>
              {group.heading && (
                <h3 className={styles.groupHeading}>{group.heading}</h3>
              )}
              {/* Bootstrap ul classes */}
              <ul className={`nav flex-column ${styles.linkList}`}>
                {visibleLinks.map((link) => (
                  <li key={link.href} className={`nav-item ${styles.linkItem}`}>
                    <SidebarNavLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <Link href="/profile" className={styles.profile}>
          <div className={styles.pfpContainer}>
            <Image
              src={profilePhotoUrl || '/image-placeholder.svg'}
              alt={`${displayName} profile photo`}
              width={40}
              height={40}
              className={styles.pfp}
              unoptimized
            />
          </div>
          <div>{displayName}</div>
        </Link>
      </nav>
    </aside>
  );
}
