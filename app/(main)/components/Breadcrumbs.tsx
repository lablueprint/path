'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // e.g. ["manage", "123", "add"]
  // .filter(Boolean) removes empty strings and other falsy values

  // Helper function to format each label to be more readable
  const formatLabel = (segment: string) =>
    decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
      .join(' ');

  // Determine if special case where the user is on the team > profile > [userId] page
  // If true, hide the "profile" segment later on
  const shouldHideTeamProfileSegment =
    segments[0] === 'team' && segments[1] === 'profile';

  // Crumbs to display with href links
  const visibleCrumbs = segments
    .map((segment, index) => ({
      segment,
      href: `/${segments.slice(0, index + 1).join('/')}`,
      originalIndex: index, // Used for filtering out the "profile" segment in the special case
    }))
    // Special case: Hide the "profile" segment if the user is on the team > profile > [userId] page
    // Filtering it out
    .filter(
      (crumb) =>
        !(
          shouldHideTeamProfileSegment &&
          crumb.segment === 'profile' &&
          crumb.originalIndex === 1
        ),
    );

  // Show only when at least two crumbs are visible. Don't show breadcrumb at top level pages.
  if (visibleCrumbs.length < 2) return null;

  const crumbs = visibleCrumbs.map((crumb, index) => {
    const isLast = index === visibleCrumbs.length - 1;
    const label = formatLabel(crumb.segment);

    return (
      <span key={crumb.href}>
        {index > 0 ? ' / ' : null}
        {/* Last crumb is displayed as plain text, other crumbs are links */}
        {isLast ? <span>{label}</span> : <Link href={crumb.href}>{label}</Link>}
      </span>
    );
  });

  return <nav aria-label="Breadcrumb">{crumbs}</nav>;
}
