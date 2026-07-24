const db = require('../config/db');
const supabaseAdmin = require('../config/supabaseAdmin');
const { processProductImage } = require('../utils/imageProcessor');

const CAT_BUCKET = 'productos';

const getCategorias = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT c.id, c.slug, c.nombre,
                    COALESCE(
                        c.imagen_url,
                        (SELECT p.imagen_url FROM productos p WHERE p.categoria_id = c.id AND p.imagen_url IS NOT NULL AND p.esta_activo = true ORDER BY p.id ASC LIMIT 1)
                    ) AS imagen_url,
                    c.parent_id, c.orden_visual,
                    p.nombre AS padre_nombre
             FROM categorias c
             LEFT JOIN categorias p ON c.parent_id = p.id
             ORDER BY c.orden_visual ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const getCategoryTree = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, slug, nombre, parent_id, orden_visual FROM categorias ORDER BY orden_visual ASC'
        );

        const rows = result.rows;
        const map = {};

        rows.forEach((row) => {
            map[row.id] = {
                id: row.id,
                label: row.nombre,
                slug: `/categoria/${row.slug}`,
                children: [],
            };
        });

        const roots = [];
        rows.forEach((row) => {
            if (row.parent_id && map[row.parent_id]) {
                map[row.parent_id].children.push(map[row.id]);
            } else {
                roots.push(map[row.id]);
            }
        });

        const prune = (node) => {
            if (node.children.length === 0) {
                delete node.children;
            } else {
                node.children.forEach(prune);
            }
            return node;
        };

        res.json(roots.map(prune));
    } catch (err) {
        console.error('Error al construir árbol de categorías:', err);
        res.status(500).json({ error: 'Error al construir árbol de categorías' });
    }
};

