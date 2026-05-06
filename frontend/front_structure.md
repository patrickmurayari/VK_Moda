# Radiografía Técnica del Frontend — V&A Diseño y Moda

> Documento generado para planificar la migración de imágenes estáticas a PostgreSQL.

---

## 1. Árbol de Directorios

```
frontend/
├── .eslintrc.cjs
├── .gitignore
├── README.md
├── index.html
├── logoVK.png
├── package.json
├── package-lock.json
├── postcss.config.js
├── start-dev.bat
├── tailwind.config.js
├── test.js
├── vite.config.js
├── public/
│   ├── _redirects
│   └── logov.jpeg                          ← Logo navbar (referenciado como /logov.jpeg)
└── src/
    ├── App.css
    ├── App.jsx                              ← Router principal
    ├── main.jsx                             ← Entry point
    ├── components/
    │   ├── Categorias/
    │   │   ├── Bolsos.jsx                   ← Wrapper → CategoriaTemplate
    │   │   ├── CategoriaTemplate.jsx        ← Template reutilizable
    │   │   ├── Hombre.jsx                   ← Wrapper → CategoriaTemplate
    │   │   ├── Indumentaria.jsx             ← Wrapper → CategoriaTemplate
    │   │   ├── Joyeria.jsx                  ← Wrapper → CategoriaTemplate
    │   │   └── Vestidos.jsx                 ← Wrapper → CategoriaTemplate
    │   ├── common/
    │   │   ├── CardCategoria.jsx            ← Card para sección categorías (home)
    │   │   ├── CarrouselSwip.jsx            ← Swiper colección (home)
    │   │   ├── GaleriaProductos.jsx         ← Grid + Modal de productos
    │   │   ├── MapaContacto.jsx             ← Iframe Google Maps
    │   │   ├── NotFound.jsx                 ← 404 page
    │   │   └── SocialIcons.jsx              ← Iconos IG/FB con variantes
    │   ├── home/
    │   │   ├── HeroSection.jsx              ← Carousel hero fullscreen
    │   │   ├── SeccionCategorias.jsx        ← Grid de 5 categorías
    │   │   ├── SeccionColeccion.jsx         ← Contenedor del Swiper
    │   │   ├── SeccionContacto.jsx          ← Info contacto + mapa
    │   │   ├── SeccionEditorialModa.jsx     ← 2 bloques editorial con imágenes
    │   │   ├── SeccionInspiracionModa.jsx   ← 2 columnas inspiración
    │   │   └── SeccionQuienesSomos.jsx      ← Quiénes somos con 2 fotos
    │   └── layout/
    │       ├── Footer.jsx                   ← Footer 3 columnas
    │       └── Navbar.jsx                   ← Navbar fija con scroll spy
    ├── data/
    │   ├── categoriasData.js               ← 5 categorías con imágenes
    │   └── productosData.js                 ← Productos por categoría
    └── img/
        ├── about1.jpg                       ← SeccionQuienesSomos
        ├── fotoabout11.jpg                  ← SeccionQuienesSomos
        ├── Carrousel/
        │   ├── foto111.jpg
        │   ├── foto211.jpg
        │   └── foto311.png
        ├── Categoria/
        │   ├── bolsofoto11.jpg
        │   ├── fotojoyas.jpg
        │   ├── fotovestido1.jpg
        │   ├── hombrefoto111.png
        │   └── ropapersonalizada1.jpg
        ├── Coleccion/
        │   ├── coleccionPic1.jpg
        │   ├── coleccionPic111.jpg
        │   ├── coleccionPic2.jpg
        │   ├── coleccionPic21.jpg
        │   └── coleccionPic23.jpg
        ├── Otros/
        │   ├── otro1.jpg                    ← SIN IMPORT
        │   ├── otro2.jpg                    ← SeccionEditorialModa
        │   ├── otro3.jpg                    ← SIN IMPORT
        │   ├── otro4.jpg                    ← SeccionInspiracionModa
        │   ├── otro5.jpg                    ← SIN IMPORT
        │   ├── otro6.jpg                    ← SeccionInspiracionModa
        │   ├── otro7.jpg                    ← SeccionEditorialModa
        │   ├── otro8.jpg                    ← SeccionEditorialModa
        │   └── otro9.jpg                    ← SeccionEditorialModa
        └── Productos/
            ├── bolsos/
            │   ├── bolso1.jpg … bolso10.jpg
            │   ├── cartera1.jpg
            │   └── cartera2.jpg
            ├── hombre/
            │   ├── homvbre1.jpeg
            │   └── hombre2.jpeg
            ├── indumentaria/
            │   ├── indumentaria1.jpg … indumentaria8.jpg
            │   ├── indumentaria10.jpg … indumentaria12.jpg
            │   └── (NO existe indumentaria9.jpg)
            ├── joyas/
            │   ├── joya1.jpg … joya7.jpg
            │   └── joya8.jpeg … joya11.jpeg
            └── vestidos/
                ├── conjunto1.jpg             ← SIN IMPORT
                ├── conjunto2.jpg             ← SIN IMPORT
                ├── vestido1.jpg … vestido5.jpg
                ├── vestido6.jpg             ← SIN IMPORT
                ├── vestido7.jpg             ← SIN IMPORT
                ├── vestido8.jpeg
                └── vestido9.jpeg
```

