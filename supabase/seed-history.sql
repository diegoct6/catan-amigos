-- CATAN AMIGOS — histórico importado del Excel CATAN Stats 2025.xlsx
-- Temporadas 1 y 2. 73 partidas / 258 resultados.

begin;

-- Nombres de temporada: el número manda; las fechas describen el periodo.
insert into public.seasons (name,is_active) values
('1 · 12 jun – 26 jun 2025', false),
('2 · 3 jul – 25 sep 2025', true)
on conflict (name) do nothing;

-- Jugadores históricos.
insert into public.players (name) values
('Camila Espinosa'),
('Carlos Morales'),
('David Rubio'),
('Diego Cuartas'),
('Nathalia Gutiérrez')
on conflict (name) do nothing;

insert into public.games (legacy_id, season_id, played_at, player_count)
select 1, id, '2025-06-12', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 2, id, '2025-06-12', 5 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 3, id, '2025-06-12', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 4, id, '2025-06-13', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 5, id, '2025-06-13', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 6, id, '2025-06-13', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 7, id, '2025-06-14', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 8, id, '2025-06-14', 5 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 9, id, '2025-06-14', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 10, id, '2025-06-14', 5 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 11, id, '2025-06-14', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 12, id, '2025-06-15', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 13, id, '2025-06-15', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 14, id, '2025-06-15', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 15, id, '2025-06-15', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 16, id, '2025-06-16', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 17, id, '2025-06-16', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 18, id, '2025-06-16', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 19, id, '2025-06-17', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 20, id, '2025-06-17', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 21, id, '2025-06-18', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 22, id, '2025-06-18', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 23, id, '2025-06-19', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 24, id, '2025-06-20', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 25, id, '2025-06-20', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 26, id, '2025-06-21', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 27, id, '2025-06-25', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 28, id, '2025-06-26', 4 from public.seasons where name = '1 · 12 jun – 26 jun 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;

-- Temporada 2: 45 partidas.
insert into public.games (legacy_id, season_id, played_at, player_count)
select 29, id, '2025-07-03', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 30, id, '2025-07-03', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 31, id, '2025-07-04', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 32, id, '2025-07-04', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 33, id, '2025-07-05', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 34, id, '2025-07-05', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 35, id, '2025-07-05', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 36, id, '2025-07-05', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 37, id, '2025-07-06', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 38, id, '2025-07-06', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 39, id, '2025-07-07', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 40, id, '2025-07-07', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 41, id, '2025-07-10', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 42, id, '2025-07-10', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 43, id, '2025-07-11', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 44, id, '2025-07-11', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 45, id, '2025-07-12', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 46, id, '2025-07-12', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 47, id, '2025-07-13', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 48, id, '2025-07-13', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 49, id, '2025-07-14', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 50, id, '2025-07-14', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 51, id, '2025-07-15', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 52, id, '2025-07-15', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 53, id, '2025-07-16', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 54, id, '2025-07-17', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 55, id, '2025-07-17', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 56, id, '2025-07-18', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 57, id, '2025-07-18', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 58, id, '2025-07-19', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 59, id, '2025-07-20', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 60, id, '2025-07-24', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 61, id, '2025-07-24', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 62, id, '2025-07-25', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 63, id, '2025-07-25', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 64, id, '2025-07-26', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 65, id, '2025-07-26', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 66, id, '2025-07-27', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 67, id, '2025-08-01', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 68, id, '2025-08-02', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 69, id, '2025-08-03', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 70, id, '2025-09-18', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 71, id, '2025-09-18', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 72, id, '2025-09-25', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;
insert into public.games (legacy_id, season_id, played_at, player_count)
select 73, id, '2025-09-25', 4 from public.seasons where name = '2 · 3 jul – 25 sep 2025'
on conflict (legacy_id) where legacy_id is not null do update set season_id=excluded.season_id, played_at=excluded.played_at, player_count=excluded.player_count;

-- Do not delete existing result rows. The import can be rerun safely.
-- The source workbook rows must be present in game_results before this
-- transaction can commit; this guard prevents a partial historical seed.
do $seed_guard$
declare
  v_games integer;
  v_results integer;
begin
  select count(*) into v_games from public.games where legacy_id between 1 and 73;
  select count(*) into v_results from public.game_results gr join public.games g on g.id = gr.game_id where g.legacy_id between 1 and 73;
  if v_games <> 73 or v_results <> 258 then
    raise exception 'Historical seed incomplete: expected 73 games and 258 results, found % games and % results. Restore the workbook result rows before running this script.', v_games, v_results;
  end if;
end $seed_guard$;
