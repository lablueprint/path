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
  return (
    <Link href={`./${id}`}>
      <div
        style={{
          border: "1px solid black",
          backgroundColor: "gray",
          padding: "32px",
          marginBottom: "16px",
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
