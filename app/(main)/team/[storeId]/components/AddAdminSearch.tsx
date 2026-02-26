'use client';
import { useState } from 'react';

export default function AddAdminSearch({ storeId, existingAdminUserIds }: {
    storeId: string;
    existingAdminUserIds: any[];
}) {
    console.log("YOOOOO", existingAdminUserIds)

    const [search, setSearch] = useState('');

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
        </div>
    );
}