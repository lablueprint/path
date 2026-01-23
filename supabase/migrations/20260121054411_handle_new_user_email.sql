set check_function_bodies = off;

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
    where user_id = new.user_id;
	return new;
end;
$function$
;

CREATE TRIGGER auth_user_email_update AFTER UPDATE OF email ON auth.users FOR EACH ROW EXECUTE FUNCTION private.handle_user_email_update();


