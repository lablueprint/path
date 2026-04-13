'use client';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import AddInventoryItemForm, {
  Inputs,
} from '@/app/(main)/manage/components/AddInventoryItemForm';
import { createItem } from '@/app/actions/inventory';

export default function AddInventoryItemPage() {
  const methods = useForm<Inputs>();

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
        methods.reset();
        console.log('Item created successfully:', result.data);
      } else {
        console.error('Failed to create item:', result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h1>Add Inventory Item</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AddInventoryItemForm />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    </div>
  );
}
