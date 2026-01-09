drop policy "auth can delete user_roles if can_assign_role" on "public"."user_roles";

drop policy "auth can insert user_roles if can_assign_role" on "public"."user_roles";

drop policy "auth can read user_roles" on "public"."user_roles";

drop policy "no user can update user_roles" on "public"."user_roles";

alter table "public"."user_roles" drop constraint "uq_user_id_role_id";

drop index if exists "public"."uq_user_id_role_id";

CREATE UNIQUE INDEX uq_user_id ON public.user_roles USING btree (user_id);

alter table "public"."user_roles" add constraint "uq_user_id" UNIQUE using index "uq_user_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.can_assign_role(new_role_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  is_owner boolean;
  is_superadmin boolean;
  is_admin boolean;
  new_role_name text;
begin
	-- Retrieve the name of the role being assigned
  select name
  from public.roles
  where role_id = new_role_id
  into new_role_name;
  
  -- Determine if the current user has the 'owner' role
  select (auth.jwt() ->> 'user_role') = 'owner' into is_owner;

  -- If the current user is an owner and the new role is one of the allowed roles, return true
  if is_owner and new_role_name in ('superadmin', 'admin', 'requestor') then
    return true;
  end if;

  -- Determine if the current user has the 'superadmin' role
  select (auth.jwt() ->> 'user_role') = 'superadmin' into is_superadmin;

  -- If the current user is a superadmin and the new role is one of the allowed roles, return true
  if is_superadmin and new_role_name in ('admin', 'requestor') then
    return true;
  end if;

   -- Determine if the current user has the 'admin' role
  select (auth.jwt() ->> 'user_role') = 'admin' into is_admin;

  -- If the current user is an admin and the new role is one of the allowed roles, return true
  if is_admin and new_role_name in ('requestor') then
    return true;
  end if;

  return false;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
  declare
    claims jsonb;
    user_role text;
  begin
    select r.name into user_role
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = (event ->> 'user_id')::uuid
    limit 1;

    claims := event -> 'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null'::jsonb);
    end if;

    -- Update the claims object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$function$
;


  create policy "auth can read user_roles if >= requestor"
  on "public"."user_roles"
  as permissive
  for select
  to authenticated
using ((( SELECT (auth.jwt() ->> 'user_role'::text)) = ANY (ARRAY['requestor'::text, 'admin'::text, 'superadmin'::text, 'owner'::text])));



  create policy "auth can update user_roles if can_assign_role"
  on "public"."user_roles"
  as permissive
  for update
  to authenticated
using (private.can_assign_role(role_id))
with check (private.can_assign_role(role_id));



  create policy "no user can delete user_roles"
  on "public"."user_roles"
  as permissive
  for delete
  to public
using (false);



  create policy "no user can insert user_roles"
  on "public"."user_roles"
  as permissive
  for insert
  to public
with check (false);



