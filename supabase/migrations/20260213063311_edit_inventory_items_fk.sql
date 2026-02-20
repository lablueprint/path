alter table "public"."inventory_items" add constraint "fk_subcategories" FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(subcategory_id) ON UPDATE CASCADE not valid;

alter table "public"."inventory_items" validate constraint "fk_subcategories";


