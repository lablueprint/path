import Link from 'next/link';

type InventoryItemProps = {
  inventory_item_id: string;
  photo_url: string;
  item: string;
  subcategory: string;
  category: string;
};

export default async function InventoryItemCard({
  inventory_item_id,
  photo_url,
  item,
  subcategory,
  category,
}: InventoryItemProps) {
  return (
    <Link href={`/manage/inventory/${inventory_item_id}`}>
      <div>
        <h3>{item}</h3>
        <p>Category: {category}</p>
        <p>Subcategory: {subcategory}</p>
      </div>
    </Link>
  );
}
