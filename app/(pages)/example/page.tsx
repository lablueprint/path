"use client";
import TestInventoryItemPage from "../test-inventory-items/page";
import TestDonationsPage from "../test-donations/page";

export default function Example() {
  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <TestDonationsPage />
      <TestInventoryItemPage />
    </div>
  );
}