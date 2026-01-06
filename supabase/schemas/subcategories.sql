create table "subcategories" (
  subcategory_id serial primary key,
  category_id int not null,
  name text not null,

  /* foreign key */
  constraint fk_categories
    foreign key (category_id)
    references categories (category_id)
    on delete cascade
    on update cascade

  /* additional constraints */
  constraint uq_category_id_name
    unique (category_id, name)
);