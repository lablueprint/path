create table "stores" (
  store_id uuid default uuid_generate_v4 () primary key,
  name text,
  street_address text
);

alter table "stores" enable row level security;

create policy "public can read entries in stores" on public.stores for
select
  to anon using (true);

create policy "public can insert entries in stores" on public.stores for insert to anon
with
  check (true);

create policy "public can update entries in stores" on public.stores
for update
  to anon using (true)
with
  check (true);

create policy "public can delete entries in stores" on public.stores for delete to anon using (true);
