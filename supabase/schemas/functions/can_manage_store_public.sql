create or replace function public.can_manage_store (store_to_manage_id uuid) returns boolean language sql security definer
set
  search_path = '' as $$
  select private.can_manage_store(store_to_manage_id);
$$;

grant
execute on function public.can_manage_store (uuid) to authenticated;
