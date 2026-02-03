create schema if not exists private;

create or replace function private.handle_user_email_update () returns trigger language plpgsql security definer
set
  search_path = '' as $$
declare
begin
  update public.users
  set email = new.email
  where user_id = new.id;
	return new;
end;
$$;

create trigger auth_user_email_update
after
update of email on auth.users for each row
execute function private.handle_user_email_update ();
