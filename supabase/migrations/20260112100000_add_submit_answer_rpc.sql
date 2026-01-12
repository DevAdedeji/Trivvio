-- Create a function to handle answer submission and player stats update atomically
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
security definer -- Bypass RLS
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
    last_active_at = now()
  where id = p_player_id;

  return p_points;
end;
$$;
