'use client';

import { useFormContext } from 'react-hook-form';
import AddStoreItemSearch from './AddStoreItemSearch';

export default function StoreItemsForm({
  setAutoFillItems,
}: {
  setAutoFillItems: any;
}) {
  // get props from parents

  return (
    <div>
      <AddStoreItemSearch setAutoFillItems={setAutoFillItems} />
    </div>
  );
}
