-- TODO: Add photo URLs
insert into
  inventory_items (
    inventory_item_id,
    subcategory_id,
    name,
    description
  )
values
  -- Produce
  (
    '00000000-0000-0000-0000-000000000001',
    1,
    'Bananas',
    'Fresh bunch of bananas.'
  ),
  -- Dry goods
  (
    '00000000-0000-0000-0000-000000000002',
    2,
    'Granola bars',
    'Box of granola bars.'
  ),
  -- Oral care
  (
    '00000000-0000-0000-0000-000000000003',
    4,
    'Toothpaste',
    'Tube of toothpaste.'
  ),
  -- Body wash and soap
  (
    '00000000-0000-0000-0000-000000000004',
    5,
    'Shampoo',
    'Bottle of shampoo.'
  ),
  -- Laundry
  (
    '00000000-0000-0000-0000-000000000005',
    6,
    'Detergent',
    'Bottle of liquid laundry detergent.'
  ),
  -- Surface Cleaners
  (
    '00000000-0000-0000-0000-000000000006',
    7,
    'All-purpose spray',
    'Disinfectant for all surfaces.'
  ),
  -- Menswear
  (
    '00000000-0000-0000-0000-000000000007',
    8,
    'Jeans',
    'Denim jeans.'
  ),
  -- Womenswear
  (
    '00000000-0000-0000-0000-000000000008',
    9,
    'Leggings',
    'Leggings for athletic use.'
  ),
  -- Kitchenware
  (
    '00000000-0000-0000-0000-000000000009',
    10,
    'Cast iron skillet',
    'Heavy duty skillet.'
  ),
  -- Bedding
  (
    '00000000-0000-0000-0000-000000000010',
    11,
    'Wool blanket',
    'Thick wool blanket.'
  );
