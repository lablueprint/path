create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin

  insert into public.users (user_id, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );

  return new;
end;
$$;

drop trigger if exists "after create auth.users" on auth.users;

create trigger "after create auth.users"
after insert on auth.users
for each row
execute procedure private.handle_new_user();
