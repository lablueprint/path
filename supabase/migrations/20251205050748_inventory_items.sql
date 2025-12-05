
  create table "public"."inventory_items" (
    "inventory_item_id" uuid not null default extensions.uuid_generate_v4(),
    "store_id" uuid not null,
    "category" character varying(50) not null,
    "subcategory" character varying(50) not null,
    "item" character varying(255) not null,
    "description" text not null,
    "photo_url" text,
    "quantity_available" integer not null,
    "is_hidden" boolean not null
      );


alter table "public"."inventory_items" enable row level security;

CREATE UNIQUE INDEX inventory_items_pkey ON public.inventory_items USING btree (inventory_item_id);

alter table "public"."inventory_items" add constraint "inventory_items_pkey" PRIMARY KEY using index "inventory_items_pkey";

grant delete on table "public"."inventory_items" to "anon";

grant insert on table "public"."inventory_items" to "anon";

grant references on table "public"."inventory_items" to "anon";

grant select on table "public"."inventory_items" to "anon";

grant trigger on table "public"."inventory_items" to "anon";

grant truncate on table "public"."inventory_items" to "anon";

grant update on table "public"."inventory_items" to "anon";

grant delete on table "public"."inventory_items" to "authenticated";

grant insert on table "public"."inventory_items" to "authenticated";

grant references on table "public"."inventory_items" to "authenticated";

grant select on table "public"."inventory_items" to "authenticated";

grant trigger on table "public"."inventory_items" to "authenticated";

grant truncate on table "public"."inventory_items" to "authenticated";

grant update on table "public"."inventory_items" to "authenticated";

grant delete on table "public"."inventory_items" to "service_role";

grant insert on table "public"."inventory_items" to "service_role";

grant references on table "public"."inventory_items" to "service_role";

grant select on table "public"."inventory_items" to "service_role";

grant trigger on table "public"."inventory_items" to "service_role";

grant truncate on table "public"."inventory_items" to "service_role";

grant update on table "public"."inventory_items" to "service_role";


  create policy "public can delete entries in inventory_items"
  on "public"."inventory_items"
  as permissive
  for delete
  to anon
using (true);



  create policy "public can insert entries in inventory_items"
  on "public"."inventory_items"
  as permissive
  for insert
  to anon
with check (true);



  create policy "public can select entries in inventory_items"
  on "public"."inventory_items"
  as permissive
  for select
  to anon
using (true);



  create policy "public can update entries in inventory_items"
  on "public"."inventory_items"
  as permissive
  for update
  to anon
using (true)
with check (true);



