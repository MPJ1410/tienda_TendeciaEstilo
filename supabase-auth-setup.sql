-- =====================================================
-- CONFIGURACIÓN DE AUTENTICACIÓN Y SEGURIDAD
-- =====================================================

-- 1. Asegurar que RLS esté habilitado
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas
DROP POLICY IF EXISTS "Solo usuarios autenticados pueden insertar productos" ON products;
DROP POLICY IF EXISTS "Solo usuarios autenticados pueden actualizar productos" ON products;
DROP POLICY IF EXISTS "Solo usuarios autenticados pueden eliminar productos" ON products;
DROP POLICY IF EXISTS "Productos visibles públicamente" ON products;

-- 3. Crear políticas nuevas
-- Permitir lectura pública (cualquiera puede ver productos)
CREATE POLICY "Lectura pública de productos"
    ON products FOR SELECT
    USING (true);

-- Solo usuarios autenticados pueden insertar
CREATE POLICY "Inserción solo para autenticados"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Solo usuarios autenticados pueden actualizar
CREATE POLICY "Actualización solo para autenticados"
    ON products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Solo usuarios autenticados pueden eliminar
CREATE POLICY "Eliminación solo para autenticados"
    ON products FOR DELETE
    TO authenticated
    USING (true);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Después de ejecutar este script:
-- 1. Cualquiera puede VER productos (lectura pública)
-- 2. Solo usuarios autenticados pueden AGREGAR/EDITAR/ELIMINAR
