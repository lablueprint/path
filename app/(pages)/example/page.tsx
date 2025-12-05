"use client";

import { useState } from "react";

//import { createExampleEntry } from "@/app/api/example/actions";
//import { ExampleType } from "@/app/types/ExampleType";
import { createItem, changeItemQuantity } from "@/app/api/inventory-items/actions";
import type { InventoryType } from "@/app/types/InventoryItem";

// export default function Example() {
//   const data: ExampleType = {

//     id: 5,
//     name: 'harry',
//   };

export default function InventoryType() {
  const [inventoryId, setInventoryId] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState<number>(0);
  
  const data: InventoryType = {
    store_id: "4c7b2b65-16df-44b5-a3c2-e2fcd090b76c",
    category: "example",
    subcategory: "example",
    item: "Sample Item",
    description: "test description",
    photo_url: "http://example.com/photo.jpg",
    quantity_available: 2,
    is_hidden: false,
  };

  // const handleExampleClick = async () => {
  //   await createExampleEntry(data);
  // };

  const handleCreateItem = async () => {
    await createItem(data);
  }

  const handleChangeItemQuantity = async () => {
    if (!inventoryId) return;
    await changeItemQuantity(inventoryId, Number(updatedQuantity));
  }

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
      <br />
      <label>
        Inventory Item ID:
        <input
          type="text"
          value={inventoryId}
          onChange={(e) => setInventoryId(e.target.value)}
          placeholder="inventory_item_id"
        />
      </label>
      <br />
      <label>
        New Quantity:
        <input
          type="number"
          value={updatedQuantity}
          onChange={(e) => setUpdatedQuantity(Number(e.target.value))}
          placeholder="0"
          min={0}
        />
      </label>
      <br />
      <button onClick={handleChangeItemQuantity}>
        Update inventory quantity
      </button>
    </div>
  );
}