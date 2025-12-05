
  create table "public"."donations" (
    "donation_id" uuid not null default extensions.uuid_generate_v4(),
    "receiver_user_id" uuid not null,
    "store_id" uuid,
    "date_submitted" timestamp with time zone default CURRENT_TIMESTAMP,
    "donor_is_individual" boolean not null,
    "donor_individual_name" text,
    "donor_business_name" text,
    "donor_business_contact_name" text,
    "donor_email" character varying(255),
    "donor_phone" character varying(20),
    "donor_street_address" text,
    "donor_receive_mailings" boolean not null,
    "donor_receive_emails" boolean not null,
    "donor_remain_anonymous" boolean not null,
    "estimated_value" numeric not null,
    "items_donated" text not null
      );


alter table "public"."donations" enable row level security;

CREATE UNIQUE INDEX donations_pkey ON public.donations USING btree (donation_id);

alter table "public"."donations" add constraint "donations_pkey" PRIMARY KEY using index "donations_pkey";

grant delete on table "public"."donations" to "anon";

grant insert on table "public"."donations" to "anon";

grant references on table "public"."donations" to "anon";

grant select on table "public"."donations" to "anon";

grant trigger on table "public"."donations" to "anon";

grant truncate on table "public"."donations" to "anon";

grant update on table "public"."donations" to "anon";

grant delete on table "public"."donations" to "authenticated";

grant insert on table "public"."donations" to "authenticated";

grant references on table "public"."donations" to "authenticated";

grant select on table "public"."donations" to "authenticated";

grant trigger on table "public"."donations" to "authenticated";

grant truncate on table "public"."donations" to "authenticated";

grant update on table "public"."donations" to "authenticated";

grant delete on table "public"."donations" to "service_role";

grant insert on table "public"."donations" to "service_role";

grant references on table "public"."donations" to "service_role";

grant select on table "public"."donations" to "service_role";

grant trigger on table "public"."donations" to "service_role";

grant truncate on table "public"."donations" to "service_role";

grant update on table "public"."donations" to "service_role";


  create policy "public can delete entries in donations"
  on "public"."donations"
  as permissive
  for delete
  to anon
using (true);



  create policy "public can insert entries in donations"
  on "public"."donations"
  as permissive
  for insert
  to anon
with check (true);



  create policy "public can read entries in donations"
  on "public"."donations"
  as permissive
  for select
  to anon
using (true);



  create policy "public can update entries in donations"
  on "public"."donations"
  as permissive
  for update
  to anon
with check (true);



