-- Add code column to existing games table
alter table public.games
  add column if not exists code text;

-- Generate codes for existing rows (6-digit PIN)
update public.games
set code = lpad(floor(random() * 999999)::text, 6, '0')
where code is null;

-- Make it not null
alter table public.games
  alter column code set not null;

-- Add unique constraint
alter table public.games
  add constraint games_code_unique unique (code);

-- Add index
create index if not exists games_code_idx on public.games(code);