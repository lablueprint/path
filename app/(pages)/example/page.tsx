"use client";

//import { createExampleEntry } from "@/app/api/example/actions";
//import { ExampleType } from "@/app/types/ExampleType";
import { createItem, changeItemQuantity, deleteItem } from "@/app/api/inventory-items/actions";
import type { InventoryType } from "@/app/types/InventoryItem";

// export default function Example() {
//   const data: ExampleType = {

//     id: 5,
//     name: 'harry',
//   };

export default function InventoryType() {
  const data: InventoryType = {
    inventory_item_id: "1",
    store_id: "example",
    category: "example",
    subcategory: "example",
    quantity_available: 2,
    item: "Sample Item",
    description: "test description",
    photo_url: "http://example.com/photo.jpg",
    is_hidden: false,
  };

  // const handleExampleClick = async () => {
  //   await createExampleEntry(data);
  // };

  const handleCreateItem = async () => {
    await createItem(data);
  }

  // const changeItemQuantity = async () => {
  //   await changeItemQuantity(data);
  // }

  // const deleteItem = async () => {
  //   await deleteItem(data);
  // }

  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <button onClick={handleCreateItem}>
        Click to add inventory item
      </button>


    </div>
  );
}