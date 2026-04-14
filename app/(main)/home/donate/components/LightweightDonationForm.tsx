'use client';

import { forwardRef, useState } from 'react';
import { DonationInsert } from '@/app/types/donation';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { Form, Container, Card, Alert } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';
import { createDonation } from '@/app/actions/donation';
import styles from '@/app/(main)/components/DonationForm.module.css';

const BootstrapInput = forwardRef<HTMLInputElement, FormControlProps>(
  (props, ref) => <Form.Control {...props} ref={ref} />,
);
BootstrapInput.displayName = 'BootstrapInput';

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

export default function LightweightDonationForm() {
  const [showSuccess, setShowSuccess] = useState(false);

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
    },
  });

  const donorType = useWatch({
    control,
    name: 'donor_type',
  });

  const onSubmit = async (data: FormData) => {
    setShowSuccess(false);

    const donation: DonationInsert = {
      donor_is_individual: data.donor_type === 'individual',

      donor_individual_name:
        data.donor_type === 'individual'
          ? (data.individual_name ?? null)
          : null,

      donor_business_name:
        data.donor_type === 'business' ? (data.business_name ?? null) : null,

      donor_business_contact_name:
        data.donor_type === 'business'
          ? (data.business_contact_name ?? null)
          : null,

      donor_email: data.email ?? null,
      donor_phone: data.phone ?? null,
      donor_street_address: data.address ?? null,

      donor_receive_emails: data.receive_emails,
      donor_receive_mailings: data.receive_mailings,
      donor_remain_anonymous: data.remain_anonymous,

      estimated_value: parseFloat(data.estimated_value),
      items_donated: data.items_donated,

      receiver_first_name: 'FIRST-NAME',
      receiver_last_name: 'LAST-NAME',
    };

    const result = await createDonation(donation);

    if (result.success) {
      setShowSuccess(true);
      reset({
        donor_type: undefined,
        individual_name: '',
        business_name: '',
        business_contact_name: '',
        email: '',
        phone: '',
        address: '',
        receiving_site: '',
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
            <h1 className={styles.formTitle}>Store Information</h1>
            <Form.Group
              controlId="receiving_site"
              className={styles.receivingSiteGroup}
            >
              <Form.Label className={styles.fieldLabel}>
                Receiving site
              </Form.Label>
              <Form.Select {...register('receiving_site')} defaultValue="">
                <option value="" disabled>
                  Select a receiving site
                </option>
                <option value="path-site-1">PATH site 1</option>
                <option value="path-site-2">PATH site 2</option>
                <option value="path-site-3">PATH site 3</option>
              </Form.Select>
            </Form.Group>

            <h1 className={styles.formTitle}>Donor Information</h1>

            <Form.Group>
              <div className={styles.radioRow}>
                <Form.Check
                  type="radio"
                  label="Individual"
                  value="individual"
                  id="donor-individual"
                  {...register('donor_type', {
                    required: 'Please select a donor type',
                  })}
                />
                <Form.Check
                  type="radio"
                  label="Business"
                  value="business"
                  id="donor-business"
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
                <div className={styles.twoColRow}>
                  <div>
                    {donorType === 'individual' && (
                      <Form.Group controlId="individual_name">
                        <Form.Label className={styles.fieldLabel}>
                          Individual Name
                        </Form.Label>
                        <Form.Control
                          {...register('individual_name', {
                            required: 'Individual name is required',
                          })}
                          isInvalid={!!errors.individual_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.individual_name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    {donorType === 'business' && (
                      <div className={styles.businessFields}>
                        <Form.Group controlId="business_name">
                          <Form.Label className={styles.fieldLabel}>
                            Business Name
                          </Form.Label>
                          <Form.Control
                            {...register('business_name', {
                              required: 'Business name is required',
                            })}
                            isInvalid={!!errors.business_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.business_name?.message}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="business_contact_name">
                          <Form.Label className={styles.fieldLabel}>
                            Business Contact Name
                          </Form.Label>
                          <Form.Control
                            {...register('business_contact_name', {
                              required: 'Business contact name is required',
                            })}
                            isInvalid={!!errors.business_contact_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.business_contact_name?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    )}
                  </div>

                  <div>
                    <Form.Group controlId="address">
                      <Form.Label className={styles.fieldLabel}>
                        Donor Street Address
                      </Form.Label>
                      <Form.Control
                        {...register('address', {
                          required: 'Street address is required',
                        })}
                        isInvalid={!!errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                <div className={styles.twoColRow}>
                  <div>
                    <Form.Group controlId="email">
                      <Form.Label className={styles.fieldLabel}>
                        Donor Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div>
                    <Form.Group controlId="phone">
                      <Form.Label className={styles.fieldLabel}>
                        Donor Phone Number (Optional)
                      </Form.Label>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          validate: (value) => {
                            const digits = value?.replace(/\D/g, '');
                            return (
                              !digits ||
                              digits.length === 10 ||
                              'Phone number must be 10 digits'
                            );
                          },
                        }}
                        render={({ field }) => (
                          <PatternFormat
                            {...field}
                            format="(###) ###-####"
                            mask="_"
                            placeholder="(415) 555-1234"
                            allowEmptyFormatting
                            onValueChange={(values) => {
                              field.onChange(values.value);
                            }}
                            customInput={BootstrapInput}
                            isInvalid={!!errors.phone}
                          />
                        )}
                      />
                      {errors.phone && (
                        <Form.Text className={styles.errorText}>
                          {errors.phone.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className={styles.checkboxGroup}>
                  <Form.Check
                    type="checkbox"
                    label="Donor receive emails?"
                    id="receive_emails"
                    {...register('receive_emails')}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Donor receive mailings?"
                    id="receive_mailings"
                    {...register('receive_mailings')}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Donor remain anonymous?"
                    id="remain_anonymous"
                    {...register('remain_anonymous')}
                  />
                </Form.Group>
              </>
            )}

            <h1 className={styles.formTitle}>Donation Information</h1>

            <Form.Group controlId="estimated_value">
              <Form.Label className={styles.fieldLabel}>
                Estimated value (USD)
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="1234.56"
                {...register('estimated_value', {
                  required: 'Estimated donation value is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message:
                      'Please enter a valid dollar amount in the form 1234.56',
                  },
                })}
                isInvalid={!!errors.estimated_value}
              />
              <Form.Control.Feedback type="invalid">
                {errors.estimated_value?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="items_donated">
              <Form.Label className={styles.fieldLabel}>
                Items donated
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Describe the items you are donating"
                {...register('items_donated', {
                  required: 'Please enter the items you are donating',
                  maxLength: {
                    value: 500,
                    message: 'Items description cannot exceed 500 characters',
                  },
                })}
                isInvalid={!!errors.items_donated}
              />
              <Form.Control.Feedback type="invalid">
                {errors.items_donated?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className={styles.submitButtonRow}>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </div>

            {showSuccess && (
              <Alert variant="success" className="mb-0">
                Form submitted successfully! Thank you for your donation.
              </Alert>
            )}
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
}
