export type InventoryItem = {
  inventory_item_id: string; // UUID
  subcategory_id?: number | null;
  name: string;
  description: string;
  photo_url?: string | null;
};

export type InventoryItemInsert = Omit<InventoryItem, 'inventory_item_id'>;

export type InventoryItemUpdate = Partial<InventoryItemInsert>;

