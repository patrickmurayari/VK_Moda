import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getAdminCategorias, createCategoria, updateCategoria, deleteCategoria } from '@/services/api';

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function buildSlug(nombre, parentId, categorias) {
    const base = slugify(nombre.trim());
    if (!parentId) return base;
    const parent = categorias.find(c => String(c.id) === String(parentId));
    if (!parent) return base;
    return `${base}-${parent.slug}`;
}

function nextOrden(parentId, categorias) {
    const pid = parentId ? parseInt(parentId) : null;
    const siblings = categorias.filter(c => (c.parent_id ?? null) === pid);
    if (!siblings.length) return 0;
    return Math.max(...siblings.map(c => c.orden_visual || 0)) + 1;
}

function buildTree(categorias) {
    const sorted = [...categorias].sort((a, b) => (a.orden_visual || 0) - (b.orden_visual || 0));
    const roots = sorted.filter(c => !c.parent_id);
    const rows = [];
    for (const root of roots) {
        rows.push({ ...root, level: 1 });
        const children = sorted.filter(c => c.parent_id === root.id);
        for (const child of children) {
            rows.push({ ...child, level: 2 });
            sorted.filter(c => c.parent_id === child.id).forEach(gc => rows.push({ ...gc, level: 3 }));
        }
    }
    return rows;
}

