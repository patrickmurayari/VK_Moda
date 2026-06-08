const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const supabaseAdmin = require('../config/supabaseAdmin');
const { processProductImage } = require('../utils/imageProcessor');

// Bucket de Supabase Storage donde se guardan las imágenes de productos
const STORAGE_BUCKET = 'productos';

async function uploadProcessedImage(fileBuffer, mimetype, originalname, fileSize) {
    try {
        const processed = await processProductImage(fileBuffer, mimetype, originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const storagePath = `productos/${fileName}`;

        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, processed, { contentType: 'image/webp', upsert: false });

        if (error) throw error;

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(storagePath);

        return publicUrl;
    } catch (error) {
        console.error(`[Error Procesamiento] Archivo: ${originalname}, Mimetype: ${mimetype}, Tamaño: ${fileSize || 'N/A'} bytes. Detalle:`, error);
        throw error;
    }
}

function parseBoolean(val, fallback = true) {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'boolean') return val;
    return val !== 'false' && val !== '0' && val !== '';
}

// GET /api/admin/productos - Listar todos los productos
const getProductos = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id, p.nombre, p.precio, p.imagen_url, p.colores, p.esta_activo, 
                   p.categoria_id, c.nombre as categoria_nombre, c.slug as categoria_slug
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            ORDER BY c.id, p.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// GET /api/admin/productos/:id - Obtener un producto con variantes
const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const coloresResult = await db.query(
            'SELECT color, imagen_url FROM producto_colores WHERE producto_id = $1 ORDER BY id',
            [id]
        );

        const producto = { ...result.rows[0], colores_variantes: coloresResult.rows };
        res.json(producto);
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

