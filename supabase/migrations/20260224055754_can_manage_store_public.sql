set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.can_manage_store(store_to_manage_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select private.can_manage_store(store_to_manage_id);
$function$
;


