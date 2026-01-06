create table "subcategories" (
  subcategory_id serial primary key,
  category_id int not null,
  name text not null,

  /* foreign key */
  constraint fk_categories
    foreign key (category_id)
    references categories (category_id)
    on delete cascade
    on update cascade,

  /* additional constraints */
  constraint uq_category_id_name
    unique (category_id, name)
);

alter table subcategories enable row level security;

create policy "auth can read subcategories if >= requestor"
on public.subcategories for select
to authenticated
using ((select auth.jwt()) ->> 'user_role' in ('requestor', 'admin', 'superadmin', 'owner'));

create policy "auth can insert subcategories if >= admin"
on public.subcategories for insert
to authenticated
with check ((select auth.jwt()) ->> 'user_role' in ('admin', 'superadmin', 'owner'));

create policy "auth can update subcategories if >= superadmin"
on public.subcategories for update
to authenticated
with check ((select auth.jwt()) ->> 'user_role' in ('superadmin', 'owner'));

create policy "auth can delete subcategories if >= superadmin"
on public.subcategories for delete
to authenticated
using ((select auth.jwt()) ->> 'user_role' in ('superadmin', 'owner'));