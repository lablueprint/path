import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default function AllCartsPage() {
  return (
    <div>
      <Breadcrumbs
        labelMap={{
          request: 'Request Inventory',
          all: 'All Stores',
          cart: 'All Carts',
        }}
      />
      <h1>All Carts</h1>
    </div>
  );
}
