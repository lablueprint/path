'use client';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { InventoryItem } from '@/app/types/inventory';
import type { CombinedFormData } from './StoreItemsDonationForm';

type ItemWithNames = InventoryItem & {
  category_name: string;
  subcategory_name: string;
};

export default function AddStoreItemSearch({
  setAutoFillItems,
}: {
  setAutoFillItems: any;
}) {
  const methods = useFormContext<CombinedFormData>();
  const [results, setResults] = useState<ItemWithNames[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<ItemWithNames[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`*, subcategories (name, categories(name))`)
        .ilike('name', `%${searchQuery}%`);
      if (error) {
        console.log(error);
        return;
      } else {
        const items: ItemWithNames[] = [];
        for (const item of data) {
          items.push({
            ...item,
            category_name: item.subcategories.categories?.name,
            subcategory_name: item.subcategories?.name,
          });
        }
        setResults(items);
      }
    };
    fetch();
  }, [searchQuery, supabase]);
  useEffect(() => {
    setAutoFillItems(selectedItems);
  }, [selectedItems, setAutoFillItems]);

  const select = (item: ItemWithNames) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.name === item.name) ? prev : [...prev, item],
    );
  };

  const handleRemove = (itemToRemove: ItemWithNames) => {
    setSelectedItems((prev) =>
      prev.filter(
        (item) => item.inventory_item_id != itemToRemove.inventory_item_id,
      ),
    );
  };
  return (
    <div>
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
        {selectedItems?.map((item, idx) => (
          <div key={item.name}>
            <li>Item: {item.name}</li>
            <li>Category: {item.category_name}</li>
            <li>Subcategory: {item.subcategory_name}</li>
            <li>Description: {item.description}</li>
            <input
              type="number"
              placeholder="Quantity to add"
              {...methods.register(`items.${idx}.quantity`, {
                required: 'Quantity is required',
              })}
            />
            {methods.formState.errors.items?.[idx]?.quantity && (
              <p style={{ color: 'red' }}>
                {' '}
                {
                  methods.formState.errors.items?.[idx]?.quantity
                    ?.message as string
                }
              </p>
            )}
            <input
              type="hidden"
              value={item.inventory_item_id}
              {...methods.register(`items.${idx}.inventory_item_id`)}
            />
            <button onClick={() => handleRemove(item)}>Remove</button>
          </div>
        ))}
      </ul>
    </div>
  );
}
