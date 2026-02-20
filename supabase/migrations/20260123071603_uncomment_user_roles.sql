alter table "public"."user_roles" add constraint "fk_users" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "fk_users";


