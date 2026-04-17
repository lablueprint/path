'use client';
import { useState } from 'react';
import StoreCard from '@/app/(main)/components/StoreCard';
import { Store } from '@/app/types/store';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ViewToggle, { ViewMode } from '@/app/(main)/components/ViewToggle';

export default function StoresList({ stores }: { stores: Store[] }) {
  const [view, setView] = useState<ViewMode>('grid');

  return (
    <Container>
      <ViewToggle onViewChange={(newView) => setView(newView)} />
      <Row>
        {stores?.map((store) => (
          <Col
            xs={12}
            sm={view === 'grid' ? 6 : 12}
            md={view === 'grid' ? 4 : 12}
            key={store.store_id}
          >
            <StoreCard store={store} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
