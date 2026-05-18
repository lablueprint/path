'use client';

import { useState } from 'react';
import StoreCard from '@/app/(main)/components/StoreCard';
import { Store } from '@/app/types/store';
import ViewToggle, { ViewMode } from '@/app/(main)/components/ViewToggle';
import Image from 'next/image';
import styles from '@/app/(main)/components/StoresList.module.css';
import defaultStorePhoto from '@/public/image-placeholder.svg';
import { Table } from 'react-bootstrap';

export default function StoresList({ stores }: { stores: Store[] }) {
  const [view, setView] = useState<ViewMode>('grid');

  const sortedStores = [...stores].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className={styles.header}>
        <ViewToggle defaultView="grid" onChange={setView} />
      </div>
      {view === 'grid' ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5">
          {sortedStores?.map((store) => (
            <div key={store.store_id} className="col">
              <StoreCard store={store} />
            </div>
          ))}
        </div>
      ) : (
        <Table borderless responsive>
          <thead className="table-header">
            <tr>
              <th>NAME</th>
              <th>ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores?.map((store) => (
              <tr className={styles.tableRow} key={store.store_id}>
                <td>
                  <div>
                    <Image
                      src={store.photo_url || defaultStorePhoto}
                      alt={`${store.name} photo`}
                      width={32}
                      height={32}
                      className="rounded-circle me-2"
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
    </div>
  );
}
