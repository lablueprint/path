'use client';

import { updateItem } from '@/app/actions/inventory';
import { createClient } from '@/app/lib/supabase/browser-client';
import type { Category, InventoryItem, Subcategory } from '@/app/types/inventory';
import { useEffect, useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

type FormValues = {
  name: string;
  description: string;
  selectedCategory: string;
  selectedSubcategory: string;
};

const DEFAULT_PHOTO_URL = 'https://example.com/default-image.jpg';
const supabase = createClient();

function getDefaultValues(item: InventoryItem): FormValues {
  return {
    name: item.name,
    description: item.description,
    selectedCategory: '',
    selectedSubcategory: item.subcategory_id ? String(item.subcategory_id) : '',
  };
}

export function EditInventoryItemForm({ item }: { item: InventoryItem }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    getDefaultValues(item),
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(item),
  });

  const selectedCategory = useWatch({
    control,
    name: 'selectedCategory',
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data ?? []);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function setFormDefaults() {
      const nextValues = getDefaultValues(item);

      if (!item.subcategory_id) {
        setInitialValues(nextValues);
        reset(nextValues);
        return;
      }

      const { data, error } = await supabase
        .from('subcategories')
        .select('subcategory_id, category_id')
        .eq('subcategory_id', item.subcategory_id)
        .single();

      if (error || !data) {
        console.error('Error fetching item subcategory:', error);
        setInitialValues(nextValues);
        reset(nextValues);
        return;
      }

      const valuesWithCategory = {
        ...nextValues,
        selectedCategory: String(data.category_id),
        selectedSubcategory: String(data.subcategory_id),
      };

      setInitialValues(valuesWithCategory);
      reset(valuesWithCategory);
    }

    setFormDefaults();
  }, [item, reset]);

  useEffect(() => {
    async function fetchSubcategories() {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }

      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', Number(selectedCategory));

      if (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
        return;
      }

      setSubcategories(data ?? []);
    }

    fetchSubcategories();
  }, [selectedCategory]);

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      const result = await updateItem(item.inventory_item_id, {
        name: formData.name,
        description: formData.description,
        subcategory_id: formData.selectedSubcategory
          ? Number(formData.selectedSubcategory)
          : null,
        photo_url: DEFAULT_PHOTO_URL,
      });

      if (!result.success) {
        console.error('Failed to update inventory item:', result.error);
        return;
      }

      setInitialValues(formData);
      reset(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    reset(initialValues);
  };

  const categoryField = register('selectedCategory', {
    onChange: () => {
      setValue('selectedSubcategory', '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Inventory item name
          <input
            type="text"
            {...register('name', { required: 'Item name is required.' })}
          />
        </label>
        {errors.name && <p role="alert">{errors.name.message}</p>}
        <br />

        <label>
          Description
          <input
            type="text"
            {...register('description', {
              required: 'Description is required.',
            })}
          />
        </label>
        {errors.description && <p role="alert">{errors.description.message}</p>}
        <br />

        <label>
          Category
          <select {...categoryField}>
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {!!selectedCategory && (
          <>
            <br />
            <label>
              Subcategory
              <select
                {...register('selectedSubcategory', {
                  validate: (value) => {
                    if (!selectedCategory || value) {
                      return true;
                    }

                    return 'Subcategory is required.';
                  },
                })}
              >
                <option value="">None</option>
                {subcategories.map((subcategory) => (
                  <option
                    key={subcategory.subcategory_id}
                    value={subcategory.subcategory_id}
                  >
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </label>
            {errors.selectedSubcategory && (
              <p role="alert">{errors.selectedSubcategory.message}</p>
            )}
          </>
        )}

        {isDirty && (
          <>
            <br />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default EditInventoryItemForm;
