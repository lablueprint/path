'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';

export default function AddAdminSearch({ storeId, existingAdminUserIds }: {
    storeId: string;
    existingAdminUserIds: any[];
}) {
    console.log("YOOOOO", existingAdminUserIds)

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
                .select('first_name, last_name')
                .or(`first_name.ilike.%${d}%, last_name.ilike.%${d}%`)
            if (error) {
                console.error('Error searching for admins:', error);
                return;
            }

            setSearchData(data);
        }

        fetchSearchData();
    }, [search, supabase]);

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
                    <li>{u.first_name} {u.last_name}</li>
                ))}
            </ul>
        </div>
    );
}