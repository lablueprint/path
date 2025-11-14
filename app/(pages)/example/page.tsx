"use client";

import { createExampleEntry } from "@/app/api/example/actions";

export default function Example() {
  const data = {
    id: 5,
    name: 'harry',
  };

  const handleClick = async () => {
    await createExampleEntry(data);
  };

  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <button onClick={handleClick}>
        Click to add data to the example table
      </button>
    </div>
  );
}