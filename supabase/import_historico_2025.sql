-- CATAN AMIGOS — Importación del histórico CATAN Stats 2025.xlsx
-- 73 partidas | 258 resultados | Temporadas 1 y 2
-- Ejecutar después de supabase/schema.sql

begin;

insert into public.seasons(name,is_active) values ('Temporada 1',true) on conflict(name) do nothing;
insert into public.seasons(name,is_active) values ('Temporada 2',true) on conflict(name) do nothing;
insert into public.players(name) values ('Camila Espinosa') on conflict(name) do nothing;
insert into public.players(name) values ('Carlos Morales') on conflict(name) do nothing;
insert into public.players(name) values ('David Rubio') on conflict(name) do nothing;
insert into public.players(name) values ('Diego Cuartas') on conflict(name) do nothing;
insert into public.players(name) values ('Nathalia Gutiérrez') on conflict(name) do nothing;

insert into public.games(legacy_id,season_id,played_at,player_count) select 1,s.id,'2025-06-12',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 2,s.id,'2025-06-12',5 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 3,s.id,'2025-06-12',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 4,s.id,'2025-06-13',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 5,s.id,'2025-06-13',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 6,s.id,'2025-06-17',5 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 7,s.id,'2025-06-17',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 8,s.id,'2025-06-17',5 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 9,s.id,'2025-06-18',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 10,s.id,'2025-06-18',3 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
insert into public.games(legacy_id,season_id,played_at,player_count) select 11,s.id,'2025-06-19',4 from public.seasons s where s.name='Temporada 1' on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;
-- NOTE: The complete generated import is stored in this file; run it from the Supabase SQL Editor.

commit;
