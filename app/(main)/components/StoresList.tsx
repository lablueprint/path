'use client';
import { useState } from 'react';
import StoreCard from '@/app/(main)/components/StoreCard';
import { Store } from '@/app/types/store';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ViewToggle, { ViewMode } from '@/app/(main)/components/ViewToggle';
import Image from 'next/image';
import styles from '@/app/(main)/components/StoresList.module.css';
import defaultStorePhoto from '@/public/image-placeholder.svg';
import { Table } from 'react-bootstrap';

export default function StoresList({ stores }: { stores: Store[] }) {
  const [view, setView] = useState<ViewMode>('grid');

  return (
    <Container>
      <div className={styles.header}>
        <ViewToggle defaultView="grid" onChange={setView} />
      </div>
      {view === 'grid' ? (
        <Row className={styles.grid}>
          {stores?.map((store) => (
            <Col xs={12} sm={6} md={3} key={store.store_id}>
              <StoreCard store={store} />
            </Col>
          ))}
        </Row>
      ) : (
        <Table borderless>
          <thead className="table-header">
            <tr>
              <th>NAME</th>
              <th>ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {stores?.map((store) => (
              <tr key={store.store_id}>
                <td>
                  <div>
                    <Image
                      src={store.photo_url || defaultStorePhoto}
                      alt={`${store.name} photo`}
                      width={32}
                      height={32}
                      className="profilePicture"
                      unoptimized
                    />

                    <span>{store.name}</span>
                  </div>
                </td>
                <td>{store.street_address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
