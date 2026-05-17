'use client';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Subcategory, Category } from '@/app/types/inventory';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import PhotoUpload from '@/app/(main)/components/PhotoUpload';
import defaultItemPhoto from '@/public/image-placeholder.svg';
import { Form } from 'react-bootstrap';
import donationStyles from '@/app/(main)/components/DonationForm.module.css';
import styles from '@/app/(main)/manage/components/AddInventoryItemForm.module.css';

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

const supabase = createClient();

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
    <div className={donationStyles.formBody}>
      {/* Item Title */}
      <Form.Group controlId="name">
        <Form.Label className={donationStyles.fieldLabel}>
          Item Title
        </Form.Label>
        <Form.Control
          type="text"
          className={styles.nameField}
          {...register('name', { required: 'Item name is required' })}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>
      {/* Image */}
      <Form.Group controlId="image">
        <Form.Label className={donationStyles.fieldLabel}>Image</Form.Label>
        {/* placeholder for drag and drop */}
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
          <div>
            <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
          </div>
        </div>
      </Form.Group>

      {/* Description */}
      <Form.Group controlId="description">
        <Form.Label className={donationStyles.fieldLabel}>
          Description
        </Form.Label>
        <Form.Control
          as="textarea"
          className={styles.descriptionField}
          {...register('description', { required: 'Description is required' })}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Category */}
      <Form.Group controlId="selectedCategory">
        <Form.Label className={donationStyles.fieldLabel}>Category</Form.Label>
        <Form.Select
          className={styles.selectField}
          {...register('selectedCategory', {
            required: 'Category is required.',
          })}
          isInvalid={!!errors.selectedCategory}
        >
          <option value="">None</option>
          {categories.map((item) => (
            <option key={item.category_id} value={item.category_id}>
              {item.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.selectedCategory?.message}
        </Form.Control.Feedback>
      </Form.Group>
      {/* subcategory */}
      <Form.Group controlId="selectedSubcategory">
        <Form.Label className={donationStyles.fieldLabel}>
          Subcategory
        </Form.Label>
        <Form.Select
          className={styles.selectField}
          {...register('selectedSubcategory', {
            required: 'Subcategory is required.',
          })}
          isInvalid={!!errors.selectedSubcategory}
        >
          <option value="">None</option>
          {subcategories.map((subcat) => (
            <option key={subcat.subcategory_id} value={subcat.subcategory_id}>
              {subcat.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.selectedSubcategory?.message}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
}
