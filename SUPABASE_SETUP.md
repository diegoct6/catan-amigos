# Configurar CATAN AMIGOS

La web usa Supabase para compartir partidas. La **Publishable Key** puede vivir en el frontend; la seguridad depende de RLS y de las funciones validadas. Nunca publiques una `sb_secret_...` ni una clave `service_role` en este repositorio.

## 1. Crear o actualizar la base de datos

1. Abre el proyecto de Supabase y ve a **SQL Editor**.
2. Ejecuta `supabase/schema.sql` para crear o actualizar el esquema.
3. Recarga CATAN AMIGOS.

El esquema contiene temporadas, jugadores, partidas, resultados, Puntos de Victoria de CATAN, Score Amigos y vistas de clasificación. Las nuevas partidas se registran desde la web.

## 2. Cargar el histórico

Ejecuta `supabase/seed-history.sql` una vez en **SQL Editor**. El script puede repetirse: actualiza las partidas históricas por su `legacy_id` y reconstruye sus resultados de forma atómica. Carga las Temporadas 1 y 2, 73 partidas y 258 resultados desde el Excel. No hay importador de Excel en la web.

El script incluye una comprobación que cancela la transacción si no encuentra las 73 partidas y los 258 resultados cargados. La clasificación ordena por Score Amigos promedio; los PV de CATAN se conservan como una estadística separada.

## Seguridad

La Publishable Key es visible en el navegador; eso es normal en una aplicación frontend de Supabase. Mantén RLS habilitado y las escrituras de partidas mediante funciones validadas. Nunca publiques una `sb_secret_...` ni una clave antigua `service_role`.
