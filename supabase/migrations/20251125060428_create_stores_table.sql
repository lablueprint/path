
  create table "public"."stores" (
    "store_id" text,
    "name" text,
    "street_address" text
      );


alter table "public"."stores" enable row level security;

grant delete on table "public"."stores" to "anon";

grant insert on table "public"."stores" to "anon";

grant references on table "public"."stores" to "anon";

grant select on table "public"."stores" to "anon";

grant trigger on table "public"."stores" to "anon";

grant truncate on table "public"."stores" to "anon";

grant update on table "public"."stores" to "anon";

grant delete on table "public"."stores" to "authenticated";

grant insert on table "public"."stores" to "authenticated";

grant references on table "public"."stores" to "authenticated";

grant select on table "public"."stores" to "authenticated";

grant trigger on table "public"."stores" to "authenticated";

grant truncate on table "public"."stores" to "authenticated";

grant update on table "public"."stores" to "authenticated";

grant delete on table "public"."stores" to "service_role";

grant insert on table "public"."stores" to "service_role";

grant references on table "public"."stores" to "service_role";

grant select on table "public"."stores" to "service_role";

grant trigger on table "public"."stores" to "service_role";

grant truncate on table "public"."stores" to "service_role";

grant update on table "public"."stores" to "service_role";


  create policy "public can delete entries in stores"
  on "public"."stores"
  as permissive
  for delete
  to anon
using (true);



  create policy "public can insert entries in stores"
  on "public"."stores"
  as permissive
  for insert
  to anon
with check (true);



  create policy "public can read entries in stores"
  on "public"."stores"
  as permissive
  for select
  to anon
using (true);



  create policy "public can update entries in stores"
  on "public"."stores"
  as permissive
  for update
  to anon
using (true)
with check (true);