**Total de archivos de imagen en `src/img/`:** 72 archivos
**Archivos en `public/`:** 1 (logov.jpeg)

---

## 2. Flujo de Datos

### 2.1 Router Principal — `App.jsx`

```
App.jsx
├── Navbar (fijo, siempre visible)
├── <Routes>
│   ├── "/" → Home()
│   │   ├── HeroSection               (import directo, eager)
│   │   ├── SeccionCategorias         (import directo, eager)
│   │   ├── SeccionColeccion          (import directo, eager)
│   │   ├── DeferredSection → SeccionEditorialModa   (lazy + IntersectionObserver)
│   │   ├── DeferredSection → SeccionInspiracionModa  (lazy + IntersectionObserver)
│   │   ├── DeferredSection → SeccionQuienesSomos     (lazy + IntersectionObserver)
│   │   └── DeferredSection → SeccionContacto         (lazy + IntersectionObserver)
│   ├── "/bolsos"      → Bolsos       (lazy)
│   ├── "/indumentaria"→ Indumentaria (lazy)
│   ├── "/joyeria"     → Joyeria      (lazy)
│   ├── "/vestidos"    → Vestidos     (lazy)
│   ├── "/hombre"      → Hombre       (lazy)
│   └── "*"            → NotFound
└── Footer (fijo, siempre visible)
```

### 2.2 Flujo Home → Componentes con imágenes

```
Home
 │
 ├── HeroSection
 │   └── Importa 3 imágenes directamente → slides[].image
 │       └── Renderiza: <img src={slides[currentSlide].image}> (fondo hero)
 │
 ├── SeccionCategorias
 │   └── Importa ProductsCategoria desde data/categoriasData.js
 │       └── Pasa products={ProductsCategoria} a CardCategoria
 │           └── CardCategoria renderiza: <img src={elem.image}>
 │               └── Cada card es un <Link to={elem.id_name}> → navega a /bolsos, /vestidos, etc.
 │
 ├── SeccionColeccion
 │   └── Renderiza <CarrouselSwip />
 │       └── Importa 5 imágenes directamente → <SwiperSlide><img src={fotoX}>
 │
 ├── SeccionEditorialModa (lazy)
 │   └── Importa 4 imágenes directamente
 │       ├── editorialImg  → <img> principal izquierda
 │       ├── detailImg     → <img> thumbnail flotante (desktop)
 │       ├── editorialAltImg → <img> principal derecha
 │       └── detailAltImg   → <img> thumbnail flotante (desktop)
 │
 ├── SeccionInspiracionModa (lazy)
 │   └── Importa 2 imágenes directamente
 │       ├── imgLeft  → <img> columna izquierda (Looks urbanos)
 │       └── imgRight → <img> columna derecha (A medida)
 │
 ├── SeccionQuienesSomos (lazy)
 │   └── Importa 2 imágenes directamente
 │       ├── fotoabout → <img> columna izquierda
 │       └── about     → <img> columna derecha
 │
 └── SeccionContacto (lazy)
     └── No usa imágenes locales → MapaContacto usa iframe de Google Maps
```

