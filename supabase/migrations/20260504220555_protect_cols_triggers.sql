set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.protect_categories_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.category_id := old.category_id;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_donations_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.donation_id := old.donation_id; 
    new.date_submitted := old.date_submitted;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_inventory_items_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.inventory_item_id := old.inventory_item_id; 
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_store_items_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.store_item_id := old.store_item_id;
    new.store_id := old.store_id;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_stores_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.store_id := old.store_id;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_subcategories_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.subcategory_id := old.subcategory_id;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_ticket_items_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.ticket_item_id := old.ticket_item_id;
    new.ticket_id := old.ticket_id; 
    new.store_item_id := old.store_item_id;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_tickets_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.ticket_id := old.ticket_id;
    new.store_id := old.store_id;
    new.date_submitted := old.date_submitted;

    -- old.status is "fulfilled"
    if old.status = 'fulfilled' then
        new.status := old.status;
    -- can_manage_store returns false and old.status is "requested"
    elsif not private.can_manage_store(old.store_id) and old.status = 'requested' then
        new.status := old.status;
    -- can_manage_store returns true, old.status is "requested", and new.status is "fulfilled"
    elsif private.can_manage_store(old.store_id) and old.status = 'requested' and new.status = 'fulfilled' then
        new.status := old.status;
    end if;

    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_user_roles_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.user_id := old.user_id;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.protect_users_cols()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    new.user_id := old.user_id;
    if auth.role() = 'authenticated' then
        new.email := old.email;
    end if; 

    return new;
end;
$function$
;

CREATE TRIGGER protect_categories_trigger BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION private.protect_categories_cols();

CREATE TRIGGER protect_donations_trigger BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION private.protect_donations_cols();

CREATE TRIGGER protect_inventory_items_trigger BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION private.protect_inventory_items_cols();

CREATE TRIGGER protect_store_items_trigger BEFORE UPDATE ON public.store_items FOR EACH ROW EXECUTE FUNCTION private.protect_store_items_cols();

CREATE TRIGGER protect_stores_trigger BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION private.protect_stores_cols();

CREATE TRIGGER protect_subcategories_trigger BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION private.protect_subcategories_cols();

CREATE TRIGGER protect_ticket_items_trigger BEFORE UPDATE ON public.ticket_items FOR EACH ROW EXECUTE FUNCTION private.protect_ticket_items_cols();

CREATE TRIGGER protect_tickets_trigger BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION private.protect_tickets_cols();

CREATE TRIGGER protect_user_roles_trigger BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION private.protect_user_roles_cols();

CREATE TRIGGER protect_users_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION private.protect_users_cols();


