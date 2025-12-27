-- Create the auth hook function
create or replace function public.custom_access_token_hook (event jsonb) returns jsonb language plpgsql stable
-- Ensure that the function only looks in the public schema for tables
set
  search_path = public as $$
  declare
    claims jsonb;
    user_role text;
  begin
    select r.name into user_role
    from public.user_roles ur
    join public.roles r on ur.role_id = r.role_id
    where ur.user_id = (event ->> 'user_id')::uuid
    limit 1;

    claims := event -> 'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null'::jsonb);
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