### 2.3 Flujo Categorías → Productos

```
/bolsos       → Bolsos.jsx
/indumentaria → Indumentaria.jsx
/joyeria      → Joyeria.jsx
/vestidos     → Vestidos.jsx
/hombre       → Hombre.jsx

Cada componente wrapper:
  1. Importa su array de productos desde data/productosData.js
  2. Pasa titulo + productos a <CategoriaTemplate>
     └── CategoriaTemplate renderiza:
         ├── Hero con título (sin imagen, solo gradientes CSS)
         └── <GaleriaProductos productos={productos} mostrarPrecio={true} />
             ├── Grid de cards: <img src={producto.image}>
             └── Modal fullscreen: <img src={productoSeleccionado.image}>
```

---

## 3. Auditoría de Imágenes

### 3.1 Imágenes importadas desde componentes (directamente en JSX)

| Componente | Variable import | Ruta local `src/img/` | Sección UI |
|---|---|---|---|
| **HeroSection.jsx** | `foto11` | `Carrousel/foto111.jpg` | Slide 1 — fondo hero |
| | `foto21` | `Carrousel/foto311.png` | Slide 2 — fondo hero |
| | `foto3` | `Carrousel/foto211.jpg` | Slide 3 — fondo hero |
| **CarrouselSwip.jsx** | `foto0` | `Coleccion/coleccionPic1.jpg` | Swiper slide 1 |
| | `foto1` | `Coleccion/coleccionPic111.jpg` | Swiper slide 2 |
| | `foto1b` | `Coleccion/coleccionPic2.jpg` | Swiper slide 3 |
| | `foto2` | `Coleccion/coleccionPic21.jpg` | Swiper slide 4 |
| | `foto3` | `Coleccion/coleccionPic23.jpg` | Swiper slide 5 |
| **SeccionEditorialModa.jsx** | `editorialImg` | `Otros/otro7.jpg` | Imagen principal izq. |
| | `detailImg` | `Otros/otro8.jpg` | Thumbnail flotante izq. |
| | `editorialAltImg` | `Otros/otro9.jpg` | Imagen principal der. |
| | `detailAltImg` | `Otros/otro2.jpg` | Thumbnail flotante der. |
| **SeccionInspiracionModa.jsx** | `imgLeft` | `Otros/otro6.jpg` | Columna izq. (Looks urbanos) |
| | `imgRight` | `Otros/otro4.jpg` | Columna der. (A medida) |
| **SeccionQuienesSomos.jsx** | `fotoabout` | `fotoabout11.jpg` | Columna izq. (quienes somos) |
| | `about` | `about1.jpg` | Columna der. (nuestra empresa) |
| **Navbar.jsx** | — | `public/logov.jpeg` | Logo circular navbar (src="/logov.jpeg") |

### 3.2 Imágenes importadas desde archivos `/data` (indirectamente vía props)

#### `data/categoriasData.js` → 5 imágenes de categoría

| Variable import | Ruta local `src/img/` | Usada en | Sección UI |
|---|---|---|---|
| `vestidos` | `Categoria/fotovestido1.jpg` | CardCategoria → Link /vestidos | Grid categorías (home) |
| `carteras` | `Categoria/bolsofoto11.jpg` | CardCategoria → Link /bolsos | Grid categorías (home) |
| `ropapersonalizada` | `Categoria/ropapersonalizada1.jpg` | CardCategoria → Link /indumentaria | Grid categorías (home) |
| `joya1` | `Categoria/fotojoyas.jpg` | CardCategoria → Link /joyeria | Grid categorías (home) |
| `hombreFoto` | `Categoria/hombrefoto111.png` | CardCategoria → Link /hombre | Grid categorías (home) |

#### `data/productosData.js` → 47 imágenes de productos

| Categoría | Variables importadas | Ruta `src/img/Productos/` | Cantidad |
|---|---|---|---|
| **Bolsos** | bolso1–bolso10, cartera1, cartera2 | `bolsos/` | 12 |
| **Indumentaria** | indumentaria1–indumentaria8, indumentaria9→(10), indumentaria10→(11), indumentaria11→(12) | `indumentaria/` | 11 |
| **Vestidos** | vestido1, vestido2, vestido3, vestido5, vestido8, vestido9 | `vestidos/` | 6 |
| **Joyería** | joya1–joya7, joya8–joya11 | `joyas/` | 11 |
| **Hombre** | hombre1→(homvbre1), hombre2 | `hombre/` | 2 |

