alter table "public"."donations" alter column "donor_email" set not null;

alter table "public"."inventory_items" drop column "subcategory";

alter table "public"."inventory_items" add column "subcategory_id" integer not null;

alter table "public"."stores" alter column "name" set not null;

alter table "public"."stores" alter column "street_address" set not null;


