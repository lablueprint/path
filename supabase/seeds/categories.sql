insert into
  categories (category_id, name)
values
  (1, 'Food'),
  (2, 'Hygiene'),
  (3, 'Cleaning'),
  (4, 'Clothing'),
  (5, 'Home goods');

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
