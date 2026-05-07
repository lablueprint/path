'use client';

import { useEffect, useState } from 'react';
import {
  useFormContext,
  useFieldArray,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { createClient } from '@/app/lib/supabase/browser-client';
import { InventoryItem } from '@/app/types/inventory';
import type { CombinedFormData } from '@/app/(main)/manage/[storeId]/add/components/StoreItemsDonationForm';
import AddInventoryItemForm, {
  Inputs,
} from '@/app/(main)/manage/components/AddInventoryItemForm';
import { createItem } from '@/app/actions/inventory';
import ItemCard from '@/app/(main)/components/ItemCard';

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createItemMethods = useForm<Inputs>();

  function useTime() {
    const [time, setTime] = useState(() => Date.now());

    useEffect(() => {
      const id = setInterval(() => {
        setTime(Date.now());
      }, 1000);
      return () => clearInterval(id);
    }, []);

    return time;
  }
  const time = useTime();

  // Debounce search (300ms)
  useEffect(() => {
    const timeout = setTimeout(async () => {
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
      }
      const items: ItemWithNames[] = data.map((item) => ({
        ...item,
        category_name: item.subcategories.categories?.name,
        subcategory_name: item.subcategories?.name,
      }));
      setResults(items);
    }, 300);
    return () => clearTimeout(timeout);
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

  const handleCreateAndSelect = async (formData: Inputs) => {
    try {
      let photoUrl: string | null = null;

      const result = await createItem({
        name: formData.name,
        description: formData.description,
        subcategory_id: formData.selectedSubcategory
          ? Number(formData.selectedSubcategory)
          : null,
      });

      if (result.success && result.data) {
        const inventoryItemId = result.data.inventory_item_id;

        // Upload photo if selected
        if (inventoryItemId && selectedFile) {
          const filePath = `${inventoryItemId}/item.jpg`;
          const { error: uploadError } = await supabase.storage
            .from('inventory_item_photos')
            .upload(filePath, selectedFile, { upsert: true });

          if (uploadError) {
            console.error('Upload error:', uploadError.message);
          } else {
            const { data: publicData } = supabase.storage
              .from('inventory_item_photos')
              .getPublicUrl(filePath);
            photoUrl = `${publicData.publicUrl}?t=${time}`;

            await supabase
              .from('inventory_items')
              .update({ photo_url: photoUrl })
              .eq('inventory_item_id', inventoryItemId);
          }
          setSelectedFile(null);
        }

        // Fetch the full item with category/subcategory names to add to selected
        const { data, error } = await supabase
          .from('inventory_items')
          .select(`*, subcategories (name, categories(name))`)
          .eq('inventory_item_id', inventoryItemId)
          .single();

        if (!error && data) {
          const newItem: ItemWithNames = {
            ...data,
            category_name: data.subcategories.categories?.name,
            subcategory_name: data.subcategories?.name,
          };
          handleSelect(newItem);
        }

        createItemMethods.reset({}, { keepValues: false });
        setShowCreateForm(false);
      } else {
        console.error('Failed to create item:', result.error);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div>
      <h2>Add Store Items</h2>
      <div className="search-filter-wrapper">
        <input
          className="search-filter-input"
          placeholder="Search Store"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setShowCreateForm((prev) => {
            if (prev) setSelectedFile(null);
            return !prev;
          });
        }}
      >
        {showCreateForm ? 'Cancel' : 'Create new item'}
      </button>
      <ul>
        {results?.map((item) => (
          <div key={item.inventory_item_id}>
            <li>{item.name}</li>
            <button type="button" onClick={() => handleSelect(item)}>
              Select
            </button>
          </div>
        ))}
      </ul>

      {showCreateForm && (
        <FormProvider {...createItemMethods}>
          <AddInventoryItemForm
            selectedFile={selectedFile}
            onFileChange={setSelectedFile}
          />
          <button
            type="button"
            onClick={createItemMethods.handleSubmit(handleCreateAndSelect)}
          >
            Create and select
          </button>
        </FormProvider>
      )}

      <h3>Selected Items</h3>
      {fields.length > 0 ? (
        fields.map((field, idx) => (
          <div key={field.id}>
            <ItemCard
              id={selectedItems[idx]?.inventory_item_id}
              photoUrl={selectedItems[idx]?.photo_url ?? null}
              item={selectedItems[idx]?.name}
              subcategory={selectedItems[idx]?.subcategory_name}
              category={selectedItems[idx]?.category_name}
            />
            <p>Description: {selectedItems[idx]?.description}</p>
            <p>
              Quantity:{' '}
              <input
                type="number"
                min="1"
                placeholder="Quantity to add"
                defaultValue={1}
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