### 3.3 Imágenes huérfanas (existen en disco pero NO son importadas por ningún componente)

| Ruta `src/img/` | Nota |
|---|---|
| `Otros/otro1.jpg` | Sin uso detectado |
| `Otros/otro3.jpg` | Sin uso detectado |
| `Otros/otro5.jpg` | Sin uso detectado |
| `Productos/vestidos/conjunto1.jpg` | Sin uso detectado |
| `Productos/vestidos/conjunto2.jpg` | Sin uso detectado |
| `Productos/vestidos/vestido4.jpg` | Sin uso detectado |
| `Productos/vestidos/vestido6.jpg` | Sin uso detectado |
| `Productos/vestidos/vestido7.jpg` | Sin uso detectado |

### 3.4 Inconsistencias en nomenclatura

- `indumentaria9` importa desde `indumentaria10.jpg` (línea 22 de productosData.js)
- `indumentaria10` importa desde `indumentaria11.jpg` (línea 23)
- `indumentaria11` importa desde `indumentaria12.jpg` (línea 24)
- No existe `indumentaria9.jpg` en disco
- `hombre1` importa desde `homvbre1.jpeg` (typo en el nombre del archivo)
- `vestido4`, `vestido6`, `vestido7` existen en disco pero no se importan

---

## 4. Análisis de Categorías

### 4.1 Lógica de `SeccionCategorias.jsx`

```
SeccionCategorias
  ├── Importa ProductsCategoria desde data/categoriasData.js
  ├── Renderiza título "Categorías Destacadas"
  └── <CardCategoria products={ProductsCategoria} />
```

`ProductsCategoria` es un array de 5 objetos:

```js
[
  { id: 1, id_name: "vestidos",     image: fotovestido1.jpg,     name: "VESTIDOS"           },
  { id: 2, id_name: "bolsos",       image: bolsofoto11.jpg,      name: "BOLSOS"             },
  { id: 3, id_name: "indumentaria", image: ropapersonalizada1.jpg, name: "INDUMENTARIA"     },
  { id: 4, id_name: "joyeria",      image: fotojoyas.jpg,        name: "JOYERIA"            },
  { id: 5, id_name: "hombre",       image: hombrefoto111.png,    name: "INDUMENTARIA HOMBRE" },
]
```

### 4.2 Cómo `CardCategoria.jsx` distribuye las categorías

El componente `CardCategoria` recibe `products` (array de 5) y los divide en dos grids:

1. **Grid superior** (3 columnas): `products.slice(0, 3)` → vestidos, bolsos, indumentaria
2. **Grid inferior** (2 columnas, centrado): `products.slice(3, 5)` → joyeria, hombre

Cada card renderiza:
- `<Link to={elem.id_name}>` → navega a la ruta `/vestidos`, `/bolsos`, etc.
- `<img src={elem.image}>` → imagen de fondo de la card
- `<h6>{elem.name}</h6>` → nombre de la categoría
- Botón "Ver productos"

### 4.3 De Home a Página de Categoría — Flujo completo

```
Click en CardCategoria "BOLSOS"
  → <Link to="bolsos">
    → React Router renderiza Bolsos.jsx (lazy)
      → import { productosBolsos } from data/productosData.js
      → <CategoriaTemplate titulo="BOLSOS" productos={productosBolsos} />
        → Hero con gradiente CSS (sin imagen)
        → <GaleriaProductos productos={productosBolsos} mostrarPrecio={true} />
          → Grid 4 columnas con <img src={producto.image}>
          → Modal fullscreen al hacer click en producto
```

Las 5 categorías siguen el mismo patrón:

