'use client';

import { createExampleEntry } from '@/app/api/example/actions';
import { Example } from '@/app/types/example';

export default function ExampleTestComponent() {
  const data: Example = {
    id: 5,
    name: 'harry',
  };

  const handleExampleClick = async () => {
    await createExampleEntry(data);
  };

  return (
    <button onClick={handleExampleClick}>
      Click to add data to the example table
    </button>
  );
}
