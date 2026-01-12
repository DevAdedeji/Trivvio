-- Add updated_at column to players table to satisfy existing triggers
alter table "public"."players" add column if not exists "updated_at" timestamp with time zone default now();

-- Add updated_at column to answers table as well, just in case
alter table "public"."answers" add column if not exists "updated_at" timestamp with time zone default now();