| Ruta | Componente | Data import | Array | Productos |
|---|---|---|---|---|
| `/bolsos` | Bolsos.jsx | `productosBolsos` | 12 items | bolso1–10, cartera1–2 |
| `/indumentaria` | Indumentaria.jsx | `productosIndumentaria` | 11 items | indumentaria1–11 |
| `/joyeria` | Joyeria.jsx | `productosJoyeria` | 11 items | joya1–11 |
| `/vestidos` | Vestidos.jsx | `productosVestidos` | 6 items | vestido1–9 |
| `/hombre` | Hombre.jsx | `productosHombre` | 2 items | hombre1–2 |

---

## 5. Props e Imports — Hardcodeado vs Data-Driven

### 5.1 Clasificación de imágenes por patrón de importación

#### Patrón A: Import directo en componente (HARDCODEADO)

Las imágenes se importan con `import` estático en la parte superior del JSX y se usan directamente en `<img src={variable}>`. No hay intermediación de datos.

| Componente | Imágenes hardcodeadas | Cantidad |
|---|---|---|
| HeroSection.jsx | foto11, foto21, foto3 | 3 |
| CarrouselSwip.jsx | foto0, foto1, foto1b, foto2, foto3 | 5 |
| SeccionEditorialModa.jsx | editorialImg, detailImg, editorialAltImg, detailAltImg | 4 |
| SeccionInspiracionModa.jsx | imgLeft, imgRight | 2 |
| SeccionQuienesSomos.jsx | fotoabout, about | 2 |
| Navbar.jsx | src="/logov.jpeg" (string literal) | 1 |
| **Subtotal** | | **17** |

#### Patrón B: Import desde `/data` → props (DATA-DRIVEN)

Las imágenes se importan en archivos JS de datos (`categoriasData.js`, `productosData.js`), se asignan a propiedades de objetos, y los componentes las consumen vía props.

| Archivo data | Export | Consumido por | Cantidad |
|---|---|---|---|
| categoriasData.js | `ProductsCategoria` | SeccionCategorias → CardCategoria | 5 |
| productosData.js | `productosBolsos` | Bolsos → CategoriaTemplate → GaleriaProductos | 12 |
| productosData.js | `productosIndumentaria` | Indumentaria → CategoriaTemplate → GaleriaProductos | 11 |
| productosData.js | `productosVestidos` | Vestidos → CategoriaTemplate → GaleriaProductos | 6 |
| productosData.js | `productosJoyeria` | Joyeria → CategoriaTemplate → GaleriaProductos | 11 |
| productosData.js | `productosHombre` | Hombre → CategoriaTemplate → GaleriaProductos | 2 |
| **Subtotal** | | | **47** |

### 5.2 Estructura de objetos en `/data`

**categoriasData.js** — cada objeto:
```js
{
  id: Number,           // 1-5
  id_name: String,      // "vestidos" | "bolsos" | "indumentaria" | "joyeria" | "hombre"
  image: Import,        // módulo ES (resuelto por Vite como URL)
  name: String,         // "VESTIDOS" | "BOLSOS" | etc.
  precio: String,       // "$3519" (dato placeholder, no se usa en UI)
}
```

**productosData.js** — cada objeto:
```js
{
  id: Number,           // secuencial por categoría
  image: Import,        // módulo ES (resuelto por Vite como URL)
  name: String,         // nombre del producto
  precio: String,       // "$17000" (NO se renderiza en GaleriaProductos actualmente)
  categoria: String,    // "bolsos" | "indumentaria" | "vestidos" | "joyeria" | "hombre"
}
```

### 5.3 Resumen de decisión para migración

| Tipo de imagen | Patrón actual | Migración propuesta |
|---|---|---|
| Hero carousel (3) | Import directo en HeroSection | Tabla `hero_slides` con `image_url` |
| Colección Swiper (5) | Import directo en CarrouselSwip | Tabla `collection_slides` con `image_url` |
| Editorial (4) | Import directo en SeccionEditorialModa | Tabla `editorial_images` con `section`, `position` |
| Inspiración (2) | Import directo en SeccionInspiracionModa | Tabla `inspiration_images` con `position` |
| Quiénes Somos (2) | Import directo en SeccionQuienesSomos | Tabla `about_images` con `position` |
| Logo navbar (1) | String literal `/logov.jpeg` | Tabla `site_config` con `logo_url` |
| Categorías (5) | Data-driven via categoriasData.js | Tabla `categories` con `image_url` |
| Productos (47) | Data-driven via productosData.js | Tabla `products` con `image_url`, FK a `categories` |

