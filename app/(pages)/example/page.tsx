"use client";

import { createExampleEntry } from "@/app/api/example/actions";
import { createStore } from "@/app/api/stores/action";
import { ExampleType } from "@/app/types/ExampleType";
import { Store } from "@/app/types/Store";
import { deleteStore } from "@/app/api/stores/action";
import TestDonationsPage from "../test-donations/page";

export default function Example() {
  const data: ExampleType = {
    id: 5,
    name: "harry",
  };

  const storeData: Store = {
    store_id: "550e8400-e29b-41d4-a716-446655440000",
    name: "test store",
    street_address: "test address",
  };

  const handleExampleClick = async () => {
    await createExampleEntry(data);
  };

  const handleAddStoreClick = async () => {
    await createStore(storeData);
  };

  const handleDeleteStoreClick = async () => {
    await deleteStore(storeData.store_id);
  };
  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <button onClick={handleExampleClick}>Click to add data to the example table</button>
      <button onClick={handleAddStoreClick}>Click to add store to stores table</button>
      <button onClick={handleDeleteStoreClick}>Click to delete store from stores table</button>
      <TestDonationsPage />
    </div>
  );
}
