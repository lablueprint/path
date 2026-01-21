export default function RequestStoreItemCard({
  name,
  subcategoryName,
  categoryName,
}: {
  name: string | undefined;
  subcategoryName: string | undefined;
  categoryName: string | undefined;
}) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        width: '250px',
        cursor: 'pointer',
      }}
    >
      <h3>{name}</h3>
      <p>Category: {categoryName}</p>
      <p>Subcategory: {subcategoryName}</p>
    </div>
  );
}