'use client';

import { createClient } from '@/app/lib/supabase/browser-client';
import { Subcategory, Category } from '@/app/types/inventory';
import { createItem } from '@/app/actions/inventory';
import { useForm, useWatch, SubmitHandler } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultItemPhoto from '@/public/default-profile-picture.png';

type Inputs = {
  name: string;
  description: string;
  selectedCategory: string;
  selectedSubcategory: string;
};

const supabase = createClient();

export default function AddInventoryItemForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const selectedCategory = useWatch({
    control,
    name: 'selectedCategory',
  });

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    photoUploadRef.current?.resetFile();
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      let photoUrl: string | null = null;

      // Create the item first to get the inventory_item_id
      const result = await createItem({
        name: formData.name,
        description: formData.description,
        subcategory_id: formData.selectedSubcategory
          ? Number(formData.selectedSubcategory)
          : null,
      });

      if (!result.success || !result.data) {
        console.error('Failed to create item:', result.error);
        return;
      }

      const inventoryItemId = result.data.inventory_item_id;

      // Upload photo if selected
      if (selectedFile) {
        const filePath = `${inventoryItemId}/photo.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('inventory_item_photos')
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
        } else {
          const { data: publicData } = supabase.storage
            .from('inventory_item_photos')
            .getPublicUrl(filePath);
          photoUrl = `${publicData.publicUrl}?t=${Date.now()}`;

          // Update the item with the photo_url
          await supabase
            .from('inventory_items')
            .update({ photo_url: photoUrl })
            .eq('inventory_item_id', inventoryItemId);
        }
      }

      console.log('Item created successfully:', result.data);

      // Reset everything
      reset();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      photoUploadRef.current?.resetFile();
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
  }, []);

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
  }, [selectedCategory]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Image
          src={previewUrl || defaultItemPhoto}
          alt="Item photo"
          width={64}
          height={64}
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        {selectedFile && (
          <button type="button" onClick={handleRemovePhoto}>
            Remove
          </button>
        )}
        <br />
        <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
        <br />
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
        {!!selectedCategory && (
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
