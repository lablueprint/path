create table "stores" (
  store_id uuid default uuid_generate_v4 () primary key,
  name text not null,
  street_address text not null
);

alter table "stores" enable row level security;

create policy "auth can read stores if >= requestor" on public.stores for
select
  to authenticated using (
    (auth.jwt () ->> 'user_role') in ('requestor', 'admin', 'owner', 'superadmin')
  );

create policy "auth can insert stores if >= superadmin" on public.stores for insert to authenticated
with
  check (
    (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
  );

create policy "auth can update stores if >= superadmin" on public.stores
for update
  to authenticated using (
    (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
  )
with
  check (
    (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
  );

create policy "auth can delete stores if >= superadmin" on public.stores for delete to authenticated using (
  (auth.jwt () ->> 'user_role') in ('superadmin', 'owner')
);
