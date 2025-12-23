-- Create the auth hook function
create or replace function public.custom_access_token_hook (event jsonb) returns jsonb language plpgsql stable
-- Ensure that the function only looks in the public schema for tables
set
  search_path = public as $$
  declare
    claims jsonb;
    user_roles_array jsonb;
  begin
    -- Aggregate all roles into an array
    select jsonb_agg(r.name) into user_roles_array
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_roles_array is not null then
      -- Set the claim as an array
      claims := jsonb_set(claims, '{user_roles}', user_roles_array);
    else
      claims := jsonb_set(claims, '{user_roles}', '[]'::jsonb);
    end if;

    -- Update the claims object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;

grant
execute on function public.custom_access_token_hook to supabase_auth_admin;

revoke
execute on function public.custom_access_token_hook
from
  authenticated,
  anon,
  public;
