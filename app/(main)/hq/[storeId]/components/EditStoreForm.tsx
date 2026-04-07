'use client';

import { useForm } from 'react-hook-form';
import type { Store } from '@/app/types/store';
import { updateStore } from '@/app/actions/store';

type FormValues = {
  name: string;
  street_address: string;
};

export function EditStoreForm({ store }: { store: Store }) {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: {
      name: store.name,
      street_address: store.street_address,
    },
  });

  const onSubmit = async (data: FormValues) => {
    await updateStore(store.store_id, data);
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Store name</label>
        <input {...register('name')} />
      </div>
      <div>
        <label>Store street address</label>
        <input {...register('street_address')} />
      </div>

      {formState.isDirty && (
        <>
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() =>
              reset({
                name: store.name,
                street_address: store.street_address,
              })
            }
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
}
