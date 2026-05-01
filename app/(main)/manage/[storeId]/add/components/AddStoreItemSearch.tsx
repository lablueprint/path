'use client';

import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { InventoryItem } from '@/app/types/inventory';
import type { CombinedFormData } from '@/app/(main)/manage/[storeId]/add/components/StoreItemsDonationForm';
import searchStyles from '@/app/(main)/components/ItemSearch.module.css';

type ItemWithNames = InventoryItem & {
  category_name: string;
  subcategory_name: string;
};

const supabase = createClient();

export default function AddStoreItemSearch({
  setAutoFillItems,
}: {
  setAutoFillItems: (items: ItemWithNames[]) => void;
}) {
  const methods = useFormContext<CombinedFormData>();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'items',
  });
  const [results, setResults] = useState<ItemWithNames[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<ItemWithNames[]>([]);

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
        console.error(error);
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
  }, [searchQuery]);
  useEffect(() => {
    setAutoFillItems(selectedItems);
  }, [selectedItems, setAutoFillItems]);

  const handleSelect = (item: ItemWithNames) => {
    if (
      !selectedItems.some((i) => i.inventory_item_id === item.inventory_item_id)
    ) {
      setSelectedItems((prev) => [...prev, item]);
      append({
        inventory_item_id: item.inventory_item_id,
        quantity: 1,
      });
    }
  };

  const handleRemove = (index: number) => {
    const itemToRemove = selectedItems[index];
    setSelectedItems((prev) =>
      prev.filter(
        (item) => item.inventory_item_id != itemToRemove.inventory_item_id,
      ),
    );
    remove(index);
  };

  return (
    <div>
      <h2>Add Store Items</h2>
      <div className={searchStyles.wrapper}>
        <input
          className={searchStyles.searchInput}
          placeholder="Search Store"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ul>
        {results?.map((item) => (
          <div key={item.name}>
            <li>{item.name}</li>
            <button type="button" onClick={() => handleSelect(item)}>
              Select
            </button>
          </div>
        ))}
      </ul>

      <h3>Selected Items</h3>
      {fields.length > 0 ? (
        fields.map((field, idx) => (
          <div key={field.id}>
            <p>Item: {selectedItems[idx]?.name}</p>
            <p>Category: {selectedItems[idx]?.category_name}</p>
            <p>Subcategory: {selectedItems[idx]?.subcategory_name}</p>
            <p>Description: {selectedItems[idx]?.description}</p>
            <p>
              Quantity:{' '}
              <input
                type="number"
                min="1"
                placeholder="Quantity to add"
                {...methods.register(`items.${idx}.quantity`, {
                  required: 'Quantity is required.',
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Quantity must be at least 1.',
                  },
                })}
              />
            </p>
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
              {...methods.register(`items.${idx}.inventory_item_id`)}
            />
            <button type="button" onClick={() => handleRemove(idx)}>
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>No items selected.</p>
      )}
    </div>
  );
}
