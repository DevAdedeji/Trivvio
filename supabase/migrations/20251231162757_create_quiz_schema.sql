-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Games table
create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  question_count integer not null,
  status text not null default 'draft' check (status in ('draft', 'ready', 'active', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions table
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade not null,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  time_limit integer not null default 10 check (time_limit in (10, 20, 30, 60)),
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Game Sessions table (tracks each play-through)
create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete cascade not null,
  player_id text not null, -- Changed to text, can be UUID string or any client ID
  player_name text not null,
  auth_user_id uuid references auth.users(id) on delete set null, -- Optional: link to auth user
  total_score integer default 0,
  total_questions integer not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Answers table (tracks each answer submitted)
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid references public.game_sessions(id) on delete cascade not null,
  game_id uuid references public.games(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  player_id text not null, -- Changed to text, matches game_sessions.player_id
  player_answer text not null check (player_answer in ('A', 'B', 'C', 'D')),
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  is_correct boolean not null,
  points_earned integer not null default 0,
  time_taken integer, -- seconds taken to answer
  answered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for better performance
create index questions_game_id_idx on public.questions(game_id);
create index questions_game_id_order_idx on public.questions(game_id, order_index);
create index games_user_id_idx on public.games(user_id);
create index game_sessions_game_id_idx on public.game_sessions(game_id);
create index game_sessions_player_id_idx on public.game_sessions(player_id);
create index game_sessions_auth_user_id_idx on public.game_sessions(auth_user_id);
create index answers_game_session_id_idx on public.answers(game_session_id);
create index answers_question_id_idx on public.answers(question_id);
create index answers_player_id_idx on public.answers(player_id);

-- Enable Row Level Security
alter table public.games enable row level security;
alter table public.questions enable row level security;
alter table public.game_sessions enable row level security;
alter table public.answers enable row level security;

-- ============================================
-- RLS Policies for GAMES (Public read, owner write)
-- ============================================

create policy "Anyone can view published games"
  on public.games for select
  using (status in ('ready', 'active', 'completed'));

create policy "Users can create their own games"
  on public.games for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own games"
  on public.games for update
  using (auth.uid() = user_id);

create policy "Users can delete their own games"
  on public.games for delete
  using (auth.uid() = user_id);

-- ============================================
-- RLS Policies for QUESTIONS (Public read, owner write)
-- ============================================

create policy "Anyone can view questions for published games"
  on public.questions for select
  using (
    exists (
      select 1 from public.games
      where games.id = questions.game_id
      and games.status in ('ready', 'active', 'completed')
    )
  );

create policy "Game owners can create questions"
  on public.questions for insert
  with check (
    exists (
      select 1 from public.games
      where games.id = questions.game_id
      and games.user_id = auth.uid()
    )
  );

create policy "Game owners can update questions"
  on public.questions for update
  using (
    exists (
      select 1 from public.games
      where games.id = questions.game_id
      and games.user_id = auth.uid()
    )
  );

create policy "Game owners can delete questions"
  on public.questions for delete
  using (
    exists (
      select 1 from public.games
      where games.id = questions.game_id
      and games.user_id = auth.uid()
    )
  );

-- ============================================
-- RLS Policies for GAME SESSIONS
-- ============================================

create policy "Anyone can view game sessions"
  on public.game_sessions for select
  using (true);

create policy "Anyone can create game sessions"
  on public.game_sessions for insert
  with check (true);

create policy "Anyone can update game sessions"
  on public.game_sessions for update
  using (true); -- We'll validate player_id client-side

-- ============================================
-- RLS Policies for ANSWERS
-- ============================================

create policy "Anyone can view answers"
  on public.answers for select
  using (true);

create policy "Anyone can submit answers"
  on public.answers for insert
  with check (true);

create policy "Anyone can update answers"
  on public.answers for update
  using (true);

-- ============================================
-- Triggers
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_games_updated_at
  before update on public.games
  for each row
  execute function public.handle_updated_at();

create or replace function public.update_session_score()
returns trigger as $$
begin
  update public.game_sessions
  set total_score = (
    select coalesce(sum(points_earned), 0)
    from public.answers
    where game_session_id = new.game_session_id
  )
  where id = new.game_session_id;
  return new;
end;
$$ language plpgsql;

create trigger update_session_score_on_answer
  after insert on public.answers
  for each row
  execute function public.update_session_score();