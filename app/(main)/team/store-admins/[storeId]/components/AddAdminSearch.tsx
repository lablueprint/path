'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { createStoreAdmin } from '@/app/actions/store';
import { User } from '@/app/types/user';
import UserCard from '@/app/(main)/components/UserCard';

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
  const [isAddingUserId, setIsAddingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // search filtering
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const d = search.trim();
      if (!d) {
        setSearchData([]);
        setErrorMessage('');
        setSuccessMessage('');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('user_id, first_name, last_name, email, profile_photo_url')
        .ilike('full_name', `%${d}%`);
      if (error) {
        console.error('Error searching for admins:', error);
        setErrorMessage(error.message ?? 'Failed to search for admins.');
        return;
      }

      const filtered = (data ?? []).filter(
        (u) => !existingAdminUserIds.some((a) => a === u.user_id),
      );

      setSearchData(filtered);
      setErrorMessage('');
    }, 300);

    // returning a cleanup function to clear previous timeouts
    return () => clearTimeout(timeout);
  }, [search, existingAdminUserIds]);

  const handleAddAdmin = async (userId: string) => {
    setIsAddingUserId(userId);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await createStoreAdmin({
        user_id: userId,
        store_id: storeId,
      });
      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to add admin.');
        return;
      }
      setSuccessMessage('Admin added.');
    } catch (error) {
      console.error('Store admin creation error:', error);
      setErrorMessage('Failed to add admin.');
    } finally {
      setIsAddingUserId(null);
    }
  };

  return (
    <div>
      {/* searching */}
      <div style={{ marginBottom: '20px' }}>
        <label>Find users by name</label>
        <input
          id="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {successMessage && <p role="status">{successMessage}</p>}

      {/* search results */}
      {searchData.map((u) => (
        <div key={u.user_id} style={{ marginBottom: '40px' }}>
          <UserCard user={u} noBottomMargin></UserCard>
          <button
            type="button"
            onClick={() => handleAddAdmin(u.user_id)}
            disabled={isAddingUserId === u.user_id}
          >
            {isAddingUserId === u.user_id ? 'Adding...' : 'Add admin'}
          </button>
        </div>
      ))}
    </div>
  );
}
