create table "tickets"{
    "ticket_id" SERIAL, -- SERIAL is an int that create unique sequential values??
    "requestor_user_id" INT,
    "store_id" INT,
    "status" VARCHAR(50), -- max 50 character status
    "date_submitted"  TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (requestor_user_id) REFERENCES users(user_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
}

alter table tickets enable row level security;

-- create the policies here, idk enough sql rn to do so. Also we have to delete these comments lol

