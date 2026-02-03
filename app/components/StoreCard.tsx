"use client";

import { usePathname } from "next/navigation";
import Link from "next/link"

type StoreCardProps = {
  id: string
  name: string
  streetAddress: string
}

export default function StoreCard({
  id,
  name,
  streetAddress,
}: StoreCardProps) {

  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${id}`}>
      <div
         style={{
          borderRadius: "12px",
          border: "1px solid #ddd",
          backgroundColor: "#fff",
          padding: "20px",
          marginBottom: "16px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {name}
        </h2>
        <p style={{ fontSize: "18px" }}>
          {streetAddress}
        </p>
      </div>
    </Link>
  )
}
