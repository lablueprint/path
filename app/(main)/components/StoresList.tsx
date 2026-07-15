'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import StoreCard from '@/app/(main)/components/StoreCard';
import { Store } from '@/app/types/store';
import ViewToggle, { ViewMode } from '@/app/(main)/components/ViewToggle';
import Image from 'next/image';
import styles from '@/app/(main)/components/StoresList.module.css';
import defaultStorePhoto from '@/public/image-placeholder.svg';
import { Table } from 'react-bootstrap';

export default function StoresList({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<ViewMode>('grid');

  const sortedStores = [...stores].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
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
              <th>Name</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedStores?.map((store) => (
              <tr
                key={store.store_id}
                onClick={() => router.push(`${pathname}/${store.store_id}`)}
                className={styles.cursor}
              >
                <td className={styles.pfpRow}>
                  <Image
                    src={store.photo_url || defaultStorePhoto}
                    alt={`${store.name} photo`}
                    width={40}
                    height={40}
                    className="rounded-circle object-fit-cover"
                    unoptimized
                  />
                  {store.name}
                </td>
                <td>{store.street_address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
