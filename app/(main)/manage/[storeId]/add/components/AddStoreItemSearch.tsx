'use client';
import { useEffect, useState } from "react";
import { useFormContext } from
    "react-hook-form";
import { createClient } from '@/app/lib/supabase/browser-client';

export default function AddStoreItemSearch() {
    const { register } = useFormContext()
    const [results, setResults] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const supabase = createClient()

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabase.from('inventory_items').select('name').ilike('name', `%${searchQuery}%`)
        }
    }, [])

    return <div>
        <input
            placeholder="Search item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div>Selected Items</div>

    </div>
}