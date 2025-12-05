create type ticket_status as enum ('requested', 'ready', 'rejected', 'fulfilled');

create table "tickets" (
    "ticket_id" uuid default uuid_generate_v4() primary key,
    "requestor_user_id" uuid not null,
    "store_id" uuid not null,
    "status" ticket_status not null, -- max 50 character status
    "date_submitted"  TIMESTAMP WITH TIME ZONE default now()
    -- FOREIGN KEY (requestor_user_id) REFERENCES users(user_id),
    -- FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

alter table tickets enable row level security;

create policy "public can read entries in tickets"
on public.tickets
for select to anon
using (true);

create policy "public can insert entries in tickets"
on public.tickets
for insert to anon
with check (true);

create policy "public can update entries in tickets"
on public.tickets
for update to anon
using (true)
with check (true);

create policy "public can delete entries in tickets"
on public.tickets
for delete to anon
using (true);

