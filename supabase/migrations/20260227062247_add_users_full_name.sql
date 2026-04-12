alter table "public"."users" add column "full_name" text generated always as (btrim(((COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)))) stored;


