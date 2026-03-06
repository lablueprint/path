'use client';


import { useForm } from "react-hook-form";
import type { Store } from "../../../types/store";
import { updateStore } from "../../../actions/store";


type FormValues = {
  name: string;
  street_address: string;
};


type EditStoreFormProp = {
  store: Store;
};


export function EditStoreForm({ store }: { store: Store }) {
  const {
    register,
    handleSubmit,
    formState,
    reset,
  } = useForm<FormValues>({
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
      <input {...register("name")} />
      <input {...register("street_address")} />


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
