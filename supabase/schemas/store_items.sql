create table store_items
(
    store_item_id uuid default uuid_generate_v4() primary key,
    inventory_item_id uuid,
    store_id uuid not null,
    quantity_available INT not null,
    is_hidden boolean not null,

    constraint fk_inventory_items
    foreign key (inventory_items)
    references inventory_itmes(inventory_items_id)
    on delete cascade

     constraint fk_stores
    foreign key (stores)
    references stores(store_id)
    on delete cascade

)