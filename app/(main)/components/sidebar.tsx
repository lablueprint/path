import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/server-client';

type Role = 'DEFAULT' | 'REQUESTOR' | 'ADMIN' | 'SUPERADMIN' | 'OWNER';

type SidebarLink = {
  label: string;
  href: string;
  allowedRoles: Role[];
};

export default async function Sidebar() {
  const supabase = await createClient();

  // Get user claims (JWT), uses user_role claim, (reference: auth test component)
  const { data } = await supabase.auth.getClaims();
  const role = data?.claims?.user_role as Role | undefined;

  // Not logged in, no sidebar shows
  if (!role) return null;

  // the only routes from sitemap: /home, /profile, /request, /outgoing-tickets, /manage, /incoming-tickets, /team, /hq
  const links: SidebarLink[] = [
    {
      label: 'Home',
      href: '/home',
      allowedRoles: ['DEFAULT', 'REQUESTOR', 'ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'Profile',
      href: '/profile',
      allowedRoles: ['REQUESTOR', 'ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'Request',
      href: '/request',
      allowedRoles: ['REQUESTOR', 'ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'Outgoing Tickets',
      href: '/outgoing-tickets',
      allowedRoles: ['REQUESTOR', 'ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'Manage',
      href: '/manage',
      allowedRoles: ['ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'Incoming Tickets',
      href: '/incoming-tickets',
      allowedRoles: ['ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'Team',
      href: '/team',
      allowedRoles: ['REQUESTOR', 'ADMIN', 'SUPERADMIN', 'OWNER'],
    },
    {
      label: 'HQ',
      href: '/hq',
      allowedRoles: ['SUPERADMIN', 'OWNER'],
    },
  ];

  return (
    <aside>
      <nav>
        <ul>
          {links
        //   mapped from sitemap role rules, links are displayed conditionally by role
            .filter((link) => link.allowedRoles.includes(role))
            .map((link) => (
              <li key={link.href}>
              {/* creates list of links using <Link> */}
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}
