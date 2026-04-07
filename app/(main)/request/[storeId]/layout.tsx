// app/(main)/store/[storeId]/layout.tsx
import type { ReactNode } from 'react';

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <div className="store-layout-container">{children}</div>;
}
