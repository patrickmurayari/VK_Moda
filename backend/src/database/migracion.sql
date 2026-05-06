-- ============================================================
-- Migración: Imágenes estáticas → PostgreSQL
-- Proyecto: V&A Diseño y Moda
-- ============================================================

-- 1. Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id            SERIAL PRIMARY KEY,
    slug          VARCHAR(50) UNIQUE NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    imagen_url    TEXT NOT NULL,
    orden         INTEGER DEFAULT 0,
    activa        BOOLEAN DEFAULT true,
    creada_en     TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id            SERIAL PRIMARY KEY,
    categoria_id  INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    nombre        VARCHAR(200) NOT NULL,
    precio        INTEGER,
    imagen_url    TEXT NOT NULL,
    colores       INTEGER,
    descripcion   TEXT,
    orden         INTEGER DEFAULT 0,
    activo        BOOLEAN DEFAULT true,
    creado_en     TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla de contenido web (hero, colección, editorial, inspiración, quiénes somos)
CREATE TABLE IF NOT EXISTS contenido_web (
    id            SERIAL PRIMARY KEY,
    seccion       VARCHAR(50) NOT NULL,
    posicion      VARCHAR(50),
    titulo        VARCHAR(200),
    subtitulo     VARCHAR(300),
    imagen_url    TEXT NOT NULL,
    orden         INTEGER DEFAULT 0,
    activo        BOOLEAN DEFAULT true,
    creado_en     TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ----------------------------------------------------------
-- CATEGORÍAS (5)
-- ----------------------------------------------------------
INSERT INTO categorias (slug, nombre, imagen_url, orden) VALUES
('vestidos',     'VESTIDOS',            '/img/Categoria/fotovestido1.jpg',       1),
('bolsos',       'BOLSOS',              '/img/Categoria/bolsofoto11.jpg',        2),
('indumentaria', 'INDUMENTARIA',        '/img/Categoria/ropapersonalizada1.jpg', 3),
('joyeria',      'JOYERIA',             '/img/Categoria/fotojoyas.jpg',          4),
('hombre',       'INDUMENTARIA HOMBRE', '/img/Categoria/hombrefoto111.png',      5);

-- ----------------------------------------------------------
-- PRODUCTOS — BOLSOS (12)
-- ----------------------------------------------------------
INSERT INTO productos (categoria_id, nombre, precio, imagen_url, orden) VALUES
(2, 'Bolso negro con stras',                       17000, '/img/Productos/bolsos/bolso1.jpg',   1),
(2, 'Bolso azul marino',                           15000, '/img/Productos/bolsos/bolso2.jpg',   2),
(2, 'Bolso marrón clásico',                        14000, '/img/Productos/bolsos/bolso3.jpg',   3),
(2, 'About eco cuero con tirantes dorados',        12000, '/img/Productos/bolsos/bolso4.jpg',   4),
(2, 'Mini bag con stras incrustadas',              12000, '/img/Productos/bolsos/bolso5.jpg',   5),
(2, 'Small bag con tirantes de piel',              15000, '/img/Productos/bolsos/bolso6.jpg',   6),
(2, 'Small bag color rosa pálido',                 13000, '/img/Productos/bolsos/bolso7.jpg',   7),
(2, 'Bolso negro elegante',                        16000, '/img/Productos/bolsos/bolso8.jpg',   8),
(2, 'Bolso deportivo',                             11000, '/img/Productos/bolsos/bolso9.jpg',   9),
(2, 'Mini bag',                                    10000, '/img/Productos/bolsos/bolso10.jpg', 10),
(2, 'Billetera de cuero',                           7000, '/img/Productos/bolsos/cartera1.jpg', 11),
(2, 'Billetera compacta',                            5500, '/img/Productos/bolsos/cartera2.jpg', 12);

-- PRODUCTOS — INDUMENTARIA (11)
INSERT INTO productos (categoria_id, nombre, precio, imagen_url, orden) VALUES
(3, 'Camisola negra',      12000, '/img/Productos/indumentaria/indumentaria1.jpg',  1),
(3, 'Blusa blanca',        10000, '/img/Productos/indumentaria/indumentaria2.jpg',  2),
(3, 'Top crop con brillos',10000, '/img/Productos/indumentaria/indumentaria3.jpg',  3),
(3, 'Top negro',            7000, '/img/Productos/indumentaria/indumentaria4.jpg',  4),
(3, 'Blusa con moño',     10000, '/img/Productos/indumentaria/indumentaria5.jpg',  5),
(3, 'Camiseta básica',     8000, '/img/Productos/indumentaria/indumentaria6.jpg',  6),
(3, 'Blusa elegante',     12000, '/img/Productos/indumentaria/indumentaria7.jpg',  7),
(3, 'Top deportivo',       9000, '/img/Productos/indumentaria/indumentaria8.jpg',  8),
(3, 'Camiseta estampada',  8500, '/img/Productos/indumentaria/indumentaria10.jpg', 9),
(3, 'Blusa de lino',      11000, '/img/Productos/indumentaria/indumentaria11.jpg', 10),
(3, 'Top de seda',        13000, '/img/Productos/indumentaria/indumentaria12.jpg', 11);

-- PRODUCTOS — VESTIDOS (6)
INSERT INTO productos (categoria_id, nombre, precio, imagen_url, orden) VALUES
(1, 'Vestido estampado con largo simétrico',     15000, '/img/Productos/vestidos/vestido2.jpg',  1),
(1, 'Vestido rojo de seda fría',                 18000, '/img/Productos/vestidos/vestido1.jpg',  2),
(1, 'Vestido rosa pálido',                       15000, '/img/Productos/vestidos/vestido3.jpg',  3),
(1, 'Vestido simétrico negro',                   18000, '/img/Productos/vestidos/vestido5.jpg',  4),
(1, 'Top rojo de encaje con breteles',           18000, '/img/Productos/vestidos/vestido8.jpeg', 5),
(1, 'Vestido midi animal print combinado',       18000, '/img/Productos/vestidos/vestido9.jpeg', 6);

-- PRODUCTOS — JOYERÍA (11)
INSERT INTO productos (categoria_id, nombre, precio, imagen_url, orden) VALUES
(4, 'Collar con colgante',                              5000, '/img/Productos/joyas/joya1.jpg',   1),
(4, 'Collar elegante',                                  6000, '/img/Productos/joyas/joya2.jpg',   2),
(4, 'Collar de perlas',                                 7000, '/img/Productos/joyas/joya3.jpg',   3),
(4, 'Collar dorado',                                    5500, '/img/Productos/joyas/joya4.jpg',   4),
(4, 'Colgante de cristal',                              4500, '/img/Productos/joyas/joya5.jpg',   5),
(4, 'Collar plateado',                                  6500, '/img/Productos/joyas/joya6.jpg',   6),
(4, 'Collar de moda',                                   5800, '/img/Productos/joyas/joya7.jpg',   7),
(4, 'Aros dorados texturados con detalle triangular',   5800, '/img/Productos/joyas/joya8.jpeg',  8),
(4, 'Aros argolla dorados con flor animal print',        5800, '/img/Productos/joyas/joya9.jpeg',  9),
(4, 'Aros flor de resina ámbar con base dorada',         5800, '/img/Productos/joyas/joya10.jpeg', 10),
(4, 'Aros con argollas doradas y flores de resina ámbar',5800, '/img/Productos/joyas/joya11.jpeg', 11);

-- PRODUCTOS — HOMBRE (2)
INSERT INTO productos (categoria_id, nombre, precio, imagen_url, orden) VALUES
(5, 'Camisa polo celeste cuello mao', 18000, '/img/Productos/hombre/homvbre1.jpeg', 1),
(5, 'Remera roja estampada',          18000, '/img/Productos/hombre/hombre2.jpeg',  2);

-- ----------------------------------------------------------
-- CONTENIDO WEB — HERO (3 slides)
-- ----------------------------------------------------------
INSERT INTO contenido_web (seccion, posicion, titulo, subtitulo, imagen_url, orden) VALUES
('hero', 'slide', 'Indumentaria y estilo para todos los días',     'Prendas seleccionadas y confecciones con detalle para que te sientas única',        '/img/Carrousel/foto111.jpg',  1),
('hero', 'slide', 'Arreglos y ajustes de todo tipo de prendas',    'Dobladillos, entalles, cierres y reparaciones: dejá tu ropa como nueva',           '/img/Carrousel/foto311.png',  2),
('hero', 'slide', 'Confección a medida',                           'Diseñamos y confeccionamos según tu idea, tu cuerpo y tu ocasión',                 '/img/Carrousel/foto211.jpg',  3);

-- CONTENIDO WEB — COLECCIÓN (5 slides)
INSERT INTO contenido_web (seccion, posicion, titulo, subtitulo, imagen_url, orden) VALUES
('coleccion', 'slide', 'Nueva Colección 2026',       'Estilo actual, detalles que enamoran',           '/img/Coleccion/coleccionPic1.jpg',   1),
('coleccion', 'slide', 'Colección Primavera',         'Descubre las nuevas tendencias',                 '/img/Coleccion/coleccionPic111.jpg', 2),
('coleccion', 'slide', 'Looks listos para salir',     'Combinaciones que realzan tu silueta',           '/img/Coleccion/coleccionPic2.jpg',   3),
('coleccion', 'slide', 'Diseño Exclusivo',            'Piezas únicas y elegantes',                      '/img/Coleccion/coleccionPic21.jpg',  4),
('coleccion', 'slide', 'Moda Contemporánea',          'Estilo y sofisticación',                         '/img/Coleccion/coleccionPic23.jpg',  5);

-- CONTENIDO WEB — EDITORIAL (4 imágenes)
INSERT INTO contenido_web (seccion, posicion, titulo, subtitulo, imagen_url, orden) VALUES
('editorial', 'principal-izquierda',  NULL, NULL, '/img/Otros/otro7.jpg', 1),
('editorial', 'detalle-izquierda',    NULL, NULL, '/img/Otros/otro8.jpg', 2),
('editorial', 'principal-derecha',    NULL, NULL, '/img/Otros/otro9.jpg', 3),
('editorial', 'detalle-derecha',      NULL, NULL, '/img/Otros/otro2.jpg', 4);

-- CONTENIDO WEB — INSPIRACIÓN (2 imágenes)
INSERT INTO contenido_web (seccion, posicion, titulo, subtitulo, imagen_url, orden) VALUES
('inspiracion', 'izquierda', 'Looks urbanos',  'Prendas para todos los días con caída, comodidad y un toque de diseño.', '/img/Otros/otro6.jpg', 1),
('inspiracion', 'derecha',   'A medida',       'Ajustes, arreglos y confección para que te quede perfecto.',              '/img/Otros/otro4.jpg', 2);

-- CONTENIDO WEB — QUIÉNES SOMOS (2 imágenes)
INSERT INTO contenido_web (seccion, posicion, titulo, subtitulo, imagen_url, orden) VALUES
('quienes_somos', 'izquierda', NULL, NULL, '/img/fotoabout11.jpg', 1),
('quienes_somos', 'derecha',   NULL, NULL, '/img/about1.jpg',      2);
