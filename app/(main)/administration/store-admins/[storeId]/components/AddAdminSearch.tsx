'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { createStoreAdmin } from '@/app/actions/store';
import { User } from '@/app/types/user';
import { Form, ListGroup, Card, Alert } from 'react-bootstrap';

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

  // search filtering
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const d = search.trim();
      if (!d) {
        setSearchData([]);
        setErrorMessage('');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(
          'user_id, first_name, last_name, email, profile_photo_url, phone',
        )
        .ilike('full_name', `%${d}%`);
      if (error) {
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
    try {
      const result = await createStoreAdmin({
        user_id: userId,
        store_id: storeId,
      });
      if (!result.success) {
        setErrorMessage(result.error ?? 'Failed to add admin.');
        return;
      }
    } catch {
      setErrorMessage('Failed to add admin.');
    } finally {
      setIsAddingUserId(null);
    }
  };

  return (
    <Card className="form-card">
      <Card.Body>
        <div className="form-body">
          {/* searching */}
          <div className="search-filter-wrapper">
            <Form.Control
              type="text"
              placeholder="Search users..."
              className="search-bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* search results */}
            {searchData.length > 0 && (
              <ListGroup>
                {searchData.map((u) => (
                  <ListGroup.Item
                    key={u.user_id}
                    action
                    onClick={() => handleAddAdmin(u.user_id)}
                    disabled={isAddingUserId === u.user_id}
                  >
                    {u.first_name} {u.last_name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </div>
      </Card.Body>
    </Card>
  );
}
