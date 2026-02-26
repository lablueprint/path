insert into
  subcategories (subcategory_id, category_id, name)
values
  -- Food
  (1, 1, 'Produce'),
  (2, 1, 'Dry goods'),
  (3, 1, 'Beverages'),
  -- Hygiene
  (4, 2, 'Oral care'),
  (5, 2, 'Body wash and soap'),
  -- Cleaning
  (6, 3, 'Laundry'),
  (7, 3, 'Surface cleaners'),
  -- Clothing
  (8, 4, 'Menswear'),
  (9, 4, 'Womenswear'),
  -- Home goods
  (10, 5, 'Kitchenware'),
  (11, 5, 'Bedding');

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
