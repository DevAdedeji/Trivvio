-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Games Table
create table public.games (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text,
  topic text,
  status text default 'draft'::text,
  phase text default 'lobby'::text,
  code text unique,
  question_count integer default 0,
  current_question_index integer default 0,
  round_ends_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Questions Table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null,
  time_limit integer default 20,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Players Table
create table public.players (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  player_id text not null, -- Client/Auth generated ID
  auth_user_id uuid references auth.users(id),
  display_name text not null,
  avatar_url text,
  is_host boolean default false,
  is_ready boolean default false,
  is_active boolean default true,
  total_score integer default 0,
  current_streak integer default 0,
  best_streak integer default 0,
  correct_answers integer default 0,
  wrong_answers integer default 0,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) -- Added later
);

-- 4. Answers Table
create table public.answers (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  player_id uuid references public.players(id) on delete cascade not null, -- Links to DB row ID
  question_id uuid references public.questions(id) on delete cascade not null,
  player_answer text not null,
  correct_answer text not null,
  is_correct boolean not null,
  points_earned integer default 0,
  time_taken integer,
  answered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) -- Added later
);

-- 5. RPC Function: submit_answer
-- Handles secure atomic updates of scores
create or replace function submit_answer(
  p_game_id uuid,
  p_player_id uuid,
  p_question_id uuid,
  p_answer_text text,
  p_correct_answer text,
  p_is_correct boolean,
  p_points int
) returns int
language plpgsql
security definer
as $$
declare
  v_current_streak int;
  v_best_streak int;
  v_new_streak int;
begin
  -- 1. Insert Answer
  insert into public.answers (
    game_id,
    player_id,
    question_id,
    player_answer,
    correct_answer,
    is_correct,
    points_earned
  ) values (
    p_game_id,
    p_player_id,
    p_question_id,
    p_answer_text,
    p_correct_answer,
    p_is_correct,
    p_points
  );

  -- 2. Get current player stats
  select current_streak, best_streak
  into v_current_streak, v_best_streak
  from public.players
  where id = p_player_id;

  -- Handle nulls
  if v_current_streak is null then v_current_streak := 0; end if;
  if v_best_streak is null then v_best_streak := 0; end if;

  -- Calculate new streak
  if p_is_correct then
    v_new_streak := v_current_streak + 1;
  else
    v_new_streak := 0;
  end if;

  -- Update Best Streak
  if v_new_streak > v_best_streak then
    v_best_streak := v_new_streak;
  end if;

  -- 3. Update Player
  update public.players
  set
    total_score = coalesce(total_score, 0) + p_points,
    correct_answers = coalesce(correct_answers, 0) + (case when p_is_correct then 1 else 0 end),
    wrong_answers = coalesce(wrong_answers, 0) + (case when p_is_correct then 0 else 1 end),
    current_streak = v_new_streak,
    best_streak = v_best_streak,
    last_active_at = now(),
    updated_at = now()
  where id = p_player_id;

  return p_points;
end;
$$;

-- RLS Policies (Basic Setup - Enable as needed)
alter table public.games enable row level security;
alter table public.questions enable row level security;
alter table public.players enable row level security;
alter table public.answers enable row level security;

-- Allow everyone to read/write for now to emulate 'service role' like access if anonymous auth is used,
-- OR define stricter policies.
-- Ideally:
-- Games: Read Public, Write Owner
-- Players: Read Public, Write Self (except score, handled by RPC)
-- Questions: Read Public, Write Owner
-- Answers: Read Public, Write (via RPC mostly)

create policy "Public Read Games" on public.games for select using (true);
create policy "Public Insert Games" on public.games for insert with check (true);
create policy "Public Update Games" on public.games for update using (true); -- Should refine

create policy "Public Read Questions" on public.questions for select using (true);
create policy "Public Read Players" on public.players for select using (true);
create policy "Public Insert Players" on public.players for insert with check (true);
create policy "Public Update Players" on public.players for update using (true); -- RPC bypasses this for score

create policy "Public Read Answers" on public.answers for select using (true);

