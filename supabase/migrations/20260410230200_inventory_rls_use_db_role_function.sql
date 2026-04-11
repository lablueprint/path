-- RLS checks use private.get_auth_user_role_name() so permissions follow public.user_roles
-- even when auth.jwt() omits or lags custom claims (common with server actions / refreshed tokens).

create or replace function private.get_auth_user_role_name () returns text language sql stable security definer
set
  search_path = public as $$
  select
    r.name
  from
    public.user_roles ur
    join public.roles r on r.role_id = ur.role_id
  where
    ur.user_id = auth.uid ();
$$;

revoke all on function private.get_auth_user_role_name () from public;

grant execute on function private.get_auth_user_role_name () to authenticated;

grant execute on function private.get_auth_user_role_name () to anon;

drop policy if exists "auth can read inventory_items if >= requestor" on public.inventory_items;

drop policy if exists "auth can insert inventory_items if >= admin" on public.inventory_items;

drop policy if exists "auth can update inventory_items if >= superadmin" on public.inventory_items;

drop policy if exists "auth can delete inventory_items if >= superadmin" on public.inventory_items;

create policy "auth can read inventory_items if >= requestor" on public.inventory_items for select
  to authenticated using (
    private.get_auth_user_role_name () in ('requestor', 'admin', 'superadmin', 'owner')
  );

create policy "auth can insert inventory_items if >= admin" on public.inventory_items for insert to authenticated
  with check (
    private.get_auth_user_role_name () in ('admin', 'superadmin', 'owner')
  );

create policy "auth can update inventory_items if >= superadmin" on public.inventory_items for update to authenticated
  using (
    private.get_auth_user_role_name () in ('superadmin', 'owner')
  )
  with check (
    private.get_auth_user_role_name () in ('superadmin', 'owner')
  );

create policy "auth can delete inventory_items if >= superadmin" on public.inventory_items for delete to authenticated
  using (
    private.get_auth_user_role_name () in ('superadmin', 'owner')
  );

drop policy if exists "auth can read inventory_item_photos if >= requestor" on storage.objects;

drop policy if exists "auth can insert inventory_item_photos if >= admin" on storage.objects;

drop policy if exists "auth can update inventory_item_photos if >= superadmin" on storage.objects;

drop policy if exists "auth can delete inventory_item_photos if >= superadmin" on storage.objects;

create policy "auth can read inventory_item_photos if >= requestor"
on storage.objects for select to authenticated
using (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('requestor', 'admin', 'superadmin', 'owner')
);

create policy "auth can insert inventory_item_photos if >= admin"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('admin', 'superadmin', 'owner')
);

create policy "auth can update inventory_item_photos if >= superadmin"
on storage.objects for update to authenticated
using (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('superadmin', 'owner')
)
with check (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('superadmin', 'owner')
);

create policy "auth can delete inventory_item_photos if >= superadmin"
on storage.objects for delete to authenticated
using (
  bucket_id = 'inventory_item_photos'
  and private.get_auth_user_role_name () in ('superadmin', 'owner')
);
