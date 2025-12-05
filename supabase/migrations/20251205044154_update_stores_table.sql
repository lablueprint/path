alter table "public"."stores" alter column "store_id" set default extensions.uuid_generate_v4();

alter table "public"."stores" alter column "store_id" set not null;

alter table "public"."stores" alter column "store_id" set data type uuid using "store_id"::uuid;

CREATE UNIQUE INDEX stores_pkey ON public.stores USING btree (store_id);

alter table "public"."stores" add constraint "stores_pkey" PRIMARY KEY using index "stores_pkey";


