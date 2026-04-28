import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import LightweightDonationForm from '@/app/(main)/home/donate/components/LightweightDonationForm';

export default function DonationPage() {
  return (
    <div>
      <Breadcrumbs
        labelMap={{
          home: 'Home',
          donate: 'Donate',
        }}
      />
      <LightweightDonationForm />
    </div>
  );
}
