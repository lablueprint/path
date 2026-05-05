'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/(main)/components/Sidebar.module.css';

type SidebarNavLinkProps = {
  href: string;
  label: string;
  onClick?: () => void;
};

export default function SidebarNavLink({ href, label, onClick }: SidebarNavLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
