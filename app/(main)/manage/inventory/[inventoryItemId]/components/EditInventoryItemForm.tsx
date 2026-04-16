'use client';

import type { InventoryItem, InventoryItemUpdate } from '@/app/types/inventory';
import type { Category, Subcategory } from '@/app/types/inventory';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { deleteItem } from '@/app/actions/inventory';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultItemPhoto from '@/public/default-profile-picture.png';
import { useRouter } from 'next/navigation';

type FormValues = {
  name: string;
  description: string;
  selectedCategory: string;
  selectedSubcategory: string;
};

export default function EditInventoryItemForm({
  item,
  initialCategory,
}: {
  item: InventoryItem;
  initialCategory: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    item.photo_url ?? null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: item.name,
      description: item.description,
      selectedCategory: initialCategory,
      selectedSubcategory: item.subcategory_id
        ? String(item.subcategory_id)
        : '',
    },
  });

  const selectedCategory = useWatch({ control, name: 'selectedCategory' });

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) setCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchSubcategories() {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', selectedCategory);
      if (!error) setSubcategories(data);
    }
    fetchSubcategories();
  }, [selectedCategory]);

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
    setIsPendingDelete(false);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsPendingDelete(true);
    photoUploadRef.current?.resetFile();
  };

  const onCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsPendingDelete(false);
    setPhotoUrl(item.photo_url ?? null);
    photoUploadRef.current?.resetFile();
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      await supabase.auth.getUser();
      let finalPhotoUrl = photoUrl;

      const getOldPath = (url: string) => {
        try {
          const urlObj = new URL(url);
          const parts = urlObj.pathname.split('/inventory_item_photos/');
          return parts.length === 2 ? parts[1] : null;
        } catch {
          return null;
        }
      };

      if (isPendingDelete) {
        const oldPath = photoUrl ? getOldPath(photoUrl) : null;
        if (oldPath) {
          await supabase.storage
            .from('inventory_item_photos')
            .remove([oldPath]);
        }
        finalPhotoUrl = null;
      }

      if (selectedFile) {
        const oldPath = photoUrl ? getOldPath(photoUrl) : null;
        if (oldPath) {
          await supabase.storage
            .from('inventory_item_photos')
            .remove([oldPath]);
        }

        const uniqueFileName = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
        const newFilePath = `${item.inventory_item_id}/${uniqueFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('inventory_item_photos')
          .upload(newFilePath, selectedFile, {
            upsert: false,
            contentType: selectedFile.type,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
          setIsSaving(false);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('inventory_item_photos')
          .getPublicUrl(newFilePath);
        finalPhotoUrl = `${publicData.publicUrl}?t=${Date.now()}`;
      }

      const changes: InventoryItemUpdate = {};
      if (data.name !== item.name) changes.name = data.name;
      if (data.description !== item.description)
        changes.description = data.description;
      if (data.selectedSubcategory !== String(item.subcategory_id ?? ''))
        changes.subcategory_id = data.selectedSubcategory
          ? Number(data.selectedSubcategory)
          : null;
      if (selectedFile || isPendingDelete) {
        changes.photo_url = finalPhotoUrl;
      }

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update(changes)
        .eq('inventory_item_id', item.inventory_item_id);

      if (updateError) {
        console.error('Update error:', updateError.message);
      } else {
        setPhotoUrl(finalPhotoUrl);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsPendingDelete(false);
        photoUploadRef.current?.resetFile();
        reset({
          name: data.name,
          description: data.description,
          selectedCategory: data.selectedCategory,
          selectedSubcategory: data.selectedSubcategory,
        });
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this inventory item?')) return;

    if (photoUrl) {
      try {
        const urlObj = new URL(photoUrl);
        const parts = urlObj.pathname.split('/inventory_item_photos/');
        const oldPath = parts.length === 2 ? parts[1] : null;
        if (oldPath) {
          await supabase.storage
            .from('inventory_item_photos')
            .remove([oldPath]);
        }
      } catch (e) {
        console.error('Failed to parse photo URL for deletion', e);
      }
    }

    const result = await deleteItem(item.inventory_item_id);
    if (result.success) {
      router.push('/manage/inventory');
    } else {
      console.error('Error deleting item:', result.error);
    }
  };

  const displayImage = isPendingDelete
    ? defaultItemPhoto.src
    : previewUrl || photoUrl || defaultItemPhoto.src;

  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Image
        src={displayImage}
        alt="Item photo"
        width={64}
        height={64}
        style={{ objectFit: 'cover' }}
        unoptimized
      />

      {!isPendingDelete && displayImage !== defaultItemPhoto.src && (
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
      <br />
      <label>
        Description
        <input type="text" {...register('description', { required: true })} />
      </label>
      <br />
      <label>
        Category
        <select {...register('selectedCategory')}>
          <option value="">None</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      {!!selectedCategory && (
        <>
          <br />
          <label>
            Subcategory
            <select {...register('selectedSubcategory')}>
              <option value="">None</option>
              {subcategories.map((sub) => (
                <option key={sub.subcategory_id} value={sub.subcategory_id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      <br />

      {hasDirtyTextOrImage && (
        <>
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </>
      )}

      <br />
      <button type="button" onClick={handleDelete}>
        Remove inventory item
      </button>
    </form>
  );
}
