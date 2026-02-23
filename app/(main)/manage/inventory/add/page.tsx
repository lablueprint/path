'use server';
import AddInventoryItemForm from './components/AddInventoryItemForm';

export default async function AddInventoryItemPage() {
  return (
    <div>
      <h1>Add Inventory Item</h1>
      <AddInventoryItemForm />
    </div>
  );
}
