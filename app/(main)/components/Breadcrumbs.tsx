'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/(main)/components/Breadcrumbs.module.css';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const shouldHideTeamProfileSegment =
    segments[0] === 'team' && segments[1] === 'profile';

  const formatLabel = (segment: string, index: number) => {
    if (UUID_PATTERN.test(segment)) {
      const topLevel = segments[0];

      if (topLevel === 'request' || topLevel === 'manage') {
        return index === 1 ? 'Location' : 'Item';
      }

      if (topLevel === 'incoming-tickets') {
        return index === 1 ? 'Location' : 'Ticket';
      }

      if (topLevel === 'outgoing-tickets') {
        return 'Ticket';
      }

      if (topLevel === 'team' && segments[1] === 'people') {
        return 'Person';
      }

      return 'Details';
    }

    return decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
      .join(' ');
  };

  const visibleCrumbs = segments
    .map((segment, index) => ({
      segment,
      href: `/${segments.slice(0, index + 1).join('/')}`,
      originalIndex: index,
    }))
    .filter(
      (crumb) =>
        !(
          shouldHideTeamProfileSegment &&
          crumb.segment === 'profile' &&
          crumb.originalIndex === 1
        ),
    );

  if (visibleCrumbs.length < 2) return null;

  const crumbs = visibleCrumbs.map((crumb, index) => {
    const isLast = index === visibleCrumbs.length - 1;
    const label = formatLabel(crumb.segment, crumb.originalIndex);

    return (
      <span key={crumb.href}>
        {index > 0 ? <span className={styles.separator}>/</span> : null}
        {isLast ? (
          <span className={styles.current}>{label}</span>
        ) : (
          <Link href={crumb.href} className={styles.link}>
            {label}
          </Link>
        )}
      </span>
    );
  });

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      {crumbs}
    </nav>
  );
}
