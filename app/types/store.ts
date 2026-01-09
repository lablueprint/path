export type Store = {
  store_id: string;
  name: string;
  street_address: string;
};

export type StoreInsert = Omit<Store, 'store_id'>;

export type StoreUpdate = Partial<StoreInsert>;

export type StoreAdmin = {
  store_admins_id: string;
  user_id: string;
  store_id: string;
};

export type StoreAdminInsert = Omit<StoreAdmin, 'store_admins_id'>;

export type StoreItem = {
  store_item_id: string;
  store_id: string;
  inventory_item_id: string;
  quantity: number;
};

export type StoreItemInsert = Omit<StoreItem, 'store_item_id'>;





