
  create table "public"."example" (
    "id" integer not null,
    "name" text
      );


alter table "public"."example" enable row level security;

grant delete on table "public"."example" to "anon";

grant insert on table "public"."example" to "anon";

grant references on table "public"."example" to "anon";

grant select on table "public"."example" to "anon";

grant trigger on table "public"."example" to "anon";

grant truncate on table "public"."example" to "anon";

grant update on table "public"."example" to "anon";

grant delete on table "public"."example" to "authenticated";

grant insert on table "public"."example" to "authenticated";

grant references on table "public"."example" to "authenticated";

grant select on table "public"."example" to "authenticated";

grant trigger on table "public"."example" to "authenticated";

grant truncate on table "public"."example" to "authenticated";

grant update on table "public"."example" to "authenticated";

grant delete on table "public"."example" to "service_role";

grant insert on table "public"."example" to "service_role";

grant references on table "public"."example" to "service_role";

grant select on table "public"."example" to "service_role";

grant trigger on table "public"."example" to "service_role";

grant truncate on table "public"."example" to "service_role";

grant update on table "public"."example" to "service_role";


  create policy "public can read example"
  on "public"."example"
  as permissive
  for select
  to anon
using (true);



