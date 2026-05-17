'use client';

import { useState } from 'react';
import StoreCard from '@/app/(main)/components/StoreCard';
import { Store } from '@/app/types/store';
import ViewToggle, { ViewMode } from '@/app/(main)/components/ViewToggle';
import Image from 'next/image';
import styles from '@/app/(main)/components/StoresList.module.css';
import defaultStorePhoto from '@/public/image-placeholder.svg';

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
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>NAME</th>
              <th>ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores?.map((store) => (
              <tr className={styles.tableRow} key={store.store_id}>
                <td>
                  <div className={styles.nameCell}>
                    <Image
                      src={store.photo_url || defaultStorePhoto}
                      alt={`${store.name} photo`}
                      width={32}
                      height={32}
                      className={styles.storePhoto}
                      unoptimized
                    />

                    <span className={styles.name}>{store.name}</span>
                  </div>
                </td>
                <td className={styles.address}>{store.street_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
