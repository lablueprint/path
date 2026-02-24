'use client';
import { useEffect, useState } from "react";
import { useFormContext } from
    "react-hook-form";
import { createClient } from "@/app/lib/supabase/server-client";

export default function AddStoreItemSearch() {
    const { register } = useFormContext()
    const [results, setResults] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {

        const fetch = async () => {
            const supabase = await createClient()
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