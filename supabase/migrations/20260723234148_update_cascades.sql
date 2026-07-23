alter table "public"."store_items" drop constraint "fk_inventory_items";

alter table "public"."store_items" drop constraint "fk_stores";

alter table "public"."subcategories" drop constraint "fk_categories";

alter table "public"."ticket_items" drop constraint "fk_store_items";

alter table "public"."tickets" drop constraint "fk_dest_stores";

alter table "public"."tickets" drop constraint "fk_stores";

alter table "public"."tickets" drop constraint "fk_users";

alter table "public"."store_items" add constraint "fk_inventory_items" FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(inventory_item_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."store_items" validate constraint "fk_inventory_items";

alter table "public"."store_items" add constraint "fk_stores" FOREIGN KEY (store_id) REFERENCES public.stores(store_id) ON DELETE CASCADE not valid;

alter table "public"."store_items" validate constraint "fk_stores";

alter table "public"."subcategories" add constraint "fk_categories" FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON UPDATE CASCADE not valid;

alter table "public"."subcategories" validate constraint "fk_categories";

alter table "public"."ticket_items" add constraint "fk_store_items" FOREIGN KEY (store_item_id) REFERENCES public.store_items(store_item_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_items" validate constraint "fk_store_items";

alter table "public"."tickets" add constraint "fk_dest_stores" FOREIGN KEY (dest_store_id) REFERENCES public.stores(store_id) ON DELETE SET NULL not valid;

alter table "public"."tickets" validate constraint "fk_dest_stores";

alter table "public"."tickets" add constraint "fk_stores" FOREIGN KEY (store_id) REFERENCES public.stores(store_id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "fk_stores";

alter table "public"."tickets" add constraint "fk_users" FOREIGN KEY (requestor_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "fk_users";


