create table "categories" (
  category_id serial primary key,
  name text not null,

  /* additional constraints */
  constraint uq_name
    unique (name)
);