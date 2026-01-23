drop policy "all authenticated users can insert" on "public"."store_admins";

drop policy "all authenticated users can select" on "public"."store_admins";

drop policy "all authenticated users can update" on "public"."store_admins";

drop policy "all authenticated users can delete" on "public"."store_items";

drop policy "all authenticated users can insert" on "public"."store_items";

drop policy "all authenticated users can select" on "public"."store_items";

drop policy "all authenticated users can update" on "public"."store_items";

drop policy "public can delete entries in stores" on "public"."stores";

drop policy "public can insert entries in stores" on "public"."stores";

drop policy "public can read entries in stores" on "public"."stores";

drop policy "public can update entries in stores" on "public"."stores";

drop policy "all authenticated users can delete" on "public"."store_admins";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.can_manage_store(store_to_manage_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
	-- Declare variables
    is_owner boolean;
    is_superadmin boolean;

begin
	-- Logic
    --  Determine if current user is 'superadmin' or 'owner', return true
    select (auth.jwt() ->> 'user_role') == 'owner' into is_owner;
    select (auth.jwt() ->> 'user_role') == 'superadmin' into is_superadmin;

    if is_owner or is_superadmin then
        return true;
    end if;
    
    -- if current user is a store admin return true
    if  exists (
        select 1
        from public.store_admins
        where store_to_manage_id = store_id and auth.uid() = user_id) then 
        return true;
    end if;

    return false;
end;
$function$
;


  create policy "auth can insert store_admins if can_manage_store"
  on "public"."store_admins"
  as permissive
  for insert
  to authenticated
with check (private.can_manage_store(store_id));



  create policy "auth can read store_admins if >= requestor"
  on "public"."store_admins"
  as permissive
  for select
  to authenticated
using (((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'owner'::text, 'superadmin'::text])));



  create policy "no user can update store_admins"
  on "public"."store_admins"
  as permissive
  for update
  to public
with check (false);



  create policy "auth can delete store_items if can_manage_store"
  on "public"."store_items"
  as permissive
  for delete
  to authenticated
using (private.can_manage_store(store_id));



  create policy "auth can insert store_items if can_manage_store"
  on "public"."store_items"
  as permissive
  for insert
  to authenticated
with check (private.can_manage_store(store_id));



  create policy "auth can read store_items if can_manage_store"
  on "public"."store_items"
  as permissive
  for select
  to authenticated
using ((private.can_manage_store(store_id) AND (NOT is_hidden)));



  create policy "auth can update store_items if can_manage_store"
  on "public"."store_items"
  as permissive
  for update
  to authenticated
using (private.can_manage_store(store_id))
with check (true);



  create policy "auth can delete stores if >= superadmin"
  on "public"."stores"
  as permissive
  for delete
  to authenticated
using (((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "auth can insert stores if >= superadmin"
  on "public"."stores"
  as permissive
  for insert
  to authenticated
with check (((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "auth can read stores if >= requestor"
  on "public"."stores"
  as permissive
  for select
  to authenticated
using (((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['requestor'::text, 'admin'::text, 'owner'::text, 'superadmin'::text])));



  create policy "auth can update stores if >= superadmin"
  on "public"."stores"
  as permissive
  for update
  to authenticated
with check (((auth.jwt() ->> 'user_role'::text) = ANY (ARRAY['superadmin'::text, 'owner'::text])));



  create policy "all authenticated users can delete"
  on "public"."store_admins"
  as permissive
  for delete
  to authenticated
using (private.can_manage_store(store_id));



