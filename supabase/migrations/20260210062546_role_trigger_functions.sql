set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.handle_new_store_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    current_role_name text;
	-- Declare variables
begin
	-- Logic
    select r.name into current_role_name
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = new.user_id;

    if current_role_name in ('default', 'requestor') then
        update public.user_roles
        set role_id = 3
        where user_id = new.user_id;
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_user_role_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    updated_role_name text;
	-- Declare variables
begin
	-- Logic
    select r.name into updated_role_name
    from public.roles r
    where r.role_id = new.role_id;

    if updated_role_name in ('default', 'requestor') then
        delete from public.store_admins
        where user_id = new.user_id;
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin

  insert into public.users (user_id, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );

  insert into public.user_role(user_id, role_id)
  values (
    new.id,
    case
      when right(new.email, 9) = 'epath.org' then 2
      else 1
    end
  );


  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_user_email_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
begin
  update public.users
  set email = new.email
  where user_id = new.id;
	return new;
end;
$function$
;

CREATE TRIGGER "after create store_admins" AFTER INSERT ON public.store_admins FOR EACH ROW EXECUTE FUNCTION private.handle_new_store_admin();

CREATE TRIGGER "after update user_roles" AFTER INSERT ON public.user_roles FOR EACH ROW EXECUTE FUNCTION private.handle_user_role_update();


