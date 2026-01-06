create type ticket_status as enum('requested', 'ready', 'rejected', 'fulfilled');

create table tickets (
  ticket_id uuid default uuid_generate_v4 () primary key,
  requestor_user_id uuid not null,
  store_id uuid not null,
  status ticket_status not null,
  date_submitted timestamp with time zone default now(),
  /*constraint fk_users
  foreign key (requestor_user_id)
  references users (user_id),
  */
  constraint fk_stores foreign key (store_id) references stores (store_id)
);

alter table tickets enable row level security;

create policy "auth can read tickets if requestor_user_id or >= superadmin" on public.tickets for
select
  to authenticated using (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('superadmin', 'owner')
    or (
      select
        auth.uid ()
    ) = requestor_user_id
  );

create policy "auth can insert tickets if >= requestor" on public.tickets for insert to authenticated
with
  check (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('requestor', 'admin', 'superadmin', 'owner')
    and (
      select
        auth.uid ()
    ) = requestor_user_id  -- Supabase was doing this before this clause was added
  );

create policy "auth can update tickets if requestor_user_id" on public.tickets
for update
  to authenticated using (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('superadmin', 'owner')
    or (
      select
        auth.uid ()
    ) = requestor_user_id
  )
with
  check (
    (
      select
        auth.jwt ()
    ) ->> 'user_role' in ('superadmin', 'owner')
    or (
      select
        auth.uid ()
    ) = requestor_user_id
  );

create policy "auth can delete tickets if requestor_user_id or >= superadmin" on public.tickets for delete to authenticated using (
  (
    select
      auth.jwt ()
  ) ->> 'user_role' in ('superadmin', 'owner')
  or (
    select
      auth.uid ()
  ) = requestor_user_id
);
