create schema if not exists private;

create or replace function private.handle_new_store_admin()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
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
$$;

create trigger "after create store_admins"
after insert on store_admins
for each row
execute procedure private.handle_new_store_admin();
