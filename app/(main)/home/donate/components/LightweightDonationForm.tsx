'use client';

import { forwardRef, useState } from 'react';
import { DonationInsert } from '@/app/types/donation';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { PatternFormat, NumericFormat } from 'react-number-format';
import { Form, Container, Card, Alert } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';
import { createDonation } from '@/app/actions/donation';
import styles from '@/app/(main)/components/DonationForm.module.css';

const BootstrapInput = forwardRef<HTMLInputElement, FormControlProps>(
  (props, ref) => <Form.Control {...props} ref={ref} />,
);
BootstrapInput.displayName = 'BootstrapInput';

type Props = {
  storeNames: string[];
};

type FormData = {
  donor_type?: 'individual' | 'business';

  individual_name?: string;
  business_name?: string;
  business_contact_name?: string;

  email: string;
  phone: string;
  address: string;
  receiving_site: string;

  receive_emails: boolean;
  receive_mailings: boolean;
  remain_anonymous: boolean;

  estimated_value: string;
  items_donated: string;
};

export default function LightweightDonationForm({ storeNames }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      donor_type: undefined,
      phone: '',
      estimated_value: '',
      receiving_site: 'None',
    },
  });

  const donorType = useWatch({
    control,
    name: 'donor_type',
  });

  const receivingSiteOptions = ['None', ...storeNames];

  const onSubmit = async (data: FormData) => {
    const finalReceivingSite =
      data.receiving_site === 'None' || !data.receiving_site
        ? 'Headquarters'
        : data.receiving_site;

    setShowSuccess(false);

    const donation: DonationInsert = {
      donor_is_individual: data.donor_type === 'individual',

      donor_individual_name:
        data.donor_type === 'individual'
          ? data.individual_name ?? null
          : null,

      donor_business_name:
        data.donor_type === 'business' ? data.business_name ?? null : null,

      donor_business_contact_name:
        data.donor_type === 'business'
          ? data.business_contact_name ?? null
          : null,

      donor_email: data.email ?? null,
      donor_phone: data.phone ?? null,
      donor_street_address: data.address ?? null,

      donor_receive_emails: data.receive_emails,
      donor_receive_mailings: data.receive_mailings,
      donor_remain_anonymous: data.remain_anonymous,

      estimated_value:
        parseFloat(String(data.estimated_value).replace(/[^0-9.]/g, '')) || 0,
      items_donated: data.items_donated,

      store_name: finalReceivingSite,

      receiver_first_name: 'FIRST-NAME',
      receiver_last_name: 'LAST-NAME',
    };

    const result = await createDonation(donation);

    if (result.success) {
      setShowSuccess(true);
      setResetKey((k) => k + 1);

      reset({
        donor_type: undefined,
        individual_name: '',
        business_name: '',
        business_contact_name: '',
        email: '',
        phone: '',
        address: '',
        receiving_site: 'None',
        receive_emails: false,
        receive_mailings: false,
        remain_anonymous: false,
        estimated_value: '',
        items_donated: '',
      });

      clearErrors();
    } else {
      console.error('Failed to create donation:', result.error);
    }
  };

  return (
    <Container className={styles.formContainer}>
      <Card className={styles.formCard}>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formBody}>
            <div className={styles.formSection}>
              <h1 className={styles.formTitle1}>Store Information</h1>

              <Form.Group className={styles.receivingSiteGroup}>
                <Form.Label className={styles.fieldLabel}>
                  Receiving site
                </Form.Label>

                <Form.Select {...register('receiving_site')}>
                  {receivingSiteOptions.map((site) => (
                    <option key={site} value={site}>
                      {site}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <h1 className={styles.formTitle2}>Donor Information</h1>

            <Form.Group>
              <div className={styles.radioRow}>
                <Form.Check
                  type="radio"
                  label="Individual"
                  value="individual"
                  {...register('donor_type', {
                    required: 'Please select a donor type',
                  })}
                />
                <Form.Check
                  type="radio"
                  label="Business"
                  value="business"
                  {...register('donor_type', {
                    required: 'Please select a donor type',
                  })}
                />
              </div>
              {errors.donor_type && (
                <Form.Text className={styles.errorText}>
                  {errors.donor_type.message}
                </Form.Text>
              )}
            </Form.Group>

            {donorType && (
              <>
                <Form.Group>
                  <Form.Label className={styles.fieldLabel}>
                    Donor Street Address
                  </Form.Label>
                  <Form.Control
                    {...register('address', {
                      required: 'Street address is required',
                    })}
                    isInvalid={!!errors.address}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.fieldLabel}>
                    Donor Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                    })}
                    isInvalid={!!errors.email}
                  />
                </Form.Group>
              </>
            )}

            <h1 className={styles.formTitle2}>Donation Information</h1>

            <Form.Group>
              <Form.Label className={styles.fieldLabel}>
                Estimated value (USD)
              </Form.Label>
              <Controller
                key={resetKey}
                name="estimated_value"
                control={control}
                rules={{
                  required: 'Estimated donation value is required',
                }}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    prefix="$"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    customInput={BootstrapInput}
                  />
                )}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className={styles.fieldLabel}>
                Items donated
              </Form.Label>
              <Form.Control
                {...register('items_donated', {
                  required: 'Please enter the items you are donating',
                })}
              />
            </Form.Group>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>

            {showSuccess && (
              <Alert variant="success">
                Form submitted successfully! Thank you for your donation.
              </Alert>
            )}
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
}