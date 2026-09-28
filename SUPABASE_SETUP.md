# Configurar CATAN AMIGOS

La web usa Supabase para compartir partidas entre todos los móviles. La **Publishable Key** puede vivir en el frontend; la seguridad depende de RLS y de las funciones validadas. Nunca uses una `sb_secret_...` ni una `service_role` en este repositorio.

## 1. Crear la base de datos

1. Abre tu proyecto de Supabase.
2. Ve a **SQL Editor**.
3. Crea una consulta nueva.
4. Abre `supabase/schema.sql` en este repositorio.
5. Copia todo el contenido y ejecútalo.
6. Recarga CATAN AMIGOS.

El esquema crea:

- temporadas y jugadores
- partidas y resultados por jugador
- puntos de victoria del juego
- Score Amigos calculado centralmente
- ranking por Score Amigos promedio, igual que el Excel histórico
- victorias, últimos puestos, porcentajes y posición media
- clasificación de temporada y clasificación histórica
- registro atómico de partidas
- función segura para importar partidas con su ID histórico
- RLS y permisos mínimos para el frontend público

## 2. Importar el Excel histórico

No hace falta convertir el Excel a SQL.

En CATAN AMIGOS ve a **Más → Importar Excel** y selecciona vuestro `CATAN Stats 2025.xlsx`.

El importador reconoce las hojas `Partidas` y `Detalle` y conserva:

- Temporadas
- ID de partida
- Fecha
- Número de jugadores
- Jugador
- Puesto final
- Puntos de victoria

La importación usa el ID histórico de partida, por lo que repetir el mismo Excel no debería crear partidas duplicadas.

## Seguridad

El repositorio es público y la Publishable Key será visible en el navegador. Eso es normal en una aplicación frontend de Supabase. La Publishable Key no sustituye a RLS: las tablas deben mantener RLS habilitado y las escrituras de partidas pasan por funciones validadas.

Nunca publiques una `sb_secret_...` o una antigua `service_role`.
