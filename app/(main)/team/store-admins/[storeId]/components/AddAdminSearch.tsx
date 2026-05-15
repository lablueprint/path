'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { createStoreAdmin } from '@/app/actions/store';
import { User } from '@/app/types/user';
import { Form, ListGroup } from 'react-bootstrap';

const supabase = createClient();

export default function AddAdminSearch({
  storeId,
  existingAdminUserIds,
}: {
  storeId: string;
  existingAdminUserIds: string[];
}) {
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState<User[]>([]);

  // search filtering
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const d = search.trim();
      if (!d) {
        setSearchData([]);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('user_id, first_name, last_name, email, profile_photo_url, phone')
        .ilike('full_name', `%${d}%`);
      if (error) {
        console.error('Error searching for admins:', error);
        return;
      }

      const filtered = (data ?? []).filter(
        (u) => !existingAdminUserIds.some((a) => a === u.user_id),
      );

      setSearchData(filtered);
    }, 300);

    // returning a cleanup function to clear previous timeouts
    return () => clearTimeout(timeout);
  }, [search, existingAdminUserIds]);

  return (
    <div>
      {/* searching */}
      <div className="search-filter-wrapper">
        <Form.Control
          type="text"
          placeholder="Search users..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* search results */}
      <ListGroup>
        {searchData.map((u) => (
          <ListGroup.Item
            key={u.user_id}
            action
            onClick={() =>
              createStoreAdmin({ user_id: u.user_id, store_id: storeId })
            }
          >
            {u.first_name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
