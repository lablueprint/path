'use client';

import { useState } from 'react';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import SidebarNavLink from '@/app/(main)/components/SidebarNavLink';
import styles from '@/app/(main)/components/Sidebar.module.css';
import imagePlaceholder from '@/public/image-placeholder.svg';

type SidebarGroup = {
  heading: string;
  links: {
    label: string;
    href: string;
    allowedRoles: string[];
  }[];
};

type MobileSidebarProps = {
  sidebarGroups: SidebarGroup[];
  role: string;
  displayName: string;
  profilePhotoUrl: string;
};

export default function MobileSidebar({
  sidebarGroups,
  role,
  displayName,
  profilePhotoUrl,
}: MobileSidebarProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className={`d-flex d-lg-none ${styles.mobileTopBar}`}>
        <button
          className={styles.menuButton}
          type="button"
          onClick={handleShow}
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" aria-hidden="true">
            <path stroke="rgba(0,0,0,0.55)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M4 7h22M4 15h22M4 23h22" />
          </svg>
        </button>
        <Link href="/home" className={styles.mobileLogoLink}>
          <Image
            src="/path.png"
            alt="Path Home Logo"
            width={80}
            height={38}
            priority
          />
        </Link>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <div className={styles.offcanvasInner}>
          <CloseButton className={styles.offcanvasClose} onClick={handleClose} aria-label="Close menu" />
          <Link href="/home" onClick={handleClose} className={styles.pathHomeLink}>
            <Image
              src="/path.png"
              alt="Path Home Logo"
              width={160}
              height={76}
              className={styles.pathHomeImage}
              priority
            />
          </Link>

          <div className={styles.offcanvasLinks}>
            {sidebarGroups.map((group, index) => {
              const visibleLinks = group.links.filter((link) =>
                link.allowedRoles.includes(role),
              );
              if (visibleLinks.length === 0) return null;
              return (
                <div key={index}>
                  {group.heading && (
                    <h3 className={styles.groupHeading}>{group.heading}</h3>
                  )}
                  <ul className={`nav flex-column ${styles.linkList}`}>
                    {visibleLinks.map((link) => (
                      <li key={link.href} className={`nav-item ${styles.linkItem}`}>
                        <SidebarNavLink
                          href={link.href}
                          label={link.label}
                          onClick={handleClose}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <Link href="/profile" className={styles.profile} onClick={handleClose}>
            <div className={styles.pfpContainer}>
              <Image
                src={profilePhotoUrl || imagePlaceholder}
                alt={`${displayName} profile photo`}
                width={40}
                height={40}
                className={styles.pfp}
                unoptimized
              />
            </div>
            <div>{displayName}</div>
          </Link>
        </div>
      </Offcanvas>
    </>
  );
}
