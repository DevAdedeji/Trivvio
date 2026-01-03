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
create index players_game_id_idx on public.players(game_id);
create index players_player_id_idx on public.players(player_id);
create index players_game_id_player_id_idx on public.players(game_id, player_id);


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

  -- Trigger
create trigger set_player_last_active
  before update on public.players
  for each row
  execute function public.handle_updated_at();