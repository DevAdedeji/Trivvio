-- Enable RLS for all tables
alter table public.games enable row level security;
alter table public.questions enable row level security;
alter table public.players enable row level security;
alter table public.answers enable row level security;

-- 1. Games Table Policies
-- Everyone can view games (needed for joining via code)
create policy "Games are viewable by everyone"
  on public.games for select
  using (true);

-- Only authenticated users can create games
create policy "Users can create games"
  on public.games for insert
  with check (auth.role() = 'authenticated');

-- Only the game owner can update their games
create policy "Users can update their own games"
  on public.games for update
  using (auth.uid() = user_id);

-- Only the game owner can delete their games
create policy "Users can delete their own games"
  on public.games for delete
  using (auth.uid() = user_id);


-- 2. Questions Table Policies
-- Everyone can view questions (needed for gameplay)
create policy "Questions are viewable by everyone"
  on public.questions for select
  using (true);

-- Only the game owner can insert questions
create policy "Game owners can insert questions"
  on public.questions for insert
  with check (
    exists (
      select 1 from public.games
      where id = game_id
      and user_id = auth.uid()
    )
  );

-- Only the game owner can update questions
create policy "Game owners can update questions"
  on public.questions for update
  using (
    exists (
      select 1 from public.games
      where id = game_id
      and user_id = auth.uid()
    )
  );

-- Only the game owner can delete questions
create policy "Game owners can delete questions"
  on public.questions for delete
  using (
    exists (
      select 1 from public.games
      where id = game_id
      and user_id = auth.uid()
    )
  );


-- 3. Players Table Policies (Permissive for Anonymous Play)
-- Everyone can view players (needed for lobby/leaderboard)
create policy "Players are viewable by everyone"
  on public.players for select
  using (true);

-- Anyone can join a game (Insert player)
create policy "Anyone can join a game"
  on public.players for insert
  with check (true);

-- Anyone can update a player (Score/Streak updates)
-- ideally this would be restricted to the player themselves via a cookie/token match
-- but for now we allow public updates to support simple anonymous play
create policy "Anyone can update players"
  on public.players for update
  using (true);


-- 4. Answers Table Policies (Permissive for Anonymous Play)
-- Everyone can view answers (maybe needed for stats?)
create policy "Answers are viewable by everyone"
  on public.answers for select
  using (true);

-- Anyone can submit an answer
create policy "Anyone can submit answers"
  on public.answers for insert
  with check (true);
