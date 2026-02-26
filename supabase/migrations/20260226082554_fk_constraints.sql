alter table "public"."categories" drop constraint "uq_name";

alter table "public"."store_items" drop constraint "fk_inventory_items";

alter table "public"."store_items" drop constraint "fk_stores";

alter table "public"."users" drop constraint "fk_auth_users";

drop index if exists "public"."uq_name";

alter table "public"."users" alter column "email" set not null;

alter table "public"."users" alter column "first_name" set not null;

alter table "public"."users" alter column "last_name" set not null;

CREATE UNIQUE INDEX uq_categories_name ON public.categories USING btree (name);

CREATE UNIQUE INDEX uq_inventory_item_id_store_id ON public.store_items USING btree (inventory_item_id, store_id);

CREATE UNIQUE INDEX uq_roles_name ON public.roles USING btree (name);

CREATE UNIQUE INDEX uq_stores_name ON public.stores USING btree (name);

CREATE UNIQUE INDEX uq_subcategory_id_name ON public.inventory_items USING btree (subcategory_id, name);

CREATE UNIQUE INDEX uq_ticket_id_store_item_id ON public.ticket_items USING btree (ticket_id, store_item_id);

CREATE UNIQUE INDEX uq_user_store_id ON public.store_admins USING btree (user_id, store_id);

alter table "public"."categories" add constraint "uq_categories_name" UNIQUE using index "uq_categories_name";

alter table "public"."donations" add constraint "ck_donor_business_contact_name_presence" CHECK ((((donor_is_individual = true) AND (donor_business_contact_name IS NULL)) OR ((donor_is_individual = false) AND (donor_business_contact_name IS NOT NULL)))) not valid;

alter table "public"."donations" validate constraint "ck_donor_business_contact_name_presence";

alter table "public"."donations" add constraint "ck_donor_business_name_presence" CHECK ((((donor_is_individual = true) AND (donor_business_name IS NULL)) OR ((donor_is_individual = false) AND (donor_business_name IS NOT NULL)))) not valid;

alter table "public"."donations" validate constraint "ck_donor_business_name_presence";

alter table "public"."donations" add constraint "ck_donor_individual_name_presence" CHECK ((((donor_is_individual = true) AND (donor_individual_name IS NOT NULL)) OR ((donor_is_individual = false) AND (donor_individual_name IS NULL)))) not valid;

alter table "public"."donations" validate constraint "ck_donor_individual_name_presence";

alter table "public"."donations" add constraint "ck_estimated_value" CHECK ((estimated_value >= (0)::numeric)) not valid;

alter table "public"."donations" validate constraint "ck_estimated_value";

alter table "public"."inventory_items" add constraint "uq_subcategory_id_name" UNIQUE using index "uq_subcategory_id_name";

alter table "public"."roles" add constraint "uq_roles_name" UNIQUE using index "uq_roles_name";

alter table "public"."store_admins" add constraint "uq_user_store_id" UNIQUE using index "uq_user_store_id";

alter table "public"."store_items" add constraint "ck_quantity_available" CHECK ((quantity_available >= 0)) not valid;

alter table "public"."store_items" validate constraint "ck_quantity_available";

alter table "public"."store_items" add constraint "uq_inventory_item_id_store_id" UNIQUE using index "uq_inventory_item_id_store_id";

alter table "public"."stores" add constraint "uq_stores_name" UNIQUE using index "uq_stores_name";

alter table "public"."ticket_items" add constraint "ck_free_text_description_presence" CHECK ((((is_in_stock_request = true) AND (free_text_description IS NULL)) OR ((is_in_stock_request = false) AND (free_text_description IS NOT NULL)))) not valid;

alter table "public"."ticket_items" validate constraint "ck_free_text_description_presence";

alter table "public"."ticket_items" add constraint "ck_quantity_requested" CHECK ((quantity_requested >= 0)) not valid;

alter table "public"."ticket_items" validate constraint "ck_quantity_requested";

alter table "public"."ticket_items" add constraint "ck_quantity_requested_presence" CHECK ((((is_in_stock_request = true) AND (quantity_requested IS NOT NULL)) OR ((is_in_stock_request = false) AND (quantity_requested IS NULL)))) not valid;

alter table "public"."ticket_items" validate constraint "ck_quantity_requested_presence";

alter table "public"."ticket_items" add constraint "ck_store_item_id_presence" CHECK ((((is_in_stock_request = true) AND (store_item_id IS NOT NULL)) OR ((is_in_stock_request = false) AND (store_item_id IS NULL)))) not valid;

alter table "public"."ticket_items" validate constraint "ck_store_item_id_presence";

alter table "public"."ticket_items" add constraint "uq_ticket_id_store_item_id" UNIQUE using index "uq_ticket_id_store_item_id";

alter table "public"."tickets" add constraint "fk_users" FOREIGN KEY (requestor_user_id) REFERENCES public.users(user_id) not valid;

alter table "public"."tickets" validate constraint "fk_users";

alter table "public"."store_items" add constraint "fk_inventory_items" FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(inventory_item_id) ON UPDATE CASCADE not valid;

alter table "public"."store_items" validate constraint "fk_inventory_items";

alter table "public"."store_items" add constraint "fk_stores" FOREIGN KEY (store_id) REFERENCES public.stores(store_id) not valid;

alter table "public"."store_items" validate constraint "fk_stores";

alter table "public"."users" add constraint "fk_auth_users" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "fk_auth_users";


