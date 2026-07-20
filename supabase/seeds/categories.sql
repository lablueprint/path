insert into
  categories (category_id, name)
values
  (1, 'Miscellaneous'),
  (2, 'Food'),
  (3, 'Hygiene'),
  (4, 'Cleaning'),
  (5, 'Clothing'),
  (6, 'Home goods');

-- Reset the sequence so future manual inserts don't collide
select
  setval(
    'categories_category_id_seq',
    (
      select
        max(category_id)
      from
        categories
    )
  );
