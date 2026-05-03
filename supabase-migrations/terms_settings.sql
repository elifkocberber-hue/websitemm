create table if not exists terms_settings (
  id integer primary key default 1,
  content text not null default '',
  updated_at timestamptz default now()
);

insert into terms_settings (id, content)
values (1, '')
on conflict (id) do nothing;