---

## 6. Observaciones para la Migración a PostgreSQL

### 6.1 Problemas detectados

1. **Sin normalización de precios**: Los precios son strings arbitrarios ("$17000") sin formato consistente. En BD deberían ser `DECIMAL` o `INTEGER` sin símbolo.

2. **Campo `precio` sin uso en UI**: `GaleriaProductos` recibe `mostrarPrecio={true}` pero nunca renderiza `producto.precio`. Solo muestra `name` y `colores`.

3. **Campo `colores` no existe en data**: `GaleriaProductos` soporta `producto.colores` pero ningún objeto en `productosData.js` lo incluye.

4. **Campo `precio` placeholder en categorías**: `categoriasData.js` tiene `precio: "$3519"` en los 5 objetos, dato sin sentido real.

5. **Imágenes huérfanas**: 8 archivos en disco no son importados por ningún componente. Decidir si eliminar o integrar.

6. **Nomenclatura inconsistente**: Variables de import no coinciden con nombres de archivo (ej: `indumentaria9` → `indumentaria10.jpg`, `hombre1` → `homvbre1.jpeg`).

7. **Sin campo `slug` o `description`**: Los productos carecen de descripción, slug URL-friendly, o cualquier campo de SEO.

8. **IDs secuenciales por categoría**: Los IDs de producto se reinician en cada array (1-12, 1-11, etc.). En BD necesitarán IDs globales únicos.

### 6.2 Esquema propuesto para PostgreSQL

```sql
-- Categorías
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(50) UNIQUE NOT NULL,  -- "bolsos", "vestidos", etc.
  name        VARCHAR(100) NOT NULL,         -- "BOLSOS", "VESTIDOS"
  image_url   TEXT NOT NULL,                 -- URL después de migrar a Cloud/S3
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Productos
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  name        VARCHAR(200) NOT NULL,
  price       INTEGER,                       -- en centavos, sin símbolo
  image_url   TEXT NOT NULL,
  colors      INTEGER,                       -- cantidad de colores disponibles
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Slides del Hero
CREATE TABLE hero_slides (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200),
  subtitle    VARCHAR(300),
  image_url   TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- Slides de Colección
CREATE TABLE collection_slides (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200),
  subtitle    VARCHAR(300),
  image_url   TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- Imágenes editoriales
CREATE TABLE editorial_images (
  id          SERIAL PRIMARY KEY,
  section     VARCHAR(50),    -- "main-left", "detail-left", "main-right", "detail-right"
  image_url   TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true
);

-- Imágenes quiénes somos
CREATE TABLE about_images (
  id          SERIAL PRIMARY KEY,
  position    VARCHAR(50),    -- "left", "right"
  image_url   TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true
);

-- Imágenes inspiración
CREATE TABLE inspiration_images (
  id          SERIAL PRIMARY KEY,
  position    VARCHAR(50),    -- "left", "right"
  title       VARCHAR(200),
  subtitle    VARCHAR(300),
  image_url   TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true
);

-- Configuración del sitio
CREATE TABLE site_config (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(100) UNIQUE NOT NULL,
  value       TEXT NOT NULL
);
```

### 6.3 Plan de migración (resumen)

1. **Subir imágenes a almacenamiento externo** (Cloudinary / S3 / Supabase Storage) y obtener URLs públicas.
2. **Poblar tablas de PostgreSQL** con las URLs generadas y los datos existentes en los archivos `/data`.
3. **Crear API endpoints** en el backend (Express) para cada tabla: `GET /api/categories`, `GET /api/products/:category`, `GET /api/hero-slides`, etc.
4. **Reemplazar imports estáticos por fetch** en cada componente:
   - Patrón A (hardcodeado): Crear custom hooks (`useHeroSlides()`, `useCollectionSlides()`, etc.)
   - Patrón B (data-driven): Reemplazar imports de `/data` por llamadas a API
5. **Eliminar carpeta `src/img/`** una vez verificada la carga desde BD.
6. **Manejar imágenes huérfanas**: Evaluar si corresponden a productos futuros o se eliminan.
