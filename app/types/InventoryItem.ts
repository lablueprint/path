// Create a type InventoryItem corresponding the table. 
// For the uuid PostgreSQL data type, you can use a TypeScrypt string.
import { UUID } from "crypto"

export type InventoryType = {
  inventory_item_id: string; // UUID
  name: Text;
  category: string;
  subcategory: string;
  item: string;
  description: Text;
  photo_url: Text;
  quantity_available: number;
  is_hidden: boolean;
};