export type InventoryItem = {
  inventory_item_id?: string; // UUID
  store_id: string; // UUID
  subcategory: number;
  item: string;
  description: string;
  photo_url: string;
  quantity_available: number;
  is_hidden: boolean;
};

export type InventoryItemUpdate = Partial<InventoryItem>;

export type InventoryItemInsert = Omit<InventoryItem, 'inventory_item_id'>;
