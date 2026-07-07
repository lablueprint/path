'use client';

import { updateItem } from '@/app/actions/inventory';
import { createClient } from '@/app/lib/supabase/browser-client';
import type {
  Category,
  InventoryItem,
  Subcategory,
} from '@/app/types/inventory';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';

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
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(item),
  });

  const selectedCategory = useWatch({
    control,
    name: 'selectedCategory',
  });
  const time = useTime();

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

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      await supabase.auth.getUser();
      let finalPhotoUrl = photoUrl;

      if (isPendingDelete) {
        await supabase.storage
          .from('inventory_item_photos')
          .remove([`${item.inventory_item_id}/item.jpg`]);
        finalPhotoUrl = null;
      }

      if (selectedFile) {
        const { error: uploadError } = await supabase.storage
          .from('inventory_item_photos')
          .upload(`${item.inventory_item_id}/item.jpg`, selectedFile, {
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('inventory_item_photos')
          .getPublicUrl(`${item.inventory_item_id}/item.jpg`);
        finalPhotoUrl = `${publicData.publicUrl}?t=${time}`;
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
      /* photoUploadRef.current?.resetFile(); */
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

  const hasDirtyTextOrImage = isDirty || !!selectedFile || isPendingDelete;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-card">
      <div className="card-body">
        <div className="two-col-layout">
          <div className="photo-col">
            <PhotoUpload
              ref={photoUploadRef}
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              initialPhotoUrl={photoUrl}
              isPendingDelete={isPendingDelete}
              onRemove={handleRemovePhoto}
            />
          </div>
          <div className="fields-col">
            <div>
              <label className="form-label field-label">Item Title</label>
              <Form.Control
                type="text"
                {...register('name', { required: 'Item name is required.' })}
                className="form-control"
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </div>

            <div>
              <label className="form-label field-label">Description</label>
              <Form.Control
                as="textarea"
                {...register('description', {
                  required: 'Description is required.',
                })}
                className="form-control"
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </div>

            <div>
              <label className="form-label field-label">Category</label>
              <Form.Select
                {...register('selectedCategory', {
                  required: 'Category is required.',
                })}
                isInvalid={!!errors.selectedCategory}
              >
                <option value="">None</option>
                {initialCategories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.selectedCategory?.message}
              </Form.Control.Feedback>
            </div>

            {!!selectedCategory && (
              <div>
                <label className="form-label field-label">Subcategory</label>
                <Form.Select
                  {...register('selectedSubcategory', {
                    required: 'Subcategory is required.',
                  })}
                  isInvalid={!!errors.selectedSubcategory}
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
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.selectedSubcategory?.message}
                </Form.Control.Feedback>
              </div>
            )}

            {hasDirtyTextOrImage && (
              <div className="button-spacing">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
