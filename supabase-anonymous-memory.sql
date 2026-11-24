-- NIRVO Study AI: private cloud memory without student email/password accounts.
-- Enable Supabase Authentication -> Providers -> Anonymous sign-ins before deploying.
-- Anonymous Supabase users receive the authenticated database role; RLS binds every row to auth.uid().
create table if not exists public.student_memory (
  user_id uuid primary key references auth.users(id) on delete cascade,
  memory jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.student_memory enable row level security;
revoke all on table public.student_memory from anon, authenticated;
grant select, insert, update, delete on table public.student_memory to authenticated;
drop policy if exists "Students read their own anonymous memory" on public.student_memory;
create policy "Students read their own anonymous memory" on public.student_memory
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Students create their own anonymous memory" on public.student_memory;
create policy "Students create their own anonymous memory" on public.student_memory
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Students update their own anonymous memory" on public.student_memory;
create policy "Students update their own anonymous memory" on public.student_memory
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Students delete their own anonymous memory" on public.student_memory;
create policy "Students delete their own anonymous memory" on public.student_memory
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Private, atomic per-anonymous-student daily AI usage cap.
create table if not exists public.ai_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null default (now() at time zone 'utc')::date,
  request_count integer not null default 0,
  primary key (user_id, usage_day)
);
alter table public.ai_daily_usage enable row level security;
revoke all on table public.ai_daily_usage from anon, authenticated;

create or replace function public.consume_ai_request()
returns boolean language plpgsql security definer set search_path = ''
as $$
declare new_count integer;
begin
  if auth.uid() is null then return false; end if;
  insert into public.ai_daily_usage (user_id, usage_day, request_count)
  values ((select auth.uid()), (now() at time zone 'utc')::date, 1)
  on conflict (user_id, usage_day)
  do update set request_count = public.ai_daily_usage.request_count + 1
  returning request_count into new_count;
  return new_count <= 20;
end;
$$;
revoke all on function public.consume_ai_request() from public, anon;
grant execute on function public.consume_ai_request() to authenticated;
