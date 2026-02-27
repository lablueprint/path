'use client';
import { useEffect, useState } from "react";
import { FormProvider, useFormContext } from
    "react-hook-form";
import { createClient } from '@/app/lib/supabase/browser-client';
import { InventoryItem } from "@/app/types/inventory";

type ItemWithNames = InventoryItem & {
    category_name: string
    subcategory_name: string

}

export default function AddStoreItemSearch() {
    const methods = useFormContext()
    const [results, setResults] = useState<ItemWithNames[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedItems, setSelectedItems] = useState<ItemWithNames[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabase.from('inventory_items').select('*').ilike('name', `%${searchQuery}%`)
            if (error) {
                console.log(error)
            }
            else {
                const items: ItemWithNames[] = []
                for (const item of data) {
                    const { data: category, error: category_error } = await supabase.from('categories').select().eq('category_id', item.category_id).single()
                    const { data: subcategory, error: subcategory_error } = await supabase.from('categories').select().eq('subcategorh_id', item.subcategory_id).single()
                    if (category_error) {
                        console.log(category_error)
                    }
                    else if (subcategory_error) {
                        console.log(subcategory_error)
                    }
                    else {
                        items.push(...item, category?.name, subcategory?.name)
                    }
                }
                setResults(items)
            }
        }
        fetch();
    }, [])

    const select = (item: ItemWithNames) => {
        setSelectedItems(prev => [...prev, item])
    }

    const handleRemove = (itemToRemove: ItemWithNames) => {
        setSelectedItems(prev => prev.filter(item => item.inventory_item_id != itemToRemove.inventory_item_id))
    }
    return (
        <FormProvider {...methods}>
            <input
                placeholder="Search item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul>
                {results?.map((item) => (
                    <div key={item.name}>
                        <li>{item.name}</li>
                        <button onClick={() => select(item)}>Select</button>
                    </div>
                ))}
            </ul>

            <div>Selected Items</div>
            <ul>
                {selectedItems?.map((item) => (
                    <div key={item.name}>
                        <li>{item.name}</li>
                        <li>{item.category_name}</li>
                        <li>{item.subcategory_name}</li>
                        <li>{item.description}</li>
                        <input placeholder="Quantity to add" {...methods.register('quantity', { required: 'Quantity is required' })} />
                        {methods.formState.errors.quantity &&
                            (<p>{methods.formState.errors.quantity.message as string}</p>)
                        }
                        <button onClick={() => handleRemove(item)}>Remove</button>
                    </div>
                ))}
            </ul>

        </FormProvider >
    )
}