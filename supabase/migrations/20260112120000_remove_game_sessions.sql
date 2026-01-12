-- Remove usage of game_session_id from answers
alter table "public"."answers" drop column if exists "game_session_id";

-- Drop the unused table
drop table if exists "public"."game_sessions";
