import Link from 'next/link';
import './Sidebar.modules.css';
import { createClient } from '@/app/lib/supabase/server-client';

type Role = 'default' | 'requestor' | 'admin' | 'superadmin' | 'owner';

type SidebarLink = {
  label: string;
  href: string;
  allowedRoles: Role[];
};

export default async function Sidebar() {
  const supabase = await createClient();
  // Get the authenticated user  
  const {
    data: { user },
  } = await supabase.auth.getUser();


  // Get user claims (JWT)
  const { data } = await supabase.auth.getClaims();
  const role = data?.claims?.user_role as Role | undefined;

  // Not logged in or not authenticated user → no sidebar
  if (!user || !role) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name') // Update these column names if your DB uses different names
    .eq('user_id', user.id)
    .single();

  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const displayName = `${firstName} ${lastName}`.trim() || 'Profile';

 const sidebarGroups = [
    /*{
      links: [
        {
          label: 'Home',
          href: '/home',
          allowedRoles: ['default', 'requestor', 'admin', 'superadmin', 'owner'],
        },
        {
          label: 'Profile',
          href: '/profile',
          allowedRoles: ['requestor', 'admin', 'superadmin', 'owner'],
        },
      ],
    },*/
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
      <nav>
        <div className = "path-home"></div>
        {sidebarGroups.map((group, index) => {
          const visibleLinks = group.links.filter((link) =>
            link.allowedRoles.includes(role)
          );
          if (visibleLinks.length === 0) return null;
          return (
            <div key={index}>
              {group.heading && (
                <h3>
                  {group.heading}
                </h3>
              )}
              <ul>
                {visibleLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <Link href="/profile" className="profile">
          <div className="pfp-container">
            <div className="pfp"></div>
          </div>
          <div>{displayName}</div>
        </Link>
      </nav>
    </aside>
  );
}
