create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  completion_seconds integer not null check (completion_seconds >= 0),
  points integer not null check (points >= 0),
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;

drop policy if exists "scores are readable" on public.scores;
create policy "scores are readable"
  on public.scores
  for select
  to authenticated
  using (true);

drop policy if exists "users insert own score" on public.scores;
create policy "users insert own score"
  on public.scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);
