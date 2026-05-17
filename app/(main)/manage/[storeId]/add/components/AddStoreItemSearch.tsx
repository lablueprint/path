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
import { Form, Container, Card } from 'react-bootstrap';
import AddItemCard from './AddItemCard';
import donationStyles from '@/app/(main)/components/DonationForm.module.css';
import searchStyles from './AddStoreItemSearch.module.css';
import { ListGroup } from 'react-bootstrap';

type ItemWithNames = InventoryItem & {
  category_name: string;
  subcategory_name: string;
};

const supabase = createClient();

export default function AddStoreItemSearch({
  setAutoFillItems,
  selectedItems,
  setSelectedItems,
}: {
  setAutoFillItems: (items: ItemWithNames[]) => void;
  selectedItems: ItemWithNames[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ItemWithNames[]>>;
}) {
  const methods = useFormContext<CombinedFormData>();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'items',
  });
  const [results, setResults] = useState<ItemWithNames[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createItemMethods = useForm<Inputs>();

  const [inventoryType, setInventoryType] = useState<'existing' | 'new' | null>(
    null,
  );

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
      } else {
        console.error('Failed to create item:', result.error);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <div>
      <Container className={donationStyles.formContainer}>
        <Card className="form-card">
          <Card.Body>
            <div className={donationStyles.formBody}>
              <Form.Group>
                <div className={donationStyles.radioRow}>
                  <Form.Check
                    type="radio"
                    label="Search for existing item in inventory"
                    value="existing"
                    id="inventory-existing"
                    name="inventoryType"
                    onChange={() => setInventoryType('existing')}
                  />
                  <Form.Check
                    type="radio"
                    label="Create new item"
                    value="new"
                    id="inventory-new"
                    name="inventoryType"
                    onChange={() => setInventoryType('new')}
                  />
                </div>
              </Form.Group>
              {inventoryType == 'existing' && (
                <div>
                  <div className="search-filter-wrapper">
                    <Form.Control
                      type="text"
                      placeholder="Search store items..."
                      className="search-bar"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {results.length > 0 && (
                    <ListGroup className={searchStyles.results}>
                      {results?.map((item) => (
                        <ListGroup.Item
                          key={item.inventory_item_id}
                          action
                          type="button"
                          className={searchStyles.item}
                          onClick={() => handleSelect(item)}
                        >
                          {item.name}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>
              )}
              {inventoryType == 'new' && (
                <FormProvider {...createItemMethods}>
                  <AddInventoryItemForm
                    selectedFile={selectedFile}
                    onFileChange={setSelectedFile}
                  />
                  <div>
                    <div className="submit-button-row">
                      <button
                        type="button"
                        onClick={createItemMethods.handleSubmit(
                          handleCreateAndSelect,
                        )}
                        className="btn-submit"
                      >
                        Create Item
                      </button>
                    </div>
                  </div>
                </FormProvider>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>

      <h3>Selected Items</h3>
      {fields.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-5">
          {fields.map((field, idx) => (
            <div key={field.id}>
              <AddItemCard
                id={selectedItems[idx]?.inventory_item_id}
                index={idx}
                photoUrl={selectedItems[idx]?.photo_url ?? null}
                item={selectedItems[idx]?.name}
                subcategory={selectedItems[idx]?.subcategory_name}
                category={selectedItems[idx]?.category_name}
                description={selectedItems[idx]?.description}
                onRemove={() => handleRemove(idx)}
              />
              <input
                type="hidden"
                {...methods.register(`items.${idx}.inventory_item_id`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No items selected.</p>
      )}
    </div>
  );
}
