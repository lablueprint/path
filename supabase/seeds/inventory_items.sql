insert into
  inventory_items (
    inventory_item_id,
    subcategory_id,
    name,
    description,
    photo_url
  )
values
  -- Produce
  (
    '00000000-0000-0000-0000-000000000001',
    1,
    'Bananas',
    'Fresh bunch of bananas.',
    'http://127.0.0.1:54321/storage/v1/object/public/inventory_item_photos/00000000-0000-0000-0000-000000000001/item.jpg'
  ),
  -- Dry goods
  (
    '00000000-0000-0000-0000-000000000002',
    2,
    'Granola bars',
    'Box of granola bars.',
    'http://127.0.0.1:54321/storage/v1/object/public/inventory_item_photos/00000000-0000-0000-0000-000000000002/item.jpg'
  ),
  -- Oral care
  (
    '00000000-0000-0000-0000-000000000003',
    4,
    'Toothpaste',
    'Tube of toothpaste.',
    'http://127.0.0.1:54321/storage/v1/object/public/inventory_item_photos/00000000-0000-0000-0000-000000000003/item.jpg'
  ),
  -- Body wash and soap
  (
    '00000000-0000-0000-0000-000000000004',
    5,
    'Shampoo',
    'Bottle of shampoo.',
    null
  ),
  -- Laundry
  (
    '00000000-0000-0000-0000-000000000005',
    6,
    'Detergent',
    'Bottle of liquid laundry detergent.',
    'http://127.0.0.1:54321/storage/v1/object/public/inventory_item_photos/00000000-0000-0000-0000-000000000005/item.jpg'
  ),
  -- Surface Cleaners
  (
    '00000000-0000-0000-0000-000000000006',
    7,
    'All-purpose spray',
    'Disinfectant for all surfaces.',
    null
  ),
  -- Menswear
  (
    '00000000-0000-0000-0000-000000000007',
    8,
    'Jeans',
    'Denim jeans.',
    null
  ),
  -- Womenswear
  (
    '00000000-0000-0000-0000-000000000008',
    9,
    'Leggings',
    'Leggings for athletic use.',
    null
  ),
  -- Kitchenware
  (
    '00000000-0000-0000-0000-000000000009',
    10,
    'Cast iron skillet',
    'Heavy duty skillet.',
    'http://127.0.0.1:54321/storage/v1/object/public/inventory_item_photos/00000000-0000-0000-0000-000000000009/item.jpg'
  ),
  -- Bedding
  (
    '00000000-0000-0000-0000-000000000010',
    11,
    'Wool blanket',
    'Thick wool blanket.',
    null
  );
