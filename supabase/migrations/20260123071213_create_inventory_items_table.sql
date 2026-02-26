alter table "public"."inventory_items" add constraint "fk_subcategories" FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(subcategory_id) ON UPDATE CASCADE not valid;

alter table "public"."inventory_items" validate constraint "fk_subcategories";

alter table "public"."ticket_items" add constraint "fk_store_items" FOREIGN KEY (store_item_id) REFERENCES public.store_items(store_item_id) ON UPDATE CASCADE not valid;

alter table "public"."ticket_items" validate constraint "fk_store_items";


