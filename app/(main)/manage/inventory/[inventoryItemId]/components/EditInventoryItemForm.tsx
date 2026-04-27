'use client';

import { updateItem } from '@/app/actions/inventory';
import { createClient } from '@/app/lib/supabase/browser-client';
import type {
  Category,
  InventoryItem,
  Subcategory,
} from '@/app/types/inventory';
import Image from 'next/image';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultItemPhoto from '@/public/default-profile-picture.png';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

type FormValues = {
  name: string;
  description: string;
  selectedCategory: string;
  selectedSubcategory: string;
};

const supabase = createClient();

function getDefaultValues(
  item: InventoryItem & { category_id: string | undefined },
): FormValues {
  return {
    name: item.name,
    description: item.description,
    selectedCategory: item.category_id ? String(item.category_id) : '',
    selectedSubcategory: item.subcategory_id ? String(item.subcategory_id) : '',
  };
}

export default function EditInventoryItemForm({
  item,
  initialCategories,
  initialSubcategories,
}: {
  item: InventoryItem & { category_id: string | undefined };
  initialCategories: Category[];
  initialSubcategories: Subcategory[];
}) {
  const [subcategories, setSubcategories] =
    useState<Subcategory[]>(initialSubcategories);
  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    getDefaultValues(item),
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    item.photo_url ?? null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(item),
  });

  const selectedCategory = useWatch({
    control,
    name: 'selectedCategory',
  });

  useEffect(() => {
    async function fetchSubcategories() {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }

      if (selectedCategory === String(item.category_id)) {
        setSubcategories(initialSubcategories);
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
  }, [selectedCategory, item.category_id, initialSubcategories]);

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

  const getOldPath = (url: string) => {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split('/inventory_item_photos/');
      return parts.length === 2 ? parts[1] : null;
    } catch {
      return null;
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      await supabase.auth.getUser();
      let finalPhotoUrl = photoUrl;

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
          return;
        }

        const { data: publicData } = supabase.storage
          .from('inventory_item_photos')
          .getPublicUrl(newFilePath);
        finalPhotoUrl = `${publicData.publicUrl}?t=${Date.now()}`;
      }

      const result = await updateItem(item.inventory_item_id, {
        name: formData.name,
        description: formData.description,
        subcategory_id: formData.selectedSubcategory
          ? Number(formData.selectedSubcategory)
          : null,
        ...(selectedFile || isPendingDelete
          ? { photo_url: finalPhotoUrl }
          : {}),
      });

      if (!result.success) {
        console.error('Failed to update inventory item:', result.error);
        return;
      }

      setPhotoUrl(finalPhotoUrl);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      setIsPendingDelete(false);
      photoUploadRef.current?.resetFile();
      setInitialValues(formData);
      reset(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsPendingDelete(false);
    photoUploadRef.current?.resetFile();
    if (initialValues.selectedCategory === String(item.category_id)) {
      setSubcategories(initialSubcategories);
    }
    reset(initialValues, { keepErrors: false });
  };

  const categoryField = register('selectedCategory', {
    onChange: () => {
      setValue('selectedSubcategory', '', {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
  });

  const displayImage = isPendingDelete
    ? defaultItemPhoto.src
    : previewUrl || photoUrl || defaultItemPhoto.src;

  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  return (
    <div>
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
            {initialCategories.map((category) => (
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
                  required: 'Subcategory is required.',
                  onChange: () => trigger('selectedSubcategory'),
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

        {hasDirtyTextOrImage && (
          <>
            <br />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </>
        )}
      </form>
    </div>
  );
}
