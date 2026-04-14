'use client';

import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { Form, Container, Card } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';
import { CombinedFormData } from '@/app/(main)/manage/[storeId]/add/components/StoreItemsDonationForm';
import styles from '@/app/(main)/components/DonationForm.module.css';

const BootstrapInput = forwardRef<HTMLInputElement, FormControlProps>(
  (props, ref) => <Form.Control {...props} ref={ref} />
);
BootstrapInput.displayName = 'BootstrapInput';

export default function DonationForm({
  setItemsDonated,
  donorType,
  showSubmitButton,
}: {
  setItemsDonated: (value: string) => void;
  donorType: 'individual' | 'business' | undefined;
  showSubmitButton: boolean;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CombinedFormData>();

  return (
    <Container className={styles.formContainer}>
      <Card className={styles.formCard}>
        <Card.Body>
          <h1 className={styles.formTitle}>Donor Information</h1>
          <div className={styles.formBody}>
            {/* Donor Type */}
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

            {/* Name + Address (same row) */}
            <div className={styles.twoColRow}>
              <div>
                {/* Conditional Name Field: Individual */}
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

                {/* Conditional Name Field: Business */}
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
                {/* Street Address */}
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

            {/* Email + Phone (same row) */}
            <div className={styles.twoColRow}>
              <div>
                {/* Email */}
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
                {/* Phone */}
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

            {/* Checkboxes */}
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

            <h1 className={`${styles.formTitle} ${styles.sectionTitle}`}>
              Donation Information
            </h1>

            {/* Estimated Value */}
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

            {/* Items Donated */}
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
                  onChange: (e) => setItemsDonated(e.target.value),
                })}
                isInvalid={!!errors.items_donated}
              />
              <Form.Control.Feedback type="invalid">
                {errors.items_donated?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {showSubmitButton && (
              <div className={styles.submitButtonRow}>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}