revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

revoke all on table public.profiles, public.topic_mastery, public.attempts,
  public.daily_sessions, public.mistake_items from anon, authenticated;
grant select, insert, update, delete on table public.profiles, public.topic_mastery,
  public.attempts, public.daily_sessions, public.mistake_items to authenticated;
