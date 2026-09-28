# Configurar la base de datos de CATAN AMIGOS

La web ya está conectada al proyecto Supabase mediante la **Publishable Key**. Esa clave puede vivir en el frontend; la seguridad depende de RLS y de los permisos de la base de datos. No uses nunca una `sb_secret_...` en este repositorio.

## Un único paso inicial

1. Abre el proyecto de Supabase.
2. Ve a **SQL Editor**.
3. Crea una nueva consulta.
4. Abre `supabase/schema.sql` de este repositorio y copia todo su contenido.
5. Ejecuta el SQL.
6. Vuelve a la web y pulsa **Actualizar**.

El script crea:

- temporadas
- jugadores
- partidas
- resultados por jugador
- cálculo centralizado de Score Amigos
- función atómica para registrar partidas
- RLS y permisos para el frontend público
- `Temporada 2026` si todavía no existe ninguna temporada

## Después

Añade los jugadores reales desde **Ranking → + Jugador**. Después podremos importar el histórico del Excel sin introducir las partidas una por una.

## Seguridad

El repositorio es público y la Publishable Key también será visible en el navegador. Esto es normal para una aplicación frontend de Supabase. La clave no es un secreto; RLS debe ser quien limite el acceso. Nunca pongas en el repositorio una `sb_secret_...` o una antigua `service_role`.
