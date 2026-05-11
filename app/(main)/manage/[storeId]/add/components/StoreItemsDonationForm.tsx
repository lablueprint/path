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
      phone: '',
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
  const [autoFillItems, setAutoFillItems] = useState<ItemWithNames[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const setItemsDonated = (value: string) => {
    methods.setValue('items_donated', value, { shouldValidate: true });
  };
  useEffect(() => {
    if (isGiftSelected && isInventorySelected) {
      const itemsString = autoFillItems.map((item) => item.name).join(', ');
      methods.setValue('items_donated', itemsString);
    }
  }, [isGiftSelected, isInventorySelected, autoFillItems, methods]);
  const onSubmit = async (data: CombinedFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const inventoryErrors: string[] = [];
      let donationError = '';

      if (data.itemSettings?.includes('addInventoryItems')) {
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
          donor_phone: data.phone ?? null,
          donor_street_address: data.address ?? null,

          donor_receive_emails: data.receive_emails,
          donor_receive_mailings: data.receive_mailings,
          donor_remain_anonymous: data.remain_anonymous,

          estimated_value: parseFloat(data.estimated_value),
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
          phone: '',
          address: '',
          receiving_site: '',
          receive_emails: false,
          receive_mailings: false,
          remain_anonymous: false,
          estimated_value: '',
          items_donated: '',
          items: [],
        });
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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <label>
            <input
              value="addInventoryItems"
              type="checkbox"
              {...methods.register('itemSettings')}
            />
            Add inventory items to store?
          </label>
          <label>
            <input
              type="checkbox"
              value="giftInKind"
              {...methods.register('itemSettings')}
            />
            Submit gift-in-kind donation?
          </label>
        </div>

        {itemSettingsSelected?.includes('giftInKind') && (
          <DonationForm
            donorType={donorType}
            setItemsDonated={setItemsDonated}
          />
        )}
        {itemSettingsSelected?.includes('addInventoryItems') && (
          <AddStoreItemSearch setAutoFillItems={setAutoFillItems} />
          // add autofillitems connection pass in prop to storeitemsform
        )}
        {(itemSettingsSelected?.includes('giftInKind') ||
          itemSettingsSelected?.includes('addInventoryItems')) && (
          <>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            {successMessage && <p role="status">{successMessage}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </>
        )}
      </form>
    </FormProvider>
  );
}
