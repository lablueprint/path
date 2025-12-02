
  create table "public"."tickets" (
    "ticket_id" uuid not null default gen_random_uuid(),
    "requestor_user_id" uuid,
    "store_id" uuid,
    "status" character varying(50),
    "date_submitted" timestamp with time zone default now()
      );


alter table "public"."tickets" enable row level security;

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (ticket_id);

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";


  create policy "public can delete entries in tickets"
  on "public"."tickets"
  as permissive
  for delete
  to anon
using (true);



  create policy "public can insert entries in tickets"
  on "public"."tickets"
  as permissive
  for insert
  to anon
with check (true);



  create policy "public can read entries in tickets"
  on "public"."tickets"
  as permissive
  for select
  to anon
using (true);



  create policy "public can update entries in tickets"
  on "public"."tickets"
  as permissive
  for update
  to anon
using (true)
with check (true);



