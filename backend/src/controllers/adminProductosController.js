const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const supabaseAdmin = require('../config/supabaseAdmin');
const { processProductImage } = require('../utils/imageProcessor');

// Bucket de Supabase Storage donde se guardan las imágenes de productos
const STORAGE_BUCKET = 'productos';

async function uploadProcessedImage(fileBuffer, mimetype) {
    const processed = await processProductImage(fileBuffer, mimetype);
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

// GET /api/admin/productos/:id - Obtener un producto
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
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

// POST /api/admin/productos - Crear producto
const createProducto = async (req, res) => {
    let { nombre, precio, imagen_url, colores, categoria_id, esta_activo } = req.body;
    
    // Validaciones realizadas por middleware validateProducto

    try {
        if (req.file) {
            imagen_url = await uploadProcessedImage(req.file.buffer, req.file.mimetype);
        }

        const result = await db.query(`
            INSERT INTO productos (nombre, precio, imagen_url, colores, categoria_id, esta_activo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [nombre.trim(), parseFloat(precio), imagen_url || null, colores || null, categoria_id, parseBoolean(esta_activo)]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// PUT /api/admin/productos/:id - Actualizar producto
const updateProducto = async (req, res) => {
    const { id } = req.params;
    let { nombre, precio, imagen_url, colores, categoria_id, esta_activo } = req.body;
    
    // Validaciones realizadas por middleware validateProductoUpdate

    try {
        if (req.file) {
            imagen_url = await uploadProcessedImage(req.file.buffer, req.file.mimetype);
        }

        // Construir query dinámico
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
        if (colores !== undefined) {
            updates.push(`colores = $${paramCount++}`);
            values.push(colores);
        }
        if (categoria_id !== undefined) {
            updates.push(`categoria_id = $${paramCount++}`);
            values.push(categoria_id);
        }
        if (esta_activo !== undefined) {
            updates.push(`esta_activo = $${paramCount++}`);
            values.push(parseBoolean(esta_activo));
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }
        
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
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// DELETE /api/admin/productos/:id - Eliminar producto
const deleteProducto = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
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
