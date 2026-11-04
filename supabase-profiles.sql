-- Run in Supabase SQL Editor. Student profiles are private to the signed-in owner.
create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;
revoke all on table public.student_profiles from anon, authenticated;
grant select, insert, update, delete on table public.student_profiles to authenticated;

drop policy if exists "Students read only their profile" on public.student_profiles;
create policy "Students read only their profile"
  on public.student_profiles for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "Students create only their profile" on public.student_profiles;
create policy "Students create only their profile"
  on public.student_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists "Students update only their profile" on public.student_profiles;
create policy "Students update only their profile"
  on public.student_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Students delete only their profile" on public.student_profiles;
create policy "Students delete only their profile"
  on public.student_profiles for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Atomically cap each signed-in account at 20 AI requests per UTC day.
-- The counter table is private; clients can only call this checked RPC.
create table if not exists public.ai_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null default (now() at time zone 'utc')::date,
  request_count integer not null default 0,
  primary key (user_id, usage_day)
);
alter table public.ai_daily_usage enable row level security;
revoke all on table public.ai_daily_usage from anon, authenticated;

create or replace function public.consume_ai_request()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_count integer;
begin
  if auth.uid() is null then
    return false;
  end if;
  insert into public.ai_daily_usage (user_id, usage_day, request_count)
  values ((select auth.uid()), (now() at time zone 'utc')::date, 1)
  on conflict (user_id, usage_day)
  do update set request_count = ai_daily_usage.request_count + 1
  returning request_count into new_count;
  return new_count <= 20;
end;
$$;
revoke all on function public.consume_ai_request() from public, anon;
grant execute on function public.consume_ai_request() to authenticated;
