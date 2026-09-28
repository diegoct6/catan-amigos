-- CATAN Amigos — secure season deletion
-- Run this file in Supabase SQL Editor after deploying the matching web app.
-- Only authenticated users whose app_metadata.role is exactly "admin" may delete.
create or replace function public.delete_season(p_season_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
     or coalesce(auth.jwt()->'app_metadata'->>'role', '') <> 'admin' then
    raise exception 'Solo un administrador puede eliminar temporadas'
      using errcode = '42501';
  end if;

  delete from public.seasons where id = p_season_id;
  if not found then
    raise exception 'Temporada no encontrada';
  end if;
end;
$$;

revoke all on function public.delete_season(bigint) from public;
revoke all on function public.delete_season(bigint) from anon;
grant execute on function public.delete_season(bigint) to authenticated;
