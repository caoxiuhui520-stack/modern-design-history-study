create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  exam_date date not null default '2026-06-29',
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.topic_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  mastery integer not null check (mastery between 0 and 100),
  success_streak integer not null default 0,
  review_count integer not null default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table public.attempts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic_ids text[] not null default '{}',
  answer text not null default '',
  score numeric not null check (score between 0 and 1),
  self_rating text check (self_rating in ('known', 'unsure', 'unknown')),
  created_at timestamptz not null,
  synced_at timestamptz not null default now()
);

create table public.daily_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  completed_stages text[] not null default '{}',
  current_index integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, session_date)
);

create table public.mistake_items (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic_id text not null,
  reason text not null check (reason in ('wrong', 'unsure')),
  status text not null check (status in ('open', 'resolved')),
  updated_at timestamptz not null default now()
);

create index topic_mastery_due_idx on public.topic_mastery (user_id, next_review_at);
create index attempts_user_created_idx on public.attempts (user_id, created_at desc);
create index mistakes_user_status_idx on public.mistake_items (user_id, status);

alter table public.profiles enable row level security;
alter table public.topic_mastery enable row level security;
alter table public.attempts enable row level security;
alter table public.daily_sessions enable row level security;
alter table public.mistake_items enable row level security;

create policy "own profiles" on public.profiles for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "own topic mastery" on public.topic_mastery for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "own attempts" on public.attempts for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "own daily sessions" on public.daily_sessions for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "own mistake items" on public.mistake_items for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
