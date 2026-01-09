
  create table "public"."user_roles" (
    "user_role_id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid not null,
    "role_id" integer not null
      );


alter table "public"."user_roles" enable row level security;

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_role_id);

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."user_roles" add constraint "fk_roles" FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "fk_roles";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "Authenticated user can insert entries if role satisfies rules"
  on "public"."user_roles"
  as permissive
  for insert
  to authenticated
with check (private.can_assign_role(role_id));



  create policy "Authenticated user delete entries if role satisfies rules"
  on "public"."user_roles"
  as permissive
  for delete
  to public
using (private.can_assign_role(role_id));



  create policy "No user can update entries"
  on "public"."user_roles"
  as permissive
  for update
  to public
using (false)
with check (false);



  create policy "all authenticated users can read all entries"
  on "public"."user_roles"
  as permissive
  for select
  to authenticated
using (true);



