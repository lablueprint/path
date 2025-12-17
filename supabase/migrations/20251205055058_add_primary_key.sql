alter table "public"."ticket_items" alter column "ticket_item_id" set not null;

CREATE UNIQUE INDEX ticket_items_pkey ON public.ticket_items USING btree (ticket_item_id);

alter table "public"."ticket_items" add constraint "ticket_items_pkey" PRIMARY KEY using index "ticket_items_pkey";


