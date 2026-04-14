'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarNavLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export default function SidebarNavLink({
  href,
  label,
  className = 'nav-link',
}: SidebarNavLinkProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? 'active-nav-link' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}