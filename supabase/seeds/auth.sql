insert into
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) (
    select
      '00000000-0000-0000-0000-000000000000',
      ('00000000-0000-0000-0000-00000000000' || i)::uuid,
      'authenticated',
      'authenticated',
      'user' || i || '@epath.org',
      crypt ('PATHrocks!2026', gen_salt ('bf')),
      current_timestamp,
      current_timestamp,
      current_timestamp,
      '{"provider":"email","providers":["email"]}',
      (
        '{"first_name": "First' || i || '", "last_name": "Last' || i || '"}'
      )::jsonb,
      current_timestamp,
      current_timestamp,
      '',
      '',
      '',
      ''
    from
      generate_series(1, 8) as i
  );

insert into
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000009',
    'authenticated',
    'authenticated',
    'user9@example.com',
    crypt ('PATHrocks!2026', gen_salt ('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    ('{"first_name": "First9", "last_name": "Last9"}')::jsonb,
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000010',
    'authenticated',
    'authenticated',
    'user10@example.com',
    crypt ('PATHrocks!2026', gen_salt ('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    (
      '{"first_name": "First10", "last_name": "Last10"}'
    )::jsonb,
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
  );

insert into
  auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) (
    select
      uuid_generate_v4 (),
      id,
      id,
      format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    from
      auth.users
  );
