-- WARNING: destructive reset for app tables.
-- Run this in Supabase SQL Editor for your active project.

create extension if not exists pgcrypto;

-- Reset app tables only (does not delete auth.users)
drop table if exists public.scores cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

create unique index profiles_username_lower_key
  on public.profiles ((lower(username)));

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  completion_seconds integer not null check (completion_seconds >= 0),
  points integer not null check (points >= 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.scores enable row level security;

create policy "profiles are readable"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "users insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "scores are readable"
  on public.scores
  for select
  to authenticated
  using (true);

create policy "users insert own score"
  on public.scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.scores to authenticated;
grant insert on public.scores to authenticated;
