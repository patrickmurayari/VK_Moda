import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getAdminCategorias, getCategoriasSelectOptions, createCategoria, updateCategoria } from '@/services/api';

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

const emptyForm = { nombre: '', slug: '', parent_id: '', orden_visual: 0 };

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchData();
    }, []);

    const getAccessToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const fetchData = async () => {
        try {
            const token = await getAccessToken();
            const [cats, opts] = await Promise.all([
                getAdminCategorias(token),
                getCategoriasSelectOptions(),
            ]);
            setCategorias(cats);
            setSelectOptions(opts);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (cat) => {
        setEditingId(cat.id);
        setForm({
            nombre: cat.nombre || '',
            slug: cat.slug || '',
            parent_id: cat.parent_id || '',
            orden_visual: cat.orden_visual || 0,
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        setForm((prev) => {
            const next = { ...prev, [name]: val };
            if (name === 'nombre' && !editingId) {
                next.slug = slugify(val);
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }
        if (!form.slug.trim()) {
            toast.error('El slug es requerido');
            return;
        }

        setSaving(true);
        try {
            const token = await getAccessToken();
            const payload = {
                nombre: form.nombre.trim(),
                slug: form.slug.trim(),
                parent_id: form.parent_id || null,
                orden_visual: form.orden_visual || 0,
            };

            if (editingId) {
                await updateCategoria(editingId, payload, token);
                toast.success('Categoría actualizada correctamente');
            } else {
                await createCategoria(payload, token);
                toast.success('Categoría creada correctamente');
            }

            closeForm();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al guardar categoría');
        } finally {
            setSaving(false);
        }
    };

    // Map parent_id → label for display
    const parentMap = {};
    categorias.forEach((c) => { parentMap[c.id] = c.nombre; });

    // Filter out current category from parent select (prevent self-reference)
    const filteredOptions = editingId
        ? selectOptions.filter((o) => o.id !== editingId)
        : selectOptions;

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

                        {/* Slug */}
                        <div>
                            <label htmlFor="cat_slug" className="block text-sm font-medium text-stone-700 mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                id="cat_slug"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="vestidos"
                            />
                        </div>

                        {/* Padre */}
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
                                {filteredOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Orden */}
                        <div>
                            <label htmlFor="cat_orden" className="block text-sm font-medium text-stone-700 mb-2">
                                Orden visual
                            </label>
                            <input
                                type="number"
                                id="cat_orden"
                                name="orden_visual"
                                value={form.orden_visual}
                                onChange={handleChange}
                                min="0"
                                disabled={saving}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="0"
                            />
                        </div>
                    </div>

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
                    <table className="w-full text-sm sm:text-base">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-stone-600 whitespace-nowrap">Nombre</th>
                                <th className="px-4 py-3 text-left font-medium text-stone-600 whitespace-nowrap">Slug</th>
                                <th className="px-4 py-3 text-left font-medium text-stone-600 whitespace-nowrap">Padre</th>
                                <th className="px-4 py-3 text-left font-medium text-stone-600 whitespace-nowrap">Orden</th>
                                <th className="px-4 py-3 text-right font-medium text-stone-600 whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {categorias.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                                        No hay categorías registradas
                                    </td>
                                </tr>
                            ) : (
                                categorias.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap font-medium text-stone-800">
                                            {cat.nombre}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-stone-500 font-mono text-xs">
                                            {cat.slug}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {cat.parent_id ? (
                                                <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs sm:text-sm">
                                                    {parentMap[cat.parent_id] || `ID ${cat.parent_id}`}
                                                </span>
                                            ) : (
                                                <span className="text-stone-400 text-xs">Raíz</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-stone-600">
                                            {cat.orden_visual}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => openEdit(cat)}
                                                    className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
