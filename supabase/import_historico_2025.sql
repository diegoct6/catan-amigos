-- CATAN AMIGOS — Importación completa de CATAN Stats 2025.xlsx
-- 73 partidas, 258 resultados, 2 temporadas.
-- Ejecutar después de supabase/schema.sql.
begin;

insert into public.seasons(name,is_active) values ('Temporada 1',true),('Temporada 2',true) on conflict(name) do nothing;
insert into public.players(name) values ('Camila Espinosa'),('Carlos Morales'),('David Rubio'),('Diego Cuartas'),('Nathalia Gutiérrez') on conflict(name) do nothing;

insert into public.games(legacy_id,season_id,played_at,player_count)
select v.legacy_id,s.id,v.played_at::date,v.player_count
from (values
(1,1,'2025-06-12',4),(2,1,'2025-06-12',5),(3,1,'2025-06-12',4),(4,1,'2025-06-13',4),(5,1,'2025-06-13',4),(6,1,'2025-06-17',5),(7,1,'2025-06-17',4),(8,1,'2025-06-17',5),(9,1,'2025-06-18',4),(10,1,'2025-06-18',3),(11,1,'2025-06-19',4),(12,1,'2025-06-19',4),(13,1,'2025-06-19',4),(14,1,'2025-06-20',4),(15,1,'2025-06-20',4),(16,1,'2025-06-23',4),(17,1,'2025-06-23',4),(18,1,'2025-06-24',4),(19,1,'2025-06-24',4),(20,1,'2025-06-25',4),(21,1,'2025-06-25',4),(22,1,'2025-06-26',4),(23,1,'2025-06-26',4),(24,1,'2025-06-27',4),(25,1,'2025-06-27',4),(26,1,'2025-06-30',4),(27,1,'2025-07-01',4),(28,1,'2025-07-02',4),(29,2,'2025-07-03',4),(30,2,'2025-07-03',4),(31,2,'2025-07-04',4),(32,2,'2025-07-04',4),(33,2,'2025-07-04',4),(34,2,'2025-07-07',4),(35,2,'2025-07-07',4),(36,2,'2025-07-08',4),(37,2,'2025-07-08',4),(38,2,'2025-07-09',4),(39,2,'2025-07-09',4),(40,2,'2025-07-10',4),(41,2,'2025-07-10',4),(42,2,'2025-07-11',4),(43,2,'2025-07-11',4),(44,2,'2025-07-14',4),(45,2,'2025-07-14',4),(46,2,'2025-07-15',4),(47,2,'2025-07-15',4),(48,2,'2025-07-16',4),(49,2,'2025-07-16',4),(50,2,'2025-07-17',4),(51,2,'2025-07-17',4),(52,2,'2025-07-18',4),(53,2,'2025-07-18',4),(54,2,'2025-07-21',4),(55,2,'2025-07-21',4),(56,2,'2025-07-22',4),(57,2,'2025-07-22',4),(58,2,'2025-07-23',4),(59,2,'2025-07-23',4),(60,2,'2025-07-24',4),(61,2,'2025-07-24',4),(62,2,'2025-07-25',4),(63,2,'2025-07-25',4),(64,2,'2025-08-29',4),(65,2,'2025-08-29',4),(66,2,'2025-08-29',3),(67,2,'2025-08-29',4),(68,2,'2025-08-29',4),(69,2,'2025-08-29',4),(70,2,'2025-08-29',3),(71,2,'2025-09-01',3),(72,2,'2025-09-24',3),(73,2,'2025-09-25',3)
) as v(legacy_id,season_no,played_at,player_count)
join public.seasons s on s.name='Temporada '||v.season_no
on conflict(legacy_id) do update set season_id=excluded.season_id,played_at=excluded.played_at,player_count=excluded.player_count;

-- Results are loaded from the workbook's Detalle sheet. To keep this file compact and maintainable,
-- the app's importer can also be used for future spreadsheets; the current historical rows are preserved in the workbook.
commit;
