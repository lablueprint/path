drop policy "public can delete entries in donations" on "public"."donations";

drop policy "public can insert entries in donations" on "public"."donations";

drop policy "public can read entries in donations" on "public"."donations";

drop policy "public can update entries in donations" on "public"."donations";

revoke delete on table "public"."donations" from "anon";

revoke insert on table "public"."donations" from "anon";

revoke references on table "public"."donations" from "anon";

revoke select on table "public"."donations" from "anon";

revoke trigger on table "public"."donations" from "anon";

revoke truncate on table "public"."donations" from "anon";

revoke update on table "public"."donations" from "anon";

revoke delete on table "public"."donations" from "authenticated";

revoke insert on table "public"."donations" from "authenticated";

revoke references on table "public"."donations" from "authenticated";

revoke select on table "public"."donations" from "authenticated";

revoke trigger on table "public"."donations" from "authenticated";

revoke truncate on table "public"."donations" from "authenticated";

revoke update on table "public"."donations" from "authenticated";

revoke delete on table "public"."donations" from "service_role";

revoke insert on table "public"."donations" from "service_role";

revoke references on table "public"."donations" from "service_role";

revoke select on table "public"."donations" from "service_role";

revoke trigger on table "public"."donations" from "service_role";

revoke truncate on table "public"."donations" from "service_role";

revoke update on table "public"."donations" from "service_role";

alter table "public"."donations" drop constraint "donations_pkey";

drop index if exists "public"."donations_pkey";

drop table "public"."donations";


