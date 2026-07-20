insert into
  subcategories (subcategory_id, category_id, name)
values
  -- Miscellaneous
  (1, 1, 'Miscellaneous'),
  -- Food
  (2, 2, 'Produce'),
  (3, 2, 'Dry goods'),
  -- Hygiene
  (4, 3, 'Oral care'),
  (5, 3, 'Body wash and soap'),
  -- Cleaning
  (6, 4, 'Laundry'),
  (7, 4, 'Surface cleaners'),
  -- Clothing
  (8, 5, 'Menswear'),
  (9, 5, 'Womenswear'),
  -- Home goods
  (10, 6, 'Kitchenware'),
  (11, 6, 'Bedding');

select
  setval(
    'subcategories_subcategory_id_seq',
    (
      select
        max(subcategory_id)
      from
        subcategories
    )
  );
