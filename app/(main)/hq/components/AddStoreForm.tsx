'use client';

import { useForm, useWatch } from 'react-hook-form';
import { createStore } from '@/app/actions/store';
import { Form, Card, Container } from 'react-bootstrap';

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

  // return (
  //   <form onSubmit={handleSubmit(onSubmit)}>
  //     <div>
  //       <label>Store name</label>
  //       <input {...register('storeName')} />
  //     </div>

  //     <div>
  //       <label>Store street address</label>
  //       <input {...register('storeStreetAddress')} />
  //     </div>

  //     {bothFilled && <button type="submit">Save</button>}

  //     {eitherFilled && (
  //       <button
  //         type="button"
  //         onClick={() => reset({ storeName: '', storeStreetAddress: '' })}
  //       >
  //         Cancel
  //       </button>
  //     )}
  //   </form>
  // );

  return (
    <Container className="form-card-container">
      {' '}
      {/* or whatever wrapper fits the /hq layout */}
      <Card className="form-card">
        <Card.Body>
          <h2 className="form-title-1">Add Store</h2>
          <div className="form-body">
            {' '}
            {/* add this to globals if not already there */}
            <Form.Group controlId="storeName">
              <Form.Label className="field-label">Store name</Form.Label>
              <Form.Control {...register('storeName')} />
            </Form.Group>
            <Form.Group controlId="storeStreetAddress">
              <Form.Label className="field-label">
                Store street address
              </Form.Label>
              <Form.Control {...register('storeStreetAddress')} />
            </Form.Group>
            <div className="submit-button-row">
              {' '}
              {/* add to globals */}
              {eitherFilled && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() =>
                    reset({ storeName: '', storeStreetAddress: '' })
                  }
                >
                  Cancel
                </button>
              )}
              {bothFilled && (
                <button type="submit" className="btn-submit">
                  Save
                </button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
