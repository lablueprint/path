'use client';
import { useState } from "react";
import { useFormContext } from
    "react-hook-form";
import { createClient } from "@/app/lib/supabase/server-client";

export default function AddStoreItemSearch() {
    const { register } = useFormContext()
    const [searchQuery, setSearchQuery] = useState("")
    const supabase = createClient()
    const { data, error } = await supabase.from('inventory_items').select('name').ilike('name', `%${searchQuery}%`)

    return <div>
        <input
            placeholder="Search item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div>Selected Items</div>

    </div>
}