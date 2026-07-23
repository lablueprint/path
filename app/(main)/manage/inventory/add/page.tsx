'use client';
import { useState, useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import AddInventoryItemForm, {
  Inputs,
} from '@/app/(main)/manage/components/AddInventoryItemForm';
import { createItem } from '@/app/actions/inventory';
import { createClient } from '@/app/lib/supabase/browser-client';
import { Button } from 'react-bootstrap';

const supabase = createClient();

export default function AddInventoryItemPage() {
  const methods = useForm<Inputs>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      const result = await createItem({
        name: formData.name,
        description: formData.description,
        subcategory_id: Number(formData.selectedSubcategory),
      });

      if (!result.success) {
        console.error('Failed to create item:', result.error);
        return;
      }

      const inventoryItemId = result.data?.inventory_item_id;
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
          const photoUrl = `${publicData.publicUrl}?t=${time}`;

          await supabase
            .from('inventory_items')
            .update({ photo_url: photoUrl })
            .eq('inventory_item_id', inventoryItemId);
        }
      }

      methods.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Breadcrumbs
        labelMap={{
          manage: 'Manage Inventory',
          inventory: 'Inventory Library',
          add: 'Add Inventory Item',
        }}
      />
      <h1>Add Inventory Item</h1>
      <div className="form-card">
        <div className="card-body">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="form-body"
            >
              <AddInventoryItemForm
                selectedFile={selectedFile}
                onFileChange={setSelectedFile}
              />
              <div>
                <Button className="btn-submit" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
