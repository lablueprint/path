export type InventoryItem = {
  inventory_item_id: string; // UUID
  subcategory_id?: number | null;
  name: string;
  description: string;
  photo_url?: string | null;
};

export type InventoryItemInsert = Omit<InventoryItem, 'inventory_item_id'>;
export type InventoryItemUpdate = Partial<InventoryItemInsert>;

export type Category = {
  category_id: number;
  name: string;
};

export type CategoryInsert = Omit<Category, 'category_id'>;
export type CategoryUpdate = Partial<CategoryInsert>;

export type Subcategory = {
  subcategory_id: number;
  category_id: number;
  name: string;
};

export type SubcategoryInsert = Omit<Subcategory, 'subcategory_id'>;
export type SubcategoryUpdate = Partial<SubcategoryInsert>;
