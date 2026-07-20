drop policy "public can insert entries in example" on "public"."example";

drop policy "public can read example" on "public"."example";

revoke delete on table "public"."example" from "anon";

revoke insert on table "public"."example" from "anon";

revoke references on table "public"."example" from "anon";

revoke select on table "public"."example" from "anon";

revoke trigger on table "public"."example" from "anon";

revoke truncate on table "public"."example" from "anon";

revoke update on table "public"."example" from "anon";

revoke delete on table "public"."example" from "authenticated";

revoke insert on table "public"."example" from "authenticated";

revoke references on table "public"."example" from "authenticated";

revoke select on table "public"."example" from "authenticated";

revoke trigger on table "public"."example" from "authenticated";

revoke truncate on table "public"."example" from "authenticated";

revoke update on table "public"."example" from "authenticated";

revoke delete on table "public"."example" from "service_role";

revoke insert on table "public"."example" from "service_role";

revoke references on table "public"."example" from "service_role";

revoke select on table "public"."example" from "service_role";

revoke trigger on table "public"."example" from "service_role";

revoke truncate on table "public"."example" from "service_role";

revoke update on table "public"."example" from "service_role";

drop table "public"."example";


