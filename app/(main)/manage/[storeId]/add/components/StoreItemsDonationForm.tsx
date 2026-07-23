'use client';

import { useEffect, useState } from 'react';
import { Store } from '@/app/types/store';
import { User } from '@/app/types/user';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import DonationForm from '@/app/(main)/manage/[storeId]/add/components/DonationForm';
import { DonationInsert } from '@/app/types/donation';
import { createDonation } from '@/app/actions/donation';
import { addUpdateStoreItemQuantity } from '@/app/actions/store';
import { InventoryItem } from '@/app/types/inventory';
import AddStoreItemSearch from '@/app/(main)/manage/[storeId]/add/components/AddStoreItemSearch';
import { Form, Button, Alert } from 'react-bootstrap';
type ItemWithNames = InventoryItem & {
  category_name: string;
  subcategory_name: string;
};

export type CombinedFormData = {
  itemSettings?: string[];
  // Donation Form
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
  //Store Items Form
  items: {
    inventory_item_id: string;
    quantity: number;
  }[];
};

export default function StoreItemsDonationForm({
  store,
  user,
}: {
  store: Store;
  user: User;
}) {
  const methods = useForm<CombinedFormData>({
    defaultValues: {
      itemSettings: [],
      donor_type: undefined,
      phone: undefined,
      estimated_value: '',
      items: [],
    },
  });

  const itemSettingsSelected =
    useWatch({ control: methods.control, name: 'itemSettings' }) || [];
  const isGiftSelected = itemSettingsSelected.includes('giftInKind');
  const isInventorySelected =
    itemSettingsSelected.includes('addInventoryItems');
  const donorType = useWatch({ control: methods.control, name: 'donor_type' });
  const [selectedItems, setSelectedItems] = useState<ItemWithNames[]>([]);
  const [autoFillItems, setAutoFillItems] = useState<ItemWithNames[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemsErrorMessage, setItemsErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const handleRawPhone = (value: string) => {
    setRawPhone(value);
  };
  const setItemsDonated = (value: string) => {
    methods.setValue('items_donated', value, { shouldValidate: true });
  };
  useEffect(() => {
    if (isGiftSelected && isInventorySelected) {
      // Only run the sync logic if there are actually items to fill
      if (autoFillItems.length > 0) {
        const itemsString = autoFillItems.map((item) => item.name).join(', ');

        methods.setValue('items_donated', itemsString, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        // If autoFillItems is empty, reset the field value silently
        methods.setValue('items_donated', '', {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      }
    }
  }, [isGiftSelected, isInventorySelected, autoFillItems, methods]);

  const onSubmit = async (data: CombinedFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setItemsErrorMessage('');
    try {
      const inventoryErrors: string[] = [];
      let donationError = '';

      if (data.itemSettings?.includes('addInventoryItems')) {
        if (data.items.length === 0) {
          setItemsErrorMessage(
            'Please select one or more items to add to inventory.',
          );
          return;
        }
        for (const item of data.items) {
          const { error } = await addUpdateStoreItemQuantity(
            item.inventory_item_id,
            item.quantity,
            store.store_id,
          );
          if (error) inventoryErrors.push(error);
        }
      }

      if (data.itemSettings?.includes('giftInKind')) {
        const donation: DonationInsert = {
          donor_is_individual: data.donor_type === 'individual',

          donor_individual_name:
            data.donor_type === 'individual'
              ? (data.individual_name ?? null)
              : null,

          donor_business_name:
            data.donor_type === 'business'
              ? (data.business_name ?? null)
              : null,

          donor_business_contact_name:
            data.donor_type === 'business'
              ? (data.business_contact_name ?? null)
              : null,

          donor_email: data.email ?? null,
          donor_phone: rawPhone || null,
          donor_street_address: data.address ?? null,

          donor_receive_emails: data.receive_emails,
          donor_receive_mailings: data.receive_mailings,
          donor_remain_anonymous: data.remain_anonymous,

          estimated_value:
            parseFloat(String(data.estimated_value).replace(/[^0-9.]/g, '')) ||
            0,
          items_donated: data.items_donated,

          receiver_first_name: user?.first_name,
          receiver_last_name: user?.last_name,
          store_name: store?.name,
          store_street_address: store?.street_address,
        };
        const { error } = await createDonation(donation);
        if (error) donationError = error;
      }

      if (inventoryErrors.length > 0 && donationError) {
        setErrorMessage(
          'Inventory update and donation submission failed: ' + donationError,
        );
      } else if (inventoryErrors.length > 0) {
        setErrorMessage(
          inventoryErrors[0] ?? 'One or more inventory updates failed.',
        );
      } else if (donationError) {
        setErrorMessage(donationError);
      } else {
        // Reset all fields to empty/default values
        methods.reset({
          itemSettings: [],
          donor_type: undefined,
          individual_name: '',
          business_name: '',
          business_contact_name: '',
          email: '',
          phone: undefined,
          address: '',
          receiving_site: '',
          receive_emails: false,
          receive_mailings: false,
          remain_anonymous: false,
          estimated_value: '',
          items_donated: '',
          items: [],
        });
        setSelectedItems([]);
        setAutoFillItems([]);
        methods.clearErrors();
        setSuccessMessage('Submission saved.');
      }
    } catch (error) {
      setErrorMessage('Failed to process submission: ' + error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="gap-container"
        >
          <div className="checkbox-row">
            <Form.Check
              type="checkbox"
              id="addInventoryItems"
              label="Inventory"
              value="addInventoryItems"
              {...methods.register('itemSettings')}
            />
            <Form.Check
              type="checkbox"
              id="giftInKind"
              label="Gift-in-Kind Donation"
              value="giftInKind"
              {...methods.register('itemSettings')}
            />
          </div>

          {itemSettingsSelected?.includes('giftInKind') && (
            <>
              <h2>Record Gift-in-Kind</h2>
              <DonationForm
                setRawPhone={handleRawPhone}
                donorType={donorType}
                setItemsDonated={setItemsDonated}
                showSubmitButton={
                  !itemSettingsSelected?.includes('addInventoryItems')
                }
              />
            </>
          )}

          {itemSettingsSelected?.includes('addInventoryItems') && (
            <>
              <h2>Add Item</h2>
              <AddStoreItemSearch
                setAutoFillItems={setAutoFillItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
              {itemsErrorMessage && selectedItems.length === 0 && (
                <Alert variant="danger">{itemsErrorMessage}</Alert>
              )}
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </>
          )}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
        </form>
      </FormProvider>
    </>
  );
}
