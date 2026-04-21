-- =========================================
-- V001__catalogos_base.sql
-- Creación de catálogos y relaciones base
-- =========================================

-- =========================
-- TABLA: MARCA
-- =========================
CREATE TABLE IF NOT EXISTS marca (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================
-- TABLA: CATEGORIA
-- =========================
CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================
-- TABLA: TIPO_FUNDA
-- =========================
CREATE TABLE IF NOT EXISTS tipo_funda (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================
-- TABLA: GENERO
-- =========================
CREATE TABLE IF NOT EXISTS genero (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================
-- TABLA: MODELO
-- =========================
CREATE TABLE IF NOT EXISTS modelo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_modelo_marca
        FOREIGN KEY (marca_id)
        REFERENCES marca (id)
);

-- Índice para evitar duplicados por marca
CREATE UNIQUE INDEX IF NOT EXISTS uq_modelo_nombre_marca
    ON modelo (LOWER(nombre), marca_id);

-- =========================
-- ALTER TABLE: PRODUCTO
-- =========================

-- Columnas nuevas (seguras de ejecutar varias veces)
ALTER TABLE producto ADD COLUMN IF NOT EXISTS categoria_id INTEGER;
ALTER TABLE producto ADD COLUMN IF NOT EXISTS marca_id INTEGER;
ALTER TABLE producto ADD COLUMN IF NOT EXISTS modelo_id INTEGER;
ALTER TABLE producto ADD COLUMN IF NOT EXISTS tipo_funda_id INTEGER;
ALTER TABLE producto ADD COLUMN IF NOT EXISTS genero_id INTEGER;

-- =========================
-- FOREIGN KEYS (ejecutar una sola vez)
-- =========================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_producto_categoria'
    ) THEN
        ALTER TABLE producto
        ADD CONSTRAINT fk_producto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria (id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_producto_marca'
    ) THEN
        ALTER TABLE producto
        ADD CONSTRAINT fk_producto_marca
        FOREIGN KEY (marca_id)
        REFERENCES marca (id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_producto_modelo'
    ) THEN
        ALTER TABLE producto
        ADD CONSTRAINT fk_producto_modelo
        FOREIGN KEY (modelo_id)
        REFERENCES modelo (id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_producto_tipo_funda'
    ) THEN
        ALTER TABLE producto
        ADD CONSTRAINT fk_producto_tipo_funda
        FOREIGN KEY (tipo_funda_id)
        REFERENCES tipo_funda (id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_producto_genero'
    ) THEN
        ALTER TABLE producto
        ADD CONSTRAINT fk_producto_genero
        FOREIGN KEY (genero_id)
        REFERENCES genero (id);
    END IF;
END $$;