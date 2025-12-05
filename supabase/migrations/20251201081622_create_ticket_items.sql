
  create table "public"."ticket_items" (
    "ticket_item_id" uuid default extensions.uuid_generate_v4(),
    "ticket_id" uuid not null,
    "inventory_item_id" uuid,
    "free_text_description" text,
    "quantity_requested" integer,
    "is_in_stock_request" boolean not null
      );


alter table "public"."ticket_items" enable row level security;

grant delete on table "public"."ticket_items" to "anon";

grant insert on table "public"."ticket_items" to "anon";

grant references on table "public"."ticket_items" to "anon";

grant select on table "public"."ticket_items" to "anon";

grant trigger on table "public"."ticket_items" to "anon";

grant truncate on table "public"."ticket_items" to "anon";

grant update on table "public"."ticket_items" to "anon";

grant delete on table "public"."ticket_items" to "authenticated";

grant insert on table "public"."ticket_items" to "authenticated";

grant references on table "public"."ticket_items" to "authenticated";

grant select on table "public"."ticket_items" to "authenticated";

grant trigger on table "public"."ticket_items" to "authenticated";

grant truncate on table "public"."ticket_items" to "authenticated";

grant update on table "public"."ticket_items" to "authenticated";

grant delete on table "public"."ticket_items" to "service_role";

grant insert on table "public"."ticket_items" to "service_role";

grant references on table "public"."ticket_items" to "service_role";

grant select on table "public"."ticket_items" to "service_role";

grant trigger on table "public"."ticket_items" to "service_role";

grant truncate on table "public"."ticket_items" to "service_role";

grant update on table "public"."ticket_items" to "service_role";


  create policy "public can delete tiecket_items"
  on "public"."ticket_items"
  as permissive
  for delete
  to anon
using (true);



  create policy "public can insert ticket_items"
  on "public"."ticket_items"
  as permissive
  for insert
  to anon
with check (true);



  create policy "public can read ticket_items"
  on "public"."ticket_items"
  as permissive
  for select
  to anon
using (true);



  create policy "public can update ticket_items"
  on "public"."ticket_items"
  as permissive
  for update
  to anon
using (true)
with check (true);



