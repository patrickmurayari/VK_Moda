const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

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
    const { nombre, precio, imagen_url, colores, categoria_id, esta_activo } = req.body;
    
    // Validaciones
    if (!nombre || nombre.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({ error: 'El precio debe ser un número positivo mayor a cero' });
    }
    
    if (!categoria_id) {
        return res.status(400).json({ error: 'La categoría es requerida' });
    }
    
    // Verificar que la categoría existe
    const catCheck = await db.query('SELECT id FROM categorias WHERE id = $1', [categoria_id]);
    if (catCheck.rows.length === 0) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
    }
    
    try {
        const result = await db.query(`
            INSERT INTO productos (nombre, precio, imagen_url, colores, categoria_id, esta_activo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [nombre.trim(), precioNum, imagen_url || null, colores || null, categoria_id, esta_activo !== false]);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// PUT /api/admin/productos/:id - Actualizar producto
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, imagen_url, colores, categoria_id, esta_activo } = req.body;
    
    // Validaciones
    if (nombre !== undefined && nombre.trim().length === 0) {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }
    
    if (precio !== undefined) {
        const precioNum = parseFloat(precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            return res.status(400).json({ error: 'El precio debe ser un número positivo mayor a cero' });
        }
    }
    
    if (categoria_id !== undefined) {
        const catCheck = await db.query('SELECT id FROM categorias WHERE id = $1', [categoria_id]);
        if (catCheck.rows.length === 0) {
            return res.status(400).json({ error: 'La categoría seleccionada no existe' });
        }
    }
    
    try {
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
            values.push(esta_activo);
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
