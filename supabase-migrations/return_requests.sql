create table if not exists return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  user_id uuid not null,
  return_code text not null unique,
  status text not null default 'pending',
  created_at timestamptz default now()
);
