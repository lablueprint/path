
  create table "public"."store_admins" (
    "store_admin_id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "store_id" uuid not null
      );


alter table "public"."store_admins" enable row level security;


  create table "public"."store_items" (
    "store_item_id" uuid not null default extensions.uuid_generate_v4(),
    "inventory_item_id" uuid not null,
    "store_id" uuid not null,
    "quantity_available" integer not null,
    "is_hidden" boolean not null
      );


alter table "public"."store_items" enable row level security;

alter table "public"."inventory_items" drop column "is_hidden";

alter table "public"."inventory_items" drop column "item";

alter table "public"."inventory_items" drop column "quantity_available";

alter table "public"."inventory_items" drop column "store_id";

alter table "public"."inventory_items" add column "name" character varying(255) not null;

alter table "public"."inventory_items" alter column "subcategory_id" drop not null;

CREATE UNIQUE INDEX store_admins_pkey ON public.store_admins USING btree (store_admin_id);

CREATE UNIQUE INDEX store_items_pkey ON public.store_items USING btree (store_item_id);

alter table "public"."store_admins" add constraint "store_admins_pkey" PRIMARY KEY using index "store_admins_pkey";

alter table "public"."store_items" add constraint "store_items_pkey" PRIMARY KEY using index "store_items_pkey";

alter table "public"."store_admins" add constraint "fk_stores" FOREIGN KEY (store_id) REFERENCES public.stores(store_id) ON DELETE CASCADE not valid;

alter table "public"."store_admins" validate constraint "fk_stores";

alter table "public"."store_admins" add constraint "fk_users" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."store_admins" validate constraint "fk_users";

alter table "public"."store_items" add constraint "fk_inventory_items" FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(inventory_item_id) ON DELETE CASCADE not valid;

alter table "public"."store_items" validate constraint "fk_inventory_items";

alter table "public"."store_items" add constraint "fk_stores" FOREIGN KEY (store_id) REFERENCES public.stores(store_id) ON DELETE CASCADE not valid;

alter table "public"."store_items" validate constraint "fk_stores";

grant delete on table "public"."store_admins" to "anon";

grant insert on table "public"."store_admins" to "anon";

grant references on table "public"."store_admins" to "anon";

grant select on table "public"."store_admins" to "anon";

grant trigger on table "public"."store_admins" to "anon";

grant truncate on table "public"."store_admins" to "anon";

grant update on table "public"."store_admins" to "anon";

grant delete on table "public"."store_admins" to "authenticated";

grant insert on table "public"."store_admins" to "authenticated";

grant references on table "public"."store_admins" to "authenticated";

grant select on table "public"."store_admins" to "authenticated";

grant trigger on table "public"."store_admins" to "authenticated";

grant truncate on table "public"."store_admins" to "authenticated";

grant update on table "public"."store_admins" to "authenticated";

grant delete on table "public"."store_admins" to "service_role";

grant insert on table "public"."store_admins" to "service_role";

grant references on table "public"."store_admins" to "service_role";

grant select on table "public"."store_admins" to "service_role";

grant trigger on table "public"."store_admins" to "service_role";

grant truncate on table "public"."store_admins" to "service_role";

grant update on table "public"."store_admins" to "service_role";

grant delete on table "public"."store_items" to "anon";

grant insert on table "public"."store_items" to "anon";

grant references on table "public"."store_items" to "anon";

grant select on table "public"."store_items" to "anon";

grant trigger on table "public"."store_items" to "anon";

grant truncate on table "public"."store_items" to "anon";

grant update on table "public"."store_items" to "anon";

grant delete on table "public"."store_items" to "authenticated";

grant insert on table "public"."store_items" to "authenticated";

grant references on table "public"."store_items" to "authenticated";

grant select on table "public"."store_items" to "authenticated";

grant trigger on table "public"."store_items" to "authenticated";

grant truncate on table "public"."store_items" to "authenticated";

grant update on table "public"."store_items" to "authenticated";

grant delete on table "public"."store_items" to "service_role";

grant insert on table "public"."store_items" to "service_role";

grant references on table "public"."store_items" to "service_role";

grant select on table "public"."store_items" to "service_role";

grant trigger on table "public"."store_items" to "service_role";

grant truncate on table "public"."store_items" to "service_role";

grant update on table "public"."store_items" to "service_role";


  create policy "all authenticated users can delete"
  on "public"."store_admins"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "all authenticated users can insert"
  on "public"."store_admins"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "all authenticated users can select"
  on "public"."store_admins"
  as permissive
  for select
  to authenticated
using (true);



  create policy "all authenticated users can update"
  on "public"."store_admins"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "all authenticated users can delete"
  on "public"."store_items"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "all authenticated users can insert"
  on "public"."store_items"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "all authenticated users can select"
  on "public"."store_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "all authenticated users can update"
  on "public"."store_items"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



