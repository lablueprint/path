'use client';

import AuthTestComponent from './components/AuthTestComponent';
import ExampleTestComponent from './components/ExampleTestComponent';
import DonationsTestComponent from './components/DonationsTestComponent';
import StoresTestComponent from './components/StoresTestComponent';
import InventoryItemsTestComponent from './components/InventoryItemsTestComponent';
import TicketsTestComponent from './components/TicketsTestComponent';
import TicketItemsTestComponent from './components/TicketItemsTestComponent';

export default function TestPage() {
  return (
    <div>
      This is a test page.
      <br />
      <AuthTestComponent />
      <ExampleTestComponent />
      <DonationsTestComponent />
      <StoresTestComponent />
      <InventoryItemsTestComponent />
      <TicketsTestComponent />
      <TicketItemsTestComponent />
    </div>
  );
}
