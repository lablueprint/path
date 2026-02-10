create schema if not exists private;

create or replace function private.handle_user_role_update()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
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
$$;

create trigger "after update user_roles"
after insert on user_roles
for each row
execute procedure private.handle_user_role_update();
