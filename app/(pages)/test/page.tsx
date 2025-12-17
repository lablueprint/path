'use client';

import ExampleTestComponent from '@/app/components/test/ExampleTestComponent';
import DonationsTestComponent from '@/app/components/test/DonationsTestComponent';
import StoresTestComponent from '@/app/components/test/StoresTestComponent';
import TicketItemsTestComponent from '@/app/components/test/TicketItemsTestComponent';

export default function TestPage() {
  return (
    <div>
      Welcome to PATH! This is a test page.
      <br />
      <ExampleTestComponent />
      <DonationsTestComponent />
      <StoresTestComponent />
      <TicketItemsTestComponent />
    </div>
  );
}