// POST /api/admin/productos - Crear producto
const createProducto = async (req, res) => {
    let { nombre, precio, imagen_url, categoria_id, esta_activo, variantes, color_principal } = req.body;

    // Validaciones realizadas por middleware validateProducto

    try {
        // Parsear variantes si vienen como JSON stringificado
        let variantesParsed = [];
        if (variantes) {
            try {
                variantesParsed = typeof variantes === 'string' ? JSON.parse(variantes) : variantes;
            } catch {
                variantesParsed = [];
            }
        }

        // Procesar imagen principal (Bloque A)
        if (req.files?.imagen_principal?.[0]) {
            const file = req.files.imagen_principal[0];
            imagen_url = await uploadProcessedImage(file.buffer, file.mimetype, file.originalname, file.size);
        }

        // Insertar producto madre
        const result = await db.query(`
            INSERT INTO productos (nombre, precio, imagen_url, colores, categoria_id, esta_activo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [nombre.trim(), parseFloat(precio), imagen_url || null, null, categoria_id, parseBoolean(esta_activo)]);

        const productoId = result.rows[0].id;

        // Procesar e insertar variantes adicionales (Bloque B → producto_colores)
        const variantFiles = req.files?.imagenes_variantes || [];
        let fileIdx = 0;

        for (let i = 0; i < variantesParsed.length; i++) {
            const v = variantesParsed[i];
            const colorName = (v.color || `Variante ${i + 1}`).trim();

            if (v.es_nueva && fileIdx < variantFiles.length) {
                const file = variantFiles[fileIdx++];
                const variantImageUrl = await uploadProcessedImage(file.buffer, file.mimetype, file.originalname, file.size);

                await db.query(
                    'INSERT INTO producto_colores (producto_id, color, imagen_url) VALUES ($1, $2, $3)',
                    [productoId, colorName, variantImageUrl]
                );
            }
        }

        // Devolver producto enriquecido con variantes
        const coloresResult = await db.query(
            'SELECT color, imagen_url FROM producto_colores WHERE producto_id = $1 ORDER BY id',
            [productoId]
        );

        const producto = { ...result.rows[0], colores_variantes: coloresResult.rows };
        res.status(201).json(producto);
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// PUT /api/admin/productos/:id - Actualizar producto
const updateProducto = async (req, res) => {
    const { id } = req.params;
    let { nombre, precio, imagen_url, categoria_id, esta_activo, variantes, color_principal } = req.body;

    // Validaciones realizadas por middleware validateProductoUpdate

    try {
        // Parsear variantes si vienen como JSON stringificado
        let variantesParsed = [];
        if (variantes) {
            try {
                variantesParsed = typeof variantes === 'string' ? JSON.parse(variantes) : variantes;
            } catch {
                variantesParsed = [];
            }
        }

        // Procesar imagen principal nueva (Bloque A)
        let oldMainImageUrl = null;
        if (req.files?.imagen_principal?.[0]) {
            // Obtener URL vieja para limpieza posterior
            const oldProduct = await db.query('SELECT imagen_url FROM productos WHERE id = $1', [id]);
            oldMainImageUrl = oldProduct.rows[0]?.imagen_url || null;

            const file = req.files.imagen_principal[0];
            imagen_url = await uploadProcessedImage(file.buffer, file.mimetype, file.originalname, file.size);
        }

        // Construir query dinámico para campos del producto
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramCount++}`);
            values.push(nombre.trim());
        }
        if (precio !== undefined) {
            updates.push(`precio = $${paramCount++}`);
            values.push(parseFloat(precio));
        }
        if (imagen_url !== undefined) {
            updates.push(`imagen_url = $${paramCount++}`);
            values.push(imagen_url);
        }
        if (categoria_id !== undefined) {
            updates.push(`categoria_id = $${paramCount++}`);
            values.push(categoria_id);
        }
        if (esta_activo !== undefined) {
            updates.push(`esta_activo = $${paramCount++}`);
            values.push(parseBoolean(esta_activo));
        }

        if (updates.length === 0 && !req.files?.imagen_principal?.[0] && !req.files?.imagenes_variantes?.length && !variantesParsed.length) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        if (updates.length > 0) {
            values.push(id);
            const result = await db.query(`
                UPDATE productos 
                SET ${updates.join(', ')}
                WHERE id = $${paramCount}
                RETURNING *
            `, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
        }

        // Recolectar paths huérfanos a borrar del storage
        const pathsABorrar = [];

        // Limpiar imagen principal vieja si fue reemplazada
        if (oldMainImageUrl) {
            const path = obtenerPathDesdeUrl(oldMainImageUrl);
            if (path) pathsABorrar.push(path);
        }

        // Si hay variantes nuevas, reconstruir producto_colores (solo Bloque B)
        const hasVariantFiles = !!req.files?.imagenes_variantes?.length;
        const hasVariantesData = variantesParsed.length > 0;

        if (hasVariantFiles || hasVariantesData) {
            // Obtener URLs viejas de variantes
            const oldVariantes = await db.query(
                'SELECT imagen_url FROM producto_colores WHERE producto_id = $1',
                [id]
            );

            // Conjunto de URLs que se conservan en la nueva data
            const nuevasUrls = new Set(
                variantesParsed.map(v => v.imagen_url).filter(Boolean)
            );

            // Identificar URLs huérfanas (viejas que no están en la nueva data)
            for (const row of oldVariantes.rows) {
                if (row.imagen_url && !nuevasUrls.has(row.imagen_url)) {
                    const path = obtenerPathDesdeUrl(row.imagen_url);
                    if (path) pathsABorrar.push(path);
                }
            }

            // Eliminar variantes anteriores de la DB
            await db.query('DELETE FROM producto_colores WHERE producto_id = $1', [id]);

            // Recorrer variantesParsed y alinear con archivos nuevos usando es_nueva
            const variantFiles = req.files?.imagenes_variantes || [];
            let fileIdx = 0;

            for (let i = 0; i < variantesParsed.length; i++) {
                const v = variantesParsed[i];
                const colorName = (v.color || `Variante ${i + 1}`).trim();

                if (v.es_nueva && fileIdx < variantFiles.length) {
                    // Variante nueva: procesar archivo correspondiente
                    const file = variantFiles[fileIdx++];
                    const variantImageUrl = await uploadProcessedImage(file.buffer, file.mimetype, file.originalname, file.size);

                    await db.query(
                        'INSERT INTO producto_colores (producto_id, color, imagen_url) VALUES ($1, $2, $3)',
                        [id, colorName, variantImageUrl]
                    );
                } else if (v.imagen_url) {
                    // Variante existente: re-insertar con su URL de Supabase intacta
                    await db.query(
                        'INSERT INTO producto_colores (producto_id, color, imagen_url) VALUES ($1, $2, $3)',
                        [id, colorName, v.imagen_url]
                    );
                }
            }
        }

        // Borrar imágenes huérfanas del storage en lote (no bloquear si falla)
        if (pathsABorrar.length > 0) {
            try {
                const { error: storageError } = await supabaseAdmin.storage
                    .from(STORAGE_BUCKET)
                    .remove(pathsABorrar);

                if (storageError) {
                    console.warn('[updateProducto] No se pudieron borrar imágenes huérfanas del storage:', storageError.message);
                } else {
                    console.log(`[updateProducto] ${pathsABorrar.length} imagen(es) huérfana(s) eliminada(s) del storage`);
                }
            } catch (storageErr) {
                console.warn('[updateProducto] Error accediendo al storage:', storageErr.message);
            }
        }

        // Devolver producto actualizado con variantes
        const updatedProduct = await db.query(
            'SELECT * FROM productos WHERE id = $1',
            [id]
        );
        const coloresResult = await db.query(
            'SELECT color, imagen_url FROM producto_colores WHERE producto_id = $1 ORDER BY id',
            [id]
        );

        const producto = { ...updatedProduct.rows[0], colores_variantes: coloresResult.rows };
        res.json(producto);
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// Extrae el path relativo del archivo dentro del bucket a partir de la URL pública
// Ej: https://xxx.supabase.co/storage/v1/object/public/productos/productos/123-abc.webp → productos/123-abc.webp
function obtenerPathDesdeUrl(url) {
    if (!url) return null;
    const partes = url.split('/public/productos/');
    return partes.length > 1 ? partes[1] : null;
}

// DELETE /api/admin/productos/:id - Eliminar producto
const deleteProducto = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Obtener imagen_url antes de borrar el registro
        const selectResult = await db.query('SELECT imagen_url FROM productos WHERE id = $1', [id]);
        
        if (selectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const imagenUrl = selectResult.rows[0].imagen_url;

        // Obtener URLs de variantes antes de borrar (CASCADE las elimina de la DB)
        const variantesResult = await db.query(
            'SELECT imagen_url FROM producto_colores WHERE producto_id = $1',
            [id]
        );

        // Recolectar todas las rutas de storage a borrar (portada + variantes)
        const pathsToDelete = [];

        if (imagenUrl) {
            const filePath = obtenerPathDesdeUrl(imagenUrl);
            if (filePath) pathsToDelete.push(filePath);
        }

        for (const row of variantesResult.rows) {
            const filePath = obtenerPathDesdeUrl(row.imagen_url);
            if (filePath) pathsToDelete.push(filePath);
        }

        // Borrar todas las imágenes del storage de una sola vez (no bloquear si falla)
        if (pathsToDelete.length > 0) {
            try {
                const { error: storageError } = await supabaseAdmin.storage
                    .from(STORAGE_BUCKET)
                    .remove(pathsToDelete);

                if (storageError) {
                    console.warn('[deleteProducto] No se pudieron borrar imágenes del storage:', storageError.message);
                } else {
                    console.log(`[deleteProducto] ${pathsToDelete.length} imagen(es) eliminada(s) del storage`);
                }
            } catch (storageErr) {
                console.warn('[deleteProducto] Error accediendo al storage, se continúa con el DELETE DB:', storageErr.message);
            }
        }

        const result = await db.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);
        
        res.json({ message: 'Producto eliminado correctamente', id: result.rows[0].id });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};
