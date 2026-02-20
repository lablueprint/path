'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Store } from '@/app/types/store';

export default function StoreCard({ store }: { store: Store }) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${store.store_id}`}>
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{store.name}</h2>
        <p style={{ fontSize: '18px' }}>{store.street_address}</p>
      </div>
    </Link>
  );
}
