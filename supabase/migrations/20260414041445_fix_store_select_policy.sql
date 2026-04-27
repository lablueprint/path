drop policy "auth can read stores if >= requestor" on public.stores;

create policy "auth can read stores"
on public.stores
for select
to authenticated
using (true);