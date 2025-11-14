create table "example" (
  "id" integer not null,
  "name" text
);

alter table example enable row level security;

create policy "public can read example"
on public.example
for select to anon
using (true);