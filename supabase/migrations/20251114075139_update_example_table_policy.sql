
  create policy "public can insert entries in example"
  on "public"."example"
  as permissive
  for insert
  to anon
with check (true);



