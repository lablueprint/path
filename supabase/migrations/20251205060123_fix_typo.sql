drop policy "public can delete tiecket_items" on "public"."ticket_items";


  create policy "public can delete ticket_items"
  on "public"."ticket_items"
  as permissive
  for delete
  to anon
using (true);



