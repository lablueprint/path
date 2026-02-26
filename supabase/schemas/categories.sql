create table "categories" (
  category_id serial primary key,
  name text not null
);

alter table public.categories enable row level security;

alter table categories
add constraint uq_categories_name unique (name);

create policy "auth can read categories if >= requestor" on public.categories for
select
  to authenticated using (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('requestor', 'admin', 'superadmin', 'owner')
  );

create policy "auth can insert categories if >= admin" on public.categories for insert to authenticated
with
  check (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('admin', 'superadmin', 'owner')
  );

create policy "auth can update categories if >= superadmin" on public.categories
for update
  to authenticated using (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('superadmin', 'owner')
  )
with
  check (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('superadmin', 'owner')
  );

create policy "auth can delete categories if >= superadmin" on public.categories for delete to authenticated using (
  (
    select
      auth.jwt ()
  ) ->> 'user_role' in ('superadmin', 'owner')
);
