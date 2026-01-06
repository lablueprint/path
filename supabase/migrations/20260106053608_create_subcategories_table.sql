create sequence "public"."categories_category_id_seq";

create sequence "public"."subcategories_subcategory_id_seq";


  create table "public"."categories" (
    "category_id" integer not null default nextval('public.categories_category_id_seq'::regclass),
    "name" text not null
      );



  create table "public"."subcategories" (
    "subcategory_id" integer not null default nextval('public.subcategories_subcategory_id_seq'::regclass),
    "category_id" integer not null,
    "name" text not null
      );


alter table "public"."subcategories" enable row level security;

alter sequence "public"."categories_category_id_seq" owned by "public"."categories"."category_id";

alter sequence "public"."subcategories_subcategory_id_seq" owned by "public"."subcategories"."subcategory_id";

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (category_id);

CREATE UNIQUE INDEX subcategories_pkey ON public.subcategories USING btree (subcategory_id);

CREATE UNIQUE INDEX uq_category_id_name ON public.subcategories USING btree (category_id, name);

CREATE UNIQUE INDEX uq_name ON public.categories USING btree (name);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."subcategories" add constraint "subcategories_pkey" PRIMARY KEY using index "subcategories_pkey";

alter table "public"."categories" add constraint "uq_name" UNIQUE using index "uq_name";

alter table "public"."subcategories" add constraint "fk_categories" FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subcategories" validate constraint "fk_categories";

alter table "public"."subcategories" add constraint "uq_category_id_name" UNIQUE using index "uq_category_id_name";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."subcategories" to "anon";

grant insert on table "public"."subcategories" to "anon";

grant references on table "public"."subcategories" to "anon";

grant select on table "public"."subcategories" to "anon";

grant trigger on table "public"."subcategories" to "anon";

grant truncate on table "public"."subcategories" to "anon";

grant update on table "public"."subcategories" to "anon";

grant delete on table "public"."subcategories" to "authenticated";

grant insert on table "public"."subcategories" to "authenticated";

grant references on table "public"."subcategories" to "authenticated";

grant select on table "public"."subcategories" to "authenticated";

grant trigger on table "public"."subcategories" to "authenticated";

grant truncate on table "public"."subcategories" to "authenticated";

grant update on table "public"."subcategories" to "authenticated";

grant delete on table "public"."subcategories" to "service_role";

grant insert on table "public"."subcategories" to "service_role";

grant references on table "public"."subcategories" to "service_role";

grant select on table "public"."subcategories" to "service_role";

grant trigger on table "public"."subcategories" to "service_role";

grant truncate on table "public"."subcategories" to "service_role";

grant update on table "public"."subcategories" to "service_role";


  create policy "auth can delete subcategories if >= superadmin"
  on "public"."subcategories"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "auth can insert subcategories if >= admin"
  on "public"."subcategories"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can read subcategories if >= requestor"
  on "public"."subcategories"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can update subcategories if >= superadmin"
  on "public"."subcategories"
  as permissive
  for update
  to authenticated
with check (((( SELECT auth.jwt() AS jwt) ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



