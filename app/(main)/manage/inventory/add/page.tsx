import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import AddInventoryItemForm from '@/app/(main)/manage/inventory/add/components/AddInventoryItemForm';

export default async function AddInventoryItemPage() {
  return (
    <div>
      <Breadcrumbs
        labelMap={{
          manage: 'Manage',
          inventory: 'Inventory',
          add: 'Add Inventory Item',
        }}
      />

      <h1>Add Inventory Item</h1>
      <AddInventoryItemForm />
    </div>
  );
}
