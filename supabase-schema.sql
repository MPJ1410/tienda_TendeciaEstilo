-- =====================================================
-- SCHEMA DE BASE DE DATOS PARA TENDENCIA Y ESTILO
-- =====================================================
-- Copia y pega este código completo en el SQL Editor de Supabase

-- =====================================================
-- TABLA DE PRODUCTOS
-- =====================================================
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('mujer', 'hombre')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors TEXT[] NOT NULL DEFAULT '{}',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- =====================================================
-- TABLA DE CATEGORÍAS (Opcional)
-- =====================================================
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar categorías por defecto
INSERT INTO categories (name, slug, description) VALUES
    ('Mujer', 'mujer', 'Moda femenina elegante y moderna'),
    ('Hombre', 'hombre', 'Moda masculina sofisticada y cómoda');

-- =====================================================
-- FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS en products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de productos
CREATE POLICY "Productos visibles públicamente"
    ON products FOR SELECT
    USING (true);

-- Permitir inserción solo a usuarios autenticados
CREATE POLICY "Solo usuarios autenticados pueden insertar productos"
    ON products FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Permitir actualización solo a usuarios autenticados
CREATE POLICY "Solo usuarios autenticados pueden actualizar productos"
    ON products FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Permitir eliminación solo a usuarios autenticados
CREATE POLICY "Solo usuarios autenticados pueden eliminar productos"
    ON products FOR DELETE
    USING (auth.role() = 'authenticated');

-- Habilitar RLS en categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de categorías
CREATE POLICY "Categorías visibles públicamente"
    ON categories FOR SELECT
    USING (true);

-- =====================================================
-- INSERTAR PRODUCTOS DE EJEMPLO
-- =====================================================
INSERT INTO products (name, category, price, sizes, colors, stock, description, images) VALUES
(
    'Vestido Elegante Floral',
    'mujer',
    89.99,
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Rosa', 'Azul', 'Blanco'],
    15,
    'Hermoso vestido con estampado floral, perfecto para ocasiones especiales. Confeccionado en tela de alta calidad con caída elegante.',
    ARRAY['assets/product-1.jpg']
),
(
    'Blusa Casual Moderna',
    'mujer',
    45.99,
    ARRAY['S', 'M', 'L'],
    ARRAY['Blanco', 'Negro', 'Beige'],
    20,
    'Blusa versátil y cómoda para el día a día. Diseño moderno que combina con cualquier outfit.',
    ARRAY['assets/product-2.jpg']
),
(
    'Pantalón de Vestir',
    'mujer',
    65.99,
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Negro', 'Gris', 'Azul Marino'],
    12,
    'Pantalón de corte elegante ideal para el trabajo o eventos formales. Tela de alta calidad con excelente caída.',
    ARRAY['assets/product-3.jpg']
),
(
    'Camisa Formal Premium',
    'hombre',
    55.99,
    ARRAY['M', 'L', 'XL', 'XXL'],
    ARRAY['Blanco', 'Celeste', 'Gris'],
    18,
    'Camisa de vestir en algodón premium. Perfecta para el trabajo o eventos formales.',
    ARRAY['assets/product-4.jpg']
),
(
    'Polo Casual Deportivo',
    'hombre',
    35.99,
    ARRAY['M', 'L', 'XL'],
    ARRAY['Negro', 'Azul', 'Rojo', 'Verde'],
    25,
    'Polo cómodo y versátil para uso diario. Tela transpirable de alta calidad.',
    ARRAY['assets/product-5.jpg']
),
(
    'Jean Clásico',
    'hombre',
    75.99,
    ARRAY['30', '32', '34', '36'],
    ARRAY['Azul', 'Negro', 'Gris'],
    16,
    'Jean de corte clásico en denim de alta calidad. Resistente y cómodo para uso diario.',
    ARRAY['assets/product-6.jpg']
),
(
    'Conjunto Deportivo',
    'mujer',
    95.99,
    ARRAY['S', 'M', 'L'],
    ARRAY['Negro', 'Rosa', 'Morado'],
    10,
    'Conjunto deportivo moderno y cómodo. Ideal para ejercicio o uso casual.',
    ARRAY['assets/product-7.jpg']
),
(
    'Chaqueta Casual',
    'hombre',
    120.99,
    ARRAY['M', 'L', 'XL'],
    ARRAY['Negro', 'Azul Marino', 'Café'],
    8,
    'Chaqueta versátil para cualquier ocasión. Diseño moderno con excelente calidad.',
    ARRAY['assets/product-8.jpg']
);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Después de ejecutar este script, verifica:
-- 1. Tabla 'products' creada con 8 productos
-- 2. Tabla 'categories' creada con 2 categorías
-- 3. Políticas de seguridad habilitadas
-- 4. Triggers funcionando correctamente
