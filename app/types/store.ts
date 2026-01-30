export type Store = {
  store_id: string;
  name: string;
  street_address: string;
};

export type StoreInsert = Omit<Store, 'store_id'>;

export type StoreUpdate = Partial<StoreInsert>;

export type StoreAdmin = {
  store_admin_id: string;
  user_id: string;
  store_id: string;
};

export type StoreAdminInsert = Omit<StoreAdmin, 'store_admin_id'>;

export type StoreItem = {
  store_item_id: string;
  inventory_item_id: string;
  store_id: string;
  quantity_available: number;
  is_hidden: boolean;
};

export type StoreItemInsert = Omit<StoreItem, 'store_item_id'>;