const getCategoryContext = async (req, res) => {
    const { slug } = req.params;
    try {
        const actualResult = await db.query(
            'SELECT id, slug, nombre, parent_id, orden_visual FROM categorias WHERE slug = $1',
            [slug]
        );

        if (actualResult.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const actual = actualResult.rows[0];

        let padre = null;
        if (actual.parent_id) {
            const padreResult = await db.query(
                'SELECT id, slug, nombre, parent_id, orden_visual FROM categorias WHERE id = $1',
                [actual.parent_id]
            );
            padre = padreResult.rows[0] || null;
        }

        let hermanas = [];
        if (actual.parent_id) {
            const hermanasResult = await db.query(
                `SELECT c.id, c.slug, c.nombre, c.orden_visual
                 FROM categorias c
                 WHERE c.parent_id = $1
                   AND EXISTS (
                       SELECT 1 FROM productos p
                       WHERE p.categoria_id = c.id
                         AND p.esta_activo = true
                   )
                 ORDER BY c.orden_visual ASC`,
                [actual.parent_id]
            );
            hermanas = hermanasResult.rows;
        }

        res.json({ actual, padre, hermanas });
    } catch (err) {
        console.error('Error al obtener contexto de categoría:', err);
        res.status(500).json({ error: 'Error al obtener contexto de categoría' });
    }
};

const getCategoriasSelectOptions = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.id, c.nombre, p.nombre AS padre_nombre
            FROM categorias c
            LEFT JOIN categorias p ON c.parent_id = p.id
        `);

        const options = result.rows
            .map((row) => ({
                id: row.id,
                label: row.padre_nombre
                    ? `${row.padre_nombre} > ${row.nombre}`
                    : row.nombre,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, 'es'));

        res.json(options);
    } catch (err) {
        console.error('Error al obtener opciones de categorías:', err);
        res.status(500).json({ error: 'Error al obtener opciones de categorías' });
    }
};

const createCategoria = async (req, res) => {
    const { nombre, slug, parent_id, orden_visual, imagen_url } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }
    if (!slug || !slug.trim()) {
        return res.status(400).json({ error: 'El slug es requerido' });
    }

    try {
        // Validar que parent_id exista si se proporciona
        if (parent_id) {
            const parentResult = await db.query('SELECT id FROM categorias WHERE id = $1', [parent_id]);
            if (parentResult.rows.length === 0) {
                return res.status(400).json({ error: 'La categoría padre no existe' });
            }
        }

        // Verificar slug único
        const existing = await db.query('SELECT id FROM categorias WHERE slug = $1', [slug.trim()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Ya existe una categoría con ese slug' });
        }

        // Solo incluir imagen_url si viene con valor real
        const cleanImagenUrl = imagen_url && imagen_url.trim() ? imagen_url.trim() : null;
        const cols = ['nombre', 'slug', 'parent_id', 'orden_visual'];
        const vals = [nombre.trim(), slug.trim(), parent_id || null, orden_visual || 0];

        if (cleanImagenUrl) {
            cols.push('imagen_url');
            vals.push(cleanImagenUrl);
        }

        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

        const result = await db.query(
            `INSERT INTO categorias (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            vals
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear categoría:', err);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, slug, parent_id, orden_visual, imagen_url } = req.body;

    try {
        // Verificar que la categoría existe
        const existing = await db.query('SELECT id FROM categorias WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        // No permitir que una categoría sea padre de sí misma
        if (parent_id && parseInt(parent_id) === parseInt(id)) {
            return res.status(400).json({ error: 'Una categoría no puede ser padre de sí misma' });
        }

        // Validar que parent_id exista si se proporciona
        if (parent_id) {
            const parentResult = await db.query('SELECT id FROM categorias WHERE id = $1', [parent_id]);
            if (parentResult.rows.length === 0) {
                return res.status(400).json({ error: 'La categoría padre no existe' });
            }
        }

        // Verificar slug único (excluyendo la categoría actual)
        if (slug) {
            const slugCheck = await db.query('SELECT id FROM categorias WHERE slug = $1 AND id != $2', [slug.trim(), id]);
            if (slugCheck.rows.length > 0) {
                return res.status(409).json({ error: 'Ya existe otra categoría con ese slug' });
            }
        }

        // Construir query dinámico
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updates.push(`nombre = $${paramCount++}`);
            values.push(nombre.trim());
        }
        if (slug !== undefined) {
            updates.push(`slug = $${paramCount++}`);
            values.push(slug.trim());
        }
        if (parent_id !== undefined) {
            updates.push(`parent_id = $${paramCount++}`);
            values.push(parent_id || null);
        }
        if (orden_visual !== undefined) {
            updates.push(`orden_visual = $${paramCount++}`);
            values.push(orden_visual);
        }
        if (imagen_url !== undefined) {
            updates.push(`imagen_url = $${paramCount++}`);
            values.push(imagen_url && imagen_url.trim() ? imagen_url.trim() : null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id);

        const result = await db.query(
            `UPDATE categorias SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al actualizar categoría:', err);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

const deleteCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar que la categoría existe
        const existing = await db.query('SELECT id FROM categorias WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        // Impedir borrado si tiene subcategorías
        const children = await db.query('SELECT id FROM categorias WHERE parent_id = $1', [id]);
        if (children.rows.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar una categoría con subcategorías asociadas' });
        }

        // Impedir borrado si tiene productos vinculados
        const products = await db.query('SELECT id FROM productos WHERE categoria_id = $1', [id]);
        if (products.rows.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar una categoría con productos asociados' });
        }

        await db.query('DELETE FROM categorias WHERE id = $1', [id]);
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar categoría:', err);
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};

const uploadCategoriaImagen = async (req, res) => {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'Se requiere una imagen' });

    try {
        const processed = await processProductImage(req.file.buffer, req.file.mimetype, req.file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const storagePath = `categorias/${fileName}`;

        const { error } = await supabaseAdmin.storage
            .from(CAT_BUCKET)
            .upload(storagePath, processed, { contentType: 'image/webp', upsert: false });
        if (error) throw error;

        const { data: { publicUrl } } = supabaseAdmin.storage.from(CAT_BUCKET).getPublicUrl(storagePath);

        const result = await db.query(
            'UPDATE categorias SET imagen_url = $1 WHERE id = $2 RETURNING id, nombre, slug, imagen_url',
            [publicUrl, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });

        console.log(`[uploadCategoriaImagen] cat id=${id} → ${publicUrl}`);
        res.json({ success: true, url: publicUrl, categoria: result.rows[0] });
    } catch (err) {
        console.error('[uploadCategoriaImagen] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCategorias, getCategoryTree, getCategoryContext, getCategoriasSelectOptions, createCategoria, updateCategoria, deleteCategoria, uploadCategoriaImagen };
