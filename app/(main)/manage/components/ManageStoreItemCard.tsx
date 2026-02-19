export default function ManageStoreItemCard ({ item, storeId, }: { 
    item: any;
    storeId: string;
}) {
    //reformat item's info prop
    const itemInfo = {
        storeItemId: item.store_item_id,
        itemName: (item.item_name as any).name ?? "",
        subcategoryName: (item.subcategory_name as any).subcategories.name ?? "",
        categoryName: (item.category_name as any)?.subcategories.categories.name ?? "",
    };

    return (
      <a
        href={`/manage/${storeId}/${itemInfo.storeItemId}`}
        style={{
            textDecoration: 'none',
            color: 'inherit',
        }}
      >
        <div
          style={{
            border: '2px solid black',
            borderRadius: '12px',
            padding: '12px',
            margin: '4px',
          }}
        >
          <h3>Inventory Item Name: {itemInfo.itemName}</h3>
          <h3>Subcategory Name: {itemInfo.subcategoryName}</h3>
          <h3>Category Name: {itemInfo.categoryName}</h3>
        </div>
      </a>
    );
}