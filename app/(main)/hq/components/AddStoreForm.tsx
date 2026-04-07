'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createStore } from '../../../actions/store';

type FormValues = {
  storeName: string;
  storeStreetAddress: string;
};

export default function AddStoreForm() {
  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      storeName: '',
      storeStreetAddress: '',
    },
  });

  const storeName = useWatch({
    control,
    name: 'storeName',
  });
  const storeStreetAddress = useWatch({
    control,
    name: 'storeStreetAddress',
  });

  const bothFilled =
    storeName.trim().length > 0 && storeStreetAddress.trim().length > 0;
  const eitherFilled =
    storeName.trim().length > 0 || storeStreetAddress.trim().length > 0;

  const onSubmit = async (data: FormValues) => {
    await createStore({
      name: data.storeName,
      street_address: data.storeStreetAddress,
    });
    reset({ storeName: '', storeStreetAddress: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Store name</label>
        <input {...register('storeName')} />
      </div>

      <div>
        <label>Store street address</label>
        <input {...register('storeStreetAddress')} />
      </div>

      {bothFilled && <button type="submit">Save</button>}

      {eitherFilled && (
        <button
          type="button"
          onClick={() => reset({ storeName: '', storeStreetAddress: '' })}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
