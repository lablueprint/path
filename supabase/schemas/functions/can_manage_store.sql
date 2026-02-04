create schema if not exists private;

create or replace function private.can_manage_store (store_to_manage_id uuid) returns boolean language plpgsql security definer
set
  search_path = '' as $$
declare
	-- Declare variables
    is_owner boolean;
    is_superadmin boolean;

begin
    --  Determine if current user is 'superadmin' or 'owner', return true
    select (auth.jwt() ->> 'user_role') = 'owner' into is_owner;
    select (auth.jwt() ->> 'user_role') = 'superadmin' into is_superadmin;

    if is_owner or is_superadmin then
        return true;
    end if;
    
    -- if current user is a store admin return true
    if  exists (
        select 1
        from public.store_admins
        where store_to_manage_id = store_id and auth.uid() = user_id) then 
        return true;
    end if;
    return false;
end;
$$;
