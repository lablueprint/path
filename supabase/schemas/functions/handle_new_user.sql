create schema if not exists private;

create or replace function private.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = '' as $$
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
$$;

create trigger "after create auth.users"
after insert on auth.users for each row
execute procedure private.handle_new_user ();
