// Create a type InventoryItem corresponding the table. 
// For the uuid PostgreSQL data type, you can use a TypeScrypt string.
import { UUID } from "crypto"

export type InventoryType = {
  inventory_item_id?: string; // UUID
  store_id: string; // UUID
  subcategory: number;
  item: string;
  description: string;
  photo_url: string;
  quantity_available: number;
  is_hidden: boolean;
};

export type InventoryItemUpdate = Partial<InventoryType>;