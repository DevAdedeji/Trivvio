ALTER TABLE "public"."games" DROP CONSTRAINT IF EXISTS "games_status_check";
ALTER TABLE "public"."games" ADD CONSTRAINT "games_status_check" CHECK (status IN ('draft', 'ready', 'lobby', 'active', 'finished', 'waiting'));
