import React from "react";
import DonationForm from "./components/DonationForm";

interface PageProps {
  params: { id: string }; // Next.js dynamic route param
}

export default function AddStoreItemsPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
  
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
        }}
      >

        <div style={{ flex: 1 }}>
          
          <DonationForm />
        </div>
      </div>
    </div>
  );
}
