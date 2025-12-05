"use client";

import { createExampleEntry } from "@/app/api/example/actions";
import { ExampleType } from "@/app/types/ExampleType";
import TestDonationsPage from "../test-donations/page";

export default function Example() {
  const data: ExampleType = {
    id: 5,
    name: 'harry',
  };

  const handleExampleClick = async () => {
    await createExampleEntry(data);
  };

  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <button onClick={handleExampleClick}>
        Click to add data to the example table
      </button>
      <TestDonationsPage />
    </div>
  );
}