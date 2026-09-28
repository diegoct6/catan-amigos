# Configurar CATAN AMIGOS

La web usa Supabase para compartir partidas. La **Publishable Key** puede vivir en el frontend; la seguridad depende de RLS y de las funciones validadas. Nunca publiques una `sb_secret_...` ni una clave `service_role` en este repositorio.

## 1. Crear o actualizar la base de datos

1. Abre el proyecto de Supabase y ve a **SQL Editor**.
2. Ejecuta `supabase/schema.sql`.
3. Recarga CATAN AMIGOS.

El esquema contiene temporadas, jugadores, partidas, resultados, PV de CATAN, Score Amigos y vistas de clasificación. Las nuevas partidas se registran desde la web.

## 2. Datos históricos

El histórico se carga una sola vez desde `supabase/seed-history.sql`; no hay importador de Excel en la web. El script reconoce las temporadas 1 y 2 y las 73 partidas. Su operación de conflicto usa el índice único parcial de `games.legacy_id`, y su comprobación final exige 73 partidas y 258 resultados sin borrar resultados existentes.

**El archivo SQL del repositorio todavía no contiene las 258 filas de resultados. No lo ejecutes para cargar el histórico hasta completar y contrastar esas filas con `CATAN Stats 2025.xlsx`.** La fuente Excel no está disponible en esta conversación, por lo que la carga y validación del histórico están pendientes.

## Seguridad

La Publishable Key es visible en el navegador; eso es normal en una aplicación frontend de Supabase. Mantén RLS habilitado y las escrituras de partidas mediante funciones validadas. Nunca publiques una `sb_secret_...` ni una clave antigua `service_role`.
