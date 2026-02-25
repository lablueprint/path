'use client';
import { createClient } from '@/app/lib/supabase/browser-client';
import { InventoryItem, Subcategory, Category } from '@/app/types/inventory';
import { createItem } from '@/app/actions/inventory';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';

type Inputs = {
  name: string;
  description: string;
  selectedCategory: string;
  selectedSubcategory: string;
};

export default function AddInventoryItemForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const supabase = createClient();
  const selectedCategory = watch('selectedCategory');

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      const result = await createItem({
        name: formData.name,
        description: formData.description,
        subcategory_id: formData.selectedSubcategory
          ? Number(formData.selectedSubcategory)
          : null,
      });

      if (result.success) {
        // Reset form fields after successful submission
        reset();
        console.log('Item created successfully:', result.data);
      } else {
        console.error('Failed to create item:', result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      const { data, error: err } = await supabase
        .from('categories')
        .select('*');
      if (err) {
        console.error('Error fetching categories:', err);
      } else {
        setCategories(data);
      }
    }
    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    async function fetchSubcategories() {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      const { data, error: err } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', selectedCategory);
      if (err) {
        console.error('Error fetching subcategories:', err);
      } else {
        setSubcategories(data);
      }
    }
    fetchSubcategories();
  }, [selectedCategory, supabase]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Inventory item name
          <input type="text" {...register('name', { required: true })} />
        </label>
        {errors.name?.type === 'required' && (
          <p role="alert">Item name is required.</p>
        )}
        <br></br>
        <label>
          Description
          <input type="text" {...register('description', { required: true })} />
        </label>
        {errors.description?.type === 'required' && (
          <p role="alert">Description is required.</p>
        )}
        <br></br>
        <label>
          Category
          <select {...register('selectedCategory', { required: true })}>
            <option value="">None</option>
            {categories.map((item) => (
              <option key={item.category_id} value={item.category_id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        {errors.selectedCategory?.type === 'required' && (
          <p role="alert">Category is required.</p>
        )}
        {selectedCategory !== '' && (
          <>
            <br></br>
            <label>
              Subcategory
              <select {...register('selectedSubcategory', { required: true })}>
                <option value="">None</option>
                {subcategories.map((subcat) => (
                  <option
                    key={subcat.subcategory_id}
                    value={subcat.subcategory_id}
                  >
                    {subcat.name}
                  </option>
                ))}
              </select>
            </label>
            {errors.selectedSubcategory?.type === 'required' && (
              <p role="alert">Subcategory is required.</p>
            )}
          </>
        )}
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
