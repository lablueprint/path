export type InventoryItem = {
  inventory_item_id: string; // UUID
  subcategory_id?: string | null;
  name: string;
  description: string;
  photo_url?: string | null;
};

export type InventoryItemInsert = Omit<InventoryItem, 'inventory_item_id'>;
export type InventoryItemUpdate = Partial<InventoryItemInsert>;

export type Category = {
  category_id: string;
  name: string;
  subcategories: {
    subcategory_id: string;
    name: string;
  }[];
};

export type CategoryInsert = {
  name: string;
};
export type CategoryUpdate = Partial<CategoryInsert>;

export type Subcategory = {
  subcategory_id: string;
  category_id: string;
  name: string;
};

export type SubcategoryInsert = Omit<Subcategory, 'subcategory_id'>;
export type SubcategoryUpdate = Partial<SubcategoryInsert>;
