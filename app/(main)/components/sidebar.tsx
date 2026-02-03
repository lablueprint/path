import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/server-client';

type Role = 'default' | 'requestor' | 'admin' | 'superadmin' | 'owner';

type SidebarLink = {
  label: string;
  href: string;
  allowedRoles: Role[];
};

export default async function Sidebar() {
  const supabase = await createClient();

  // Get user claims (JWT)
  const { data } = await supabase.auth.getClaims();
  const role = data?.claims?.user_role as Role | undefined;

  // Not logged in → no sidebar
  if (!role) return null;

  const links: SidebarLink[] = [
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
  ];

  return (
    <aside>
      <nav>
        <ul>
          {links
            .filter((link) => link.allowedRoles.includes(role))
            .map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}
