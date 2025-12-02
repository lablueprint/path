"use client";

import { createExampleEntry } from "@/app/api/example/actions";
import { createStore } from "@/app/api/example/stores/action";
import { ExampleType } from "@/app/types/ExampleType";
import { Store } from "@/app/types/Store";
import { deleteStore } from "@/app/api/example/stores/action";

export default function Example() {
  const data: ExampleType = {
    id: 5,
    name: "harry",
  };

  const storeData: Store = {
    store_id: "123",
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
    await deleteStore("123");
  };
  <div>
    Welcome to PATH! This is an example page.
    <br />
    <button onClick={handleExampleClick}>Click to add data to the example table</button>
    <button onClick={handleAddStoreClick}>Click to add store to stores table</button>
    <button></button>
  </div>;
}
