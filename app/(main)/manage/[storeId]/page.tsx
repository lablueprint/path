import Link from 'next/link';
export default async function ManageStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  return (
    <div>
      <button>
        <Link href={`./${storeId}/add`}>Add Inventory</Link>
      </button>
    </div>
  );
}
