import StoreCard from '@/app/components/StoreCard';
import { Store } from '@/app/types/store';

export default function StoresList({ stores }: { stores: Store[] }) {
  return (
    <div>
      {stores?.map((store) => (
        <StoreCard key={store.store_id} store={store} />
      ))}
    </div>
  );
}
