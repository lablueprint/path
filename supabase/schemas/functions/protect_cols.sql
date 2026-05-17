create schema if not exists private;

-- users
create or replace function private.protect_users_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.user_id := old.user_id;
    if auth.role() = 'authenticated' then
        new.email := old.email;
    end if; 

    return new;
end;
$$;

drop trigger if exists protect_users_trigger on users;

create trigger protect_users_trigger before
update on users for each row
execute function private.protect_users_cols ();

-- user_roles
create or replace function private.protect_user_roles_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.user_id := old.user_id;
    return new;
end;
$$;

drop trigger if exists protect_user_roles_trigger on user_roles;

create trigger protect_user_roles_trigger before
update on user_roles for each row
execute function private.protect_user_roles_cols ();

-- stores
create or replace function private.protect_stores_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.store_id := old.store_id;
    return new;
end;
$$;

drop trigger if exists protect_stores_trigger on stores;

create trigger protect_stores_trigger before
update on stores for each row
execute function private.protect_stores_cols ();

-- store_items
create or replace function private.protect_store_items_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.store_item_id := old.store_item_id;
    new.store_id := old.store_id;
    return new;
end;
$$;

drop trigger if exists protect_store_items_trigger on store_items;

create trigger protect_store_items_trigger before
update on store_items for each row
execute function private.protect_store_items_cols ();

-- inventory_items
create or replace function private.protect_inventory_items_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.inventory_item_id := old.inventory_item_id; 
    return new;
end;
$$;

drop trigger if exists protect_inventory_items_trigger on inventory_items;

create trigger protect_inventory_items_trigger before
update on inventory_items for each row
execute function private.protect_inventory_items_cols ();

-- subcategories
create or replace function private.protect_subcategories_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.subcategory_id := old.subcategory_id;
    return new;
end;
$$;

drop trigger if exists protect_subcategories_trigger on subcategories;

create trigger protect_subcategories_trigger before
update on subcategories for each row
execute function private.protect_subcategories_cols ();

-- categories
create or replace function private.protect_categories_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.category_id := old.category_id;
    return new;
end;
$$;

drop trigger if exists protect_categories_trigger on categories;

create trigger protect_categories_trigger before
update on categories for each row
execute function private.protect_categories_cols ();

-- tickets
create or replace function private.protect_tickets_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
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
$$;

drop trigger if exists protect_tickets_trigger on tickets;

create trigger protect_tickets_trigger before
update on tickets for each row
execute function private.protect_tickets_cols ();

-- ticket_items
create or replace function private.protect_ticket_items_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.ticket_item_id := old.ticket_item_id;
    new.ticket_id := old.ticket_id; 
    new.store_item_id := old.store_item_id;
    return new;
end;
$$;

drop trigger if exists protect_ticket_items_trigger on ticket_items;

create trigger protect_ticket_items_trigger before
update on ticket_items for each row
execute function private.protect_ticket_items_cols ();

-- donations
create or replace function private.protect_donations_cols () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    new.donation_id := old.donation_id; 
    new.date_submitted := old.date_submitted;
    return new;
end;
$$;

drop trigger if exists protect_donations_trigger on donations;

create trigger protect_donations_trigger before
update on donations for each row
execute function private.protect_donations_cols ();
