alter table "public"."games" add column "current_question_index" integer not null default 0;
alter table "public"."games" add column "phase" text not null default 'lobby';
alter table "public"."games" add column "round_ends_at" timestamp with time zone;
