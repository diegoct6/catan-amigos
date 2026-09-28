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

-- Games 1-73 are imported from the Partidas sheet.