const emptyForm = { nombre: '', parent_id: '' };

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [swapping, setSwapping] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => { fetchData(); }, []);

    const getAccessToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const fetchData = async () => {
        try {
            const token = await getAccessToken();
            const cats = await getAdminCategorias(token);
            setCategorias(cats);
        } catch {
            toast.error('Error al cargar categórias');
        } finally {
            setLoading(false);
        }
    };

    const treeRows = useMemo(() => buildTree(categorias), [categorias]);

    const [expandidos, setExpandidos] = useState(new Set());

    const toggleExpandido = (id) => {
        setExpandidos(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const visibleRows = useMemo(() => {
        return treeRows.filter(cat => {
            if (cat.level === 1) return true;
            if (cat.level === 2) return expandidos.has(cat.parent_id);
            if (cat.level === 3) {
                const parent = categorias.find(c => c.id === cat.parent_id);
                return parent && expandidos.has(parent.parent_id) && expandidos.has(cat.parent_id);
            }
            return false;
        });
    }, [treeRows, expandidos, categorias]);

    const childParentIds = useMemo(
        () => new Set(categorias.filter(c => c.parent_id).map(c => c.parent_id)),
        [categorias]
    );

    const parentOptions = useMemo(() => {
        const excluded = new Set();
        if (editingId) {
            const collect = (id) => {
                excluded.add(id);
                categorias.filter(c => c.parent_id === id).forEach(c => collect(c.id));
            };
            collect(editingId);
        }
        return categorias.filter(cat => {
            if (excluded.has(cat.id)) return false;
            if (!cat.parent_id) return true;
            const parent = categorias.find(c => c.id === cat.parent_id);
            return !parent?.parent_id;
        });
    }, [categorias, editingId]);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ nombre: cat.nombre || '', parent_id: cat.parent_id || '' });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }
        setSaving(true);
        try {
            const token = await getAccessToken();
            const slug = buildSlug(form.nombre, form.parent_id, categorias);
            const orden_visual = editingId
                ? (categorias.find(c => c.id === editingId)?.orden_visual ?? 0)
                : nextOrden(form.parent_id, categorias);
            const payload = {
                nombre: form.nombre.trim(),
                slug,
                parent_id: form.parent_id || null,
                orden_visual,
            };
            if (editingId) {
                await updateCategoria(editingId, payload, token);
                toast.success('Categória actualizada');
            } else {
                await createCategoria(payload, token);
                toast.success('Categória creada');
            }
            closeForm();
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Error al guardar categória');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (cat) => {
        const hasChildren = childParentIds.has(cat.id);
        const msg = hasChildren
            ? `"${cat.nombre}" tiene subcategórias. Debes eliminarlas primero.`
            : `¿Eliminar "${cat.nombre}"? Esta acción no se puede deshacer.`;
        if (!window.confirm(msg)) return;
        setDeleteId(cat.id);
        try {
            const token = await getAccessToken();
            await deleteCategoria(cat.id, token);
            toast.success('Categória eliminada');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Error al eliminar');
        } finally {
            setDeleteId(null);
        }
    };

    const handleSwap = async (cat, direction) => {
        const siblings = categorias
            .filter(c => (c.parent_id ?? null) === (cat.parent_id ?? null))
            .sort((a, b) => (a.orden_visual || 0) - (b.orden_visual || 0));
        const idx = siblings.findIndex(c => c.id === cat.id);
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= siblings.length) return;
        const neighbor = siblings[targetIdx];
        setSwapping(true);
        try {
            const token = await getAccessToken();
            await Promise.all([
                updateCategoria(cat.id, { orden_visual: neighbor.orden_visual }, token),
                updateCategoria(neighbor.id, { orden_visual: cat.orden_visual }, token),
            ]);
            await fetchData();
        } catch {
            toast.error('Error al reordenar');
        } finally {
            setSwapping(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-stone-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Categorías</h2>
                    <p className="text-sm sm:text-base text-stone-500 mt-1">{categorias.length} categorías registradas</p>
                </div>
                <button
                    onClick={openCreate}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition-colors active:scale-[0.98]"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nueva Categoría</span>
                </button>
            </div>

            {/* Form Modal / Inline */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 sm:p-6 space-y-5"
                >
                    <h3 className="text-lg font-heading text-stone-800">
                        {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="cat_nombre" className="block text-sm font-medium text-stone-700 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="cat_nombre"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Ej: Vestidos"
                            />
                        </div>

                        {/* Categoría Padre */}
                        <div>
                            <label htmlFor="cat_parent" className="block text-sm font-medium text-stone-700 mb-2">
                                Categoría Padre
                            </label>
                            <select
                                id="cat_parent"
                                name="parent_id"
                                value={form.parent_id}
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Ninguno (Categoría Raíz)</option>
                                {parentOptions.map(opt => {
                                    const parentName = opt.parent_id
                                        ? categorias.find(c => c.id === opt.parent_id)?.nombre
                                        : null;
                                    return (
                                        <option key={opt.id} value={opt.id}>
                                            {parentName ? `${parentName} > ${opt.nombre}` : opt.nombre}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    {form.nombre.trim() && (
                        <p className="text-xs text-stone-400">
                            Slug generado automáticamente:{' '}
                            <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                                {buildSlug(form.nombre, form.parent_id, categorias)}
                            </code>
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-stone-200">
                        <button
                            type="button"
                            onClick={closeForm}
                            disabled={saving}
                            className="w-full sm:flex-1 px-4 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`w-full sm:flex-1 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center tracking-widest text-xs uppercase ${
                                saving
                                    ? 'bg-neutral-800 animate-pulse'
                                    : 'bg-black hover:bg-neutral-800 active:scale-[0.98]'
                            }`}
                        >
                            {saving ? 'Guardando...' : (editingId ? 'Guardar Cambios' : 'Crear Categoría')}
                        </button>
                    </div>
                </form>
            )}

            {/* Table */}
            <div className="bg-white sm:rounded-xl shadow-sm border-y sm:border border-stone-200 overflow-hidden -mx-4 sm:mx-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-stone-600">Nombre</th>
                                <th className="px-4 py-3 text-right font-medium text-stone-600 whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {treeRows.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-4 py-8 text-center text-stone-500">
                                        No hay categorías registradas
                                    </td>
                                </tr>
                            ) : (
                                visibleRows.map((cat) => {
                                    const siblings = categorias
                                        .filter(c => (c.parent_id ?? null) === (cat.parent_id ?? null))
                                        .sort((a, b) => (a.orden_visual || 0) - (b.orden_visual || 0));
                                    const sibIdx = siblings.findIndex(c => c.id === cat.id);
                                    const isFirst = sibIdx === 0;
                                    const isLast = sibIdx === siblings.length - 1;
                                    const isRoot = cat.level === 1;

                                    return (
                                        <tr
                                            key={cat.id}
                                            className={`hover:bg-stone-50 transition-colors ${isRoot ? 'border-t-2 border-stone-100' : ''}`}
                                        >
                                            <td className="px-4 py-3">
                                                {cat.level === 1 && (
                                                    <button
                                                        onClick={() => childParentIds.has(cat.id) && toggleExpandido(cat.id)}
                                                        className={`flex items-center gap-2 font-bold text-stone-800 text-left w-full ${childParentIds.has(cat.id) ? 'cursor-pointer hover:text-stone-600' : 'cursor-default'}`}
                                                    >
                                                        {childParentIds.has(cat.id) ? (
                                                            <svg className={`w-3 h-3 text-stone-500 shrink-0 transition-transform duration-150 ${expandidos.has(cat.id) ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5l8 7-8 7z"/></svg>
                                                        ) : (
                                                            <span className="w-3 shrink-0" />
                                                        )}
                                                        {cat.nombre}
                                                    </button>
                                                )}
                                                {cat.level === 2 && (
                                                    <button
                                                        onClick={() => childParentIds.has(cat.id) && toggleExpandido(cat.id)}
                                                        className={`flex items-center gap-1.5 pl-5 w-full text-left ${childParentIds.has(cat.id) ? 'cursor-pointer' : 'cursor-default'}`}
                                                    >
                                                        <span className="text-stone-400 text-xs">↳</span>
                                                        {childParentIds.has(cat.id) && (
                                                            <svg className={`w-3 h-3 text-stone-400 shrink-0 transition-transform duration-150 ${expandidos.has(cat.id) ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5l8 7-8 7z"/></svg>
                                                        )}
                                                        <span className="text-stone-700">{cat.nombre}</span>
                                                    </button>
                                                )}
                                                {cat.level === 3 && (
                                                    <span className="flex items-center gap-1.5 pl-10">
                                                        <span className="text-stone-400 text-xs">↳</span>
                                                        <span className="text-stone-500 text-xs">{cat.nombre}</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex justify-end items-center gap-0.5">
                                                    {isRoot ? (
                                                        <span className="text-xs text-stone-300 pr-2">—</span>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleSwap(cat, 'up')}
                                                                disabled={isFirst || swapping}
                                                                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                                title="Mover arriba"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleSwap(cat, 'down')}
                                                                disabled={isLast || swapping}
                                                                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                                title="Mover abajo"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l8-8h-5V4H9v8H4z"/></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => openEdit(cat)}
                                                                className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cat)}
                                                                disabled={deleteId === cat.id || childParentIds.has(cat.id)}
                                                                className={`p-2 rounded transition-colors ${
                                                                    childParentIds.has(cat.id)
                                                                        ? 'text-stone-300 cursor-not-allowed'
                                                                        : 'text-stone-500 hover:text-red-600 hover:bg-red-50'
                                                                } disabled:opacity-50`}
                                                                title={childParentIds.has(cat.id) ? 'Tiene subcategorías' : 'Eliminar'}
                                                            >
                                                                {deleteId === cat.id ? (
                                                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
