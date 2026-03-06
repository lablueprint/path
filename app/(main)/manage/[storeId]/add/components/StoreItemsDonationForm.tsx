'use client';
import { useEffect, useState } from 'react';
import { Store } from '@/app/types/store';
import { User } from '@/app/types/user';
import { useForm, FormProvider } from 'react-hook-form';
import DonationForm from './DonationForm';
import StoreItemsForm from './StoreItemsForm';
import { DonationInsert } from '@/app/types/donation';
import { StoreInsert } from '@/app/types/store';
import { createDonation } from '@/app/actions/donation';
import { addUpdateStoreItemQuantity } from '@/app/actions/store';

export type CombinedFormData = {
  itemSettings?: string[];
  //Donation Form
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
  };
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
    },
  });

  const itemSettingsSelected = methods.watch('itemSettings') || [];
  const [sharedItems, setSharedItems] = useState({}); //sharedItems from donation form shared with store items form
  const [autoFillItems, setAutoFillItems] = useState({});
  useEffect(() => {
    if (
      itemSettingsSelected?.includes('giftInKind') &&
      itemSettingsSelected?.includes('addInventoryItems')
    ) {
      setAutoFillItems(sharedItems);
    }
  }, [itemSettingsSelected, sharedItems]);

  const onSubmit = async (data: CombinedFormData) => {
    try {
      if (data.itemSettings?.includes('addInventoryItems')) {
        for (const item of data.items) {
          await addUpdateStoreItemQuantity(
            item.inventory_item_id,
            item.quantity,
            store.store_id,
          );
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
        const donationResult = await createDonation(donation);
      }
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
        items: {
          inventory_item_id: '',
          quantity: 0,
        },
      });
      methods.clearErrors();
    } catch (error) {
      console.error('Failed to process form:', error);
    }
  };
  return (
    <>
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
              setItemsDonated={setSharedItems}
              donorType={methods.watch('donor_type')}
            />
          )}
          {itemSettingsSelected?.includes('addInventoryItems') && (
            <StoreItemsForm autoFillItems={autoFillItems} />
            // add autofillitems connection pass in prop to storeitemsform
          )}
          {(itemSettingsSelected?.includes('giftInKind') ||
            itemSettingsSelected?.includes('addInventoryItems')) && (
            <button
              type="submit"
              style={{
                marginTop: '20px',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              Submit
            </button>
          )}
        </form>
      </FormProvider>
      {methods.formState.isSubmitSuccessful && (
        <div
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Form submitted successfully! Thank you for your donation.
        </div>
      )}
    </>
  );
}
