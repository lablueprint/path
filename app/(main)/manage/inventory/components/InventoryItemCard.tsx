'use server';

export default async function InventoryItemCard(inventoryItem) {
  console.log('inventory item:', inventoryItem.item);
  return (
    <div>
      <p>Item Name: {inventoryItem?.item?.name}</p>
      <p>Subcategory Name: {inventoryItem?.item?.subcategories?.name}</p>
      <p>
        Category Name: {inventoryItem?.item?.subcategories?.categories?.name}
      </p>
    </div>
  );
}
