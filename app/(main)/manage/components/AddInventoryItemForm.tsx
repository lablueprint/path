'use client';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Subcategory, Category } from '@/app/types/inventory';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultItemPhoto from '@/public/image-placeholder.svg';

export type Inputs = {
  name: string;
  description: string;
  selectedCategory: string;
  selectedSubcategory: string;
};

type AddInventoryItemFormProps = {
  selectedFile?: File | null;
  onFileChange?: (file: File | null) => void;
};

export default function AddInventoryItemForm({
  selectedFile: selectedFileProp,
  onFileChange,
}: AddInventoryItemFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<Inputs>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedFileState, setSelectedFileState] = useState<File | null>(null);
  const photoUploadRef = useRef<{ resetFile: () => void }>(null);
  const selectedCategory = watch('selectedCategory');
  const selectedFile = selectedFileProp ?? selectedFileState;

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const supabase = createClient();

  const handleFileChanged = (file: File | null) => {
    if (onFileChange) {
      onFileChange(file);
    } else {
      setSelectedFileState(file);
    }
  };

  const handleFileSelect = (file: File) => {
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      alert('File is too large. Please select an image under 200 KB.');
      return;
    }
    handleFileChanged(file);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    handleFileChanged(null);
    photoUploadRef.current?.resetFile();
  };

  useEffect(() => {
    if (!selectedFile) {
      photoUploadRef.current?.resetFile();
    }
  }, [selectedFile]);

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
      <br />
      <label>
        Description
        <input type="text" {...register('description', { required: true })} />
      </label>
      {errors.description?.type === 'required' && (
        <p role="alert">Description is required.</p>
      )}
      <br />
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
          <br />
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
    </div>
  );
}
