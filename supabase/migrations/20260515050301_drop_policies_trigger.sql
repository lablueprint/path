drop trigger if exists "after update tickets status" on "public"."tickets";

drop policy "auth can delete tickets if requestor_user_id or >= superadmin" on "public"."tickets";

drop policy "auth can insert tickets if requestor_user_id and >= requestor" on "public"."tickets";

drop policy "auth can read tickets if requestor_user_id or can_manage_store" on "public"."tickets";

drop policy "auth can update tickets if requestor_user_id or can_manage_stor" on "public"."tickets";


