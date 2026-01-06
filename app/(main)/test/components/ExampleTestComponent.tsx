'use client';

import { createExampleEntry } from '@/app/actions/example';
import { Example } from '@/app/types/example';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useEffect, useState } from 'react';

export default function ExampleTestComponent() {
  const [people, setPeople] = useState<Example[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data, error: err } = await supabase.from('example').select('*');
      if (err) {
        console.error('Error fetching people:', err);
      }
      setPeople(data);
    };
    getData();
  }, []);

  const data: Example = {
    id: 5,
    name: 'harry',
  };

  const handleExampleClick = async () => {
    await createExampleEntry(data);
  };

  return (
    <div>
      <ul>
        {people?.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
      <button onClick={handleExampleClick}>
        Click to add data to the example table
      </button>
    </div>
  );
}
