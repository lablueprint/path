create table "stores" (
  store_id uuid default uuid_generate_v4 () primary key,
  name text not null,
  street_address text not null
);

alter table "stores" enable row level security;

create policy "public can read entries in stores" on public.stores for
select
  to authenticated using (true);

create policy "public can insert entries in stores" on public.stores for insert to authenticated
with
  check (true);

create policy "public can update entries in stores" on public.stores
for update
  to authenticated using (true)
with
  check (true);

create policy "public can delete entries in stores" on public.stores for delete to authenticated using (true);
