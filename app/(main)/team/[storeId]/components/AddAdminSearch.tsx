'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { createStoreAdmin } from '@/app/actions/store';
import { User } from '@/app/types/user';

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
    async function fetchSearchData() {
      const d = search.trim();
      if (!d) {
        setSearchData([]);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('user_id, first_name, last_name, email, profile_photo_url')
        .ilike('full_name', `%${d}%`);
      if (error) {
        console.error('Error searching for admins:', error);
        return;
      }

      const filtered = (data ?? []).filter(
        (u) => !existingAdminUserIds.some((a) => a === u.user_id),
      );

      setSearchData(filtered);
    }

    fetchSearchData();
  }, [search, existingAdminUserIds]);

  return (
    <div>
      {/* searching */}
      <label>Find users by name</label>
      <input
        id="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* search results */}
      <ul>
        {searchData.map((u) => (
          <li key={u.user_id}>
            {u.first_name} {u.last_name}
            <button
              type="button"
              onClick={() =>
                createStoreAdmin({ user_id: u.user_id, store_id: storeId })
              }
            >
              Add admin
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
