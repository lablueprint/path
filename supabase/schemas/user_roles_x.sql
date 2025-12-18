create schema if not exists private;
create table user_roles
(
user_role_id uuid default uuid_generate_v4() primary key,
user_id uuid not null,
role_id INT not null,


/*constraint fk_user
    foreign key (user_id)
    references users(user_id)
    on delete cascade
    on update no action,*/

constraint fk_roles
    foreign key (role_id)
    references roles(role_id)
    on delete cascade
    on update no action



);

alter table user_roles enable row level security;

create policy "all authenticated users can read all entries"
on public.user_roles
for select to authenticated
using (true);

create policy "Authenticated user can insert entries if role satisfies rules"
on public.user_roles
for insert to authenticated
with check (private.can_assign_role(role_id));

create policy "No user can update entries"
on public.user_roles
for update
using (false)
with check(false);

create policy "Authenticated user delete entries if role satisfies rules"
on public.user_roles
for delete
using (private.can_assign_role(role_id));