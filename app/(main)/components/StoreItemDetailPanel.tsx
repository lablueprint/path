import Image from 'next/image';
import type { ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';
import styles from '@/app/(main)/components/StoreItemDetailPanel.module.css';

type StoreItemDetailPanelProps = {
  itemName: string;
  photoUrl: string | null;
  children: ReactNode;
};

type StoreItemDetailFieldProps = {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
};

const LOCAL_IMAGE_PATTERN =
  /^(?:\/|https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/)/i;

const getImageSource = (photoUrl: string | null) =>
  photoUrl && LOCAL_IMAGE_PATTERN.test(photoUrl)
    ? photoUrl
    : '/item-placeholder.svg';

export function StoreItemDetailGrid({ children }: { children: ReactNode }) {
  return <Row className="g-4">{children}</Row>;
}

export function StoreItemDetailField({
  label,
  children,
  fullWidth = false,
}: StoreItemDetailFieldProps) {
  const className = fullWidth
    ? `col-12 ${styles.field} ${styles.fieldFullWidth}`
    : `col-12 col-md-6 ${styles.field}`;

  return (
    <Col className={className}>
      <p className={styles.label}>{label}</p>
      <div className={styles.value}>{children}</div>
    </Col>
  );
}

export default function StoreItemDetailPanel({
  itemName,
  photoUrl,
  children,
}: StoreItemDetailPanelProps) {
  return (
    <section className={styles.panel}>
      <Row className="g-4 g-lg-5 align-items-start">
        <Col xs={12} lg={5} xxl={4} className={styles.mediaColumn}>
          <div className={styles.mediaFrame}>
            <Image
              src={getImageSource(photoUrl)}
              alt={itemName ? `${itemName} photo` : 'Store item photo'}
              fill
              className={styles.image}
              sizes="(max-width: 960px) 100vw, 22rem"
              unoptimized
            />
          </div>
        </Col>

        <Col xs={12} lg={7} xxl={8} className={styles.content}>
          <div className={styles.stack}>{children}</div>
        </Col>
      </Row>
    </section>
  );
}
