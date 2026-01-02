-- ============================================
-- PLAYERS TABLE
-- ============================================
create table public.players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade not null,
  player_id text not null,
  auth_user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  avatar_url text,
  is_host boolean default false not null,
  is_ready boolean default false,
  is_active boolean default true,
  total_score integer default 0 not null,
  correct_answers integer default 0 not null,
  wrong_answers integer default 0 not null,
  current_streak integer default 0 not null,
  best_streak integer default 0 not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(game_id, player_id)
);

-- Indexes
create index players_game_id_idx on public.players(game_id);
create index players_player_id_idx on public.players(player_id);
create index players_game_id_player_id_idx on public.players(game_id, player_id);

-- Enable RLS
alter table public.players enable row level security;

-- RLS Policies
create policy "Anyone can view players in active games"
  on public.players for select
  using (
    exists (
      select 1 from public.games
      where games.id = players.game_id
      and games.status in ('lobby', 'in_progress', 'completed')
    )
  );

create policy "Anyone can join as a player"
  on public.players for insert
  with check (true);

create policy "Players can update their own data"
  on public.players for update
  using (true);

create policy "Hosts can remove players"
  on public.players for delete
  using (
    exists (
      select 1 from public.games
      where games.id = players.game_id
      and games.user_id = auth.uid()
    )
  );

-- Trigger
create trigger set_player_last_active
  before update on public.players
  for each row
  execute function public.handle_updated_at();