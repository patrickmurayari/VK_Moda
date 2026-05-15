-- ============================================================
-- Migración: Sistema de Gestión de Pedidos
-- Proyecto: V&A Diseño y Moda
-- Modelo: Header-Detail (pedidos → items_pedido)
-- ============================================================

-- ----------------------------------------------------------
-- CLIENTES
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(150) NOT NULL,
    apellido        VARCHAR(150) NOT NULL,
    email           VARCHAR(255),
    telefono        VARCHAR(50),
    dni             VARCHAR(20),
    direccion       TEXT,
    notas           TEXT,
    creado_en       TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre_apellido ON clientes(nombre, apellido);

-- ----------------------------------------------------------
-- HISTORIAL DE MEDIDAS (JSONB evolutivo)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS historial_medidas (
    id              SERIAL PRIMARY KEY,
    cliente_id      INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    medidas         JSONB NOT NULL,
    fuente          VARCHAR(50) DEFAULT 'primera_toma',  -- primera_toma, ajuste, re_toma
    notas           TEXT,
    creado_en       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_medidas_cliente ON historial_medidas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_historial_medidas_creado ON historial_medidas(cliente_id, creado_en DESC);

-- ----------------------------------------------------------
-- PEDIDOS (Header)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id              SERIAL PRIMARY KEY,
    cliente_id      INT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    estado          VARCHAR(30) NOT NULL DEFAULT 'recibido',
    -- Estados: recibido, en_proceso, en_prueba, terminado, entregado, cancelado
    prioridad       VARCHAR(20) DEFAULT 'normal',
    -- Prioridades: baja, normal, urgente
    fecha_entrega   DATE,
    notas           TEXT,
    total           DECIMAL(12,2) DEFAULT 0,
    creado_en       TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_entrega);

-- ----------------------------------------------------------
-- ITEMS_PEDIDO (Detail)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS items_pedido (
    id              SERIAL PRIMARY KEY,
    pedido_id       INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    categoria_id    INT REFERENCES categorias(id) ON DELETE SET NULL,
    nombre_prenda   VARCHAR(200) NOT NULL,
    descripcion     TEXT,
    precio          DECIMAL(12,2) NOT NULL CHECK (precio > 0),
    estado          VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    -- Estados: pendiente, cortado, en_confeccion, en_prueba, terminado, entregado
    item_padre_id   INT REFERENCES items_pedido(id) ON DELETE SET NULL,
    -- item_padre_id: referencia al ítem original en caso de re-trabajo/modificación
    medidas_json    JSONB,
    -- Medidas específicas de esta prenda (copia snapshot del historial)
    creado_en       TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_pedido_pedido ON items_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_items_pedido_estado ON items_pedido(estado);
CREATE INDEX IF NOT EXISTS idx_items_pedido_padre ON items_pedido(item_padre_id);

-- ----------------------------------------------------------
-- SESIONES DE PRUEBA
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS sesiones_prueba (
    id              SERIAL PRIMARY KEY,
    pedido_id       INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    item_id         INT REFERENCES items_pedido(id) ON DELETE CASCADE,
    fecha_hora      TIMESTAMPTZ NOT NULL,
    estado          VARCHAR(30) DEFAULT 'programada',
    -- Estados: programada, confirmada, realizada, cancelada
    resultado       TEXT,
    -- Resultado: ajuste_needed, aprobado, rechazado
    notas           TEXT,
    creado_en       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sesiones_pedido ON sesiones_prueba(pedido_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones_prueba(fecha_hora);

-- ----------------------------------------------------------
-- TRIGGER: actualizar actualizado_en automáticamente
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pedidos_timestamp ON pedidos;
CREATE TRIGGER trg_pedidos_timestamp
    BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_items_timestamp ON items_pedido;
CREATE TRIGGER trg_items_timestamp
    BEFORE UPDATE ON items_pedido
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_clientes_timestamp ON clientes;
CREATE TRIGGER trg_clientes_timestamp
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
