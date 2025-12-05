export type Store = {
  store_id: string;
  name: string;
  street_address: string;
};

export type StoreInsert = Omit<Store, 'store_id'>