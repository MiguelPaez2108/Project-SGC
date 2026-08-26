-- ============================================================
-- Project SGC — SQL para ejecutar en Supabase SQL Editor
-- Secciones:
--   1. Extension btree_gist (necesaria para exclusion constraint)
--   2. Exclusion constraint anti-solapamiento de reservas
--   3. Helper function get_user_rol()
--   4. RLS policies para todas las tablas
-- ============================================================

-- ============================================================
-- 1. Extensión btree_gist (si no está activa)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- 2. Constraint de exclusión — evita doble-reserva incluso
--    con condiciones de carrera concurrentes (race conditions).
--    Si la validacion en la app falla, Postgres la bloquea igual.
-- ============================================================
ALTER TABLE reservas
  ADD CONSTRAINT no_solapamiento_reservas
  EXCLUDE USING gist (
    cancha_id WITH =,
    fecha WITH =,
    tsrange(
      (fecha || ' ' || hora_inicio)::timestamp,
      (fecha || ' ' || hora_fin)::timestamp
    ) WITH &&
  )
  WHERE (estado <> 'cancelada');

-- ============================================================
-- 3. Helper: obtener el rol del usuario autenticado actual
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS text AS 
  SELECT rol FROM usuarios WHERE id = auth.uid()
 LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- 4. Habilitar RLS en todas las tablas
-- ============================================================
ALTER TABLE usuarios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE canchas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantenimiento  ENABLE ROW LEVEL SECURITY;
ALTER TABLE franjas_horarias ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. Policies — USUARIOS
-- ============================================================

-- Staff (admin y recepcionista) puede leer todos los usuarios
CREATE POLICY "staff_select_usuarios" ON usuarios
  FOR SELECT USING (get_user_rol() IN ('admin', 'recepcionista'));

-- Cada usuario puede leer y actualizar su propio perfil
CREATE POLICY "self_select_usuario" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "self_update_usuario" ON usuarios
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Solo admin puede insertar usuarios (alta manual) o cambiar roles
CREATE POLICY "admin_insert_usuarios" ON usuarios
  FOR INSERT WITH CHECK (get_user_rol() = 'admin');

CREATE POLICY "admin_update_usuarios" ON usuarios
  FOR UPDATE USING (get_user_rol() = 'admin');

-- ============================================================
-- 6. Policies — CANCHAS
-- ============================================================

-- Cualquier usuario autenticado puede ver canchas
CREATE POLICY "auth_select_canchas" ON canchas
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo admin puede crear, editar o eliminar canchas
CREATE POLICY "admin_insert_canchas" ON canchas
  FOR INSERT WITH CHECK (get_user_rol() = 'admin');

CREATE POLICY "admin_update_canchas" ON canchas
  FOR UPDATE USING (get_user_rol() = 'admin');

CREATE POLICY "admin_delete_canchas" ON canchas
  FOR DELETE USING (get_user_rol() = 'admin');

-- ============================================================
-- 7. Policies — RESERVAS
-- ============================================================

-- Staff ve todas las reservas
CREATE POLICY "staff_select_reservas" ON reservas
  FOR SELECT USING (get_user_rol() IN ('admin', 'recepcionista'));

-- Cliente ve solo sus propias reservas
CREATE POLICY "cliente_select_reservas" ON reservas
  FOR SELECT USING (auth.uid() = usuario_id);

-- Staff puede crear reservas
CREATE POLICY "staff_insert_reservas" ON reservas
  FOR INSERT WITH CHECK (get_user_rol() IN ('admin', 'recepcionista'));

-- Staff puede actualizar estado de reservas
CREATE POLICY "staff_update_reservas" ON reservas
  FOR UPDATE USING (get_user_rol() IN ('admin', 'recepcionista'));

-- Solo admin puede eliminar reservas
CREATE POLICY "admin_delete_reservas" ON reservas
  FOR DELETE USING (get_user_rol() = 'admin');

-- ============================================================
-- 8. Policies — PAGOS
-- ============================================================

-- Admin ve todos los pagos
CREATE POLICY "admin_select_pagos" ON pagos
  FOR SELECT USING (get_user_rol() = 'admin');

-- Cada usuario ve sus propios pagos
CREATE POLICY "self_select_pagos" ON pagos
  FOR SELECT USING (auth.uid() = usuario_id);

-- Solo admin puede insertar/actualizar pagos
CREATE POLICY "admin_all_pagos" ON pagos
  FOR ALL USING (get_user_rol() = 'admin');

-- ============================================================
-- 9. Policies — NOTIFICACIONES
-- ============================================================

-- Cada usuario ve y actualiza solo sus notificaciones
CREATE POLICY "self_select_notificaciones" ON notificaciones
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "self_update_notificaciones" ON notificaciones
  FOR UPDATE USING (auth.uid() = usuario_id);

-- Admin puede insertar notificaciones para cualquier usuario
CREATE POLICY "admin_insert_notificaciones" ON notificaciones
  FOR INSERT WITH CHECK (get_user_rol() = 'admin');

-- ============================================================
-- 10. Policies — MANTENIMIENTO
-- ============================================================

-- Admin tiene acceso total a mantenimiento
CREATE POLICY "admin_all_mantenimiento" ON mantenimiento
  FOR ALL USING (get_user_rol() = 'admin');

-- Recepcionista puede ver mantenimiento (para saber si una cancha está fuera de servicio)
CREATE POLICY "recepcionista_select_mantenimiento" ON mantenimiento
  FOR SELECT USING (get_user_rol() = 'recepcionista');

-- ============================================================
-- 11. Policies — FRANJAS HORARIAS
-- ============================================================

-- Cualquier usuario autenticado puede ver franjas horarias
CREATE POLICY "auth_select_franjas" ON franjas_horarias
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo admin puede gestionar franjas horarias
CREATE POLICY "admin_all_franjas" ON franjas_horarias
  FOR ALL USING (get_user_rol() = 'admin');
