'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { createStoreAdmin } from '@/app/actions/store';

export default function AddAdminSearch({ storeId, existingAdminUserIds }: {
    storeId: string;
    existingAdminUserIds: any[];
}) {
    const [search, setSearch] = useState('');
    const [searchData, setSearchData] = useState<any[]>([]);

    // search filtering
    const supabase = createClient();
    useEffect(() => {
        async function fetchSearchData() {
            const d = search.trim();
            if (!d) {
                setSearchData([]);
                return;
            }

            const { data , error } = await supabase
                .from('users')
                .select('user_id, first_name, last_name')
                .ilike('full_name', `%${d}%`)
            if (error) {
                console.error('Error searching for admins:', error);
                return;
            }

            const filtered = (data ?? []).filter(
                (u) => !existingAdminUserIds.some((a) => a.user_id === u.user_id)
            );

            setSearchData(filtered);
        }

        fetchSearchData();
    }, [search, supabase, existingAdminUserIds]);

    return (
        <div>
            {/* searching */}
            <label>search</label>
            <input
                id='search'
                placeholder='type to search admin by first/last name...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* search results */}
            <p>current search value: {search}</p>
            <ul>
                {searchData.map((u) => (
                    <li key={u.user_id}>
                        {u.first_name} {u.last_name}
                        <button type='button' onClick={() => createStoreAdmin({ user_id: u.user_id, store_id: storeId})}>
                            Add as Store Admin
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}