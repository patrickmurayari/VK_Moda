import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getCategoriasSelectOptions, getProductoById, createProducto, updateProducto } from '@/services/api';

export default function ProductoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categorias, setCategorias] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        imagen_url: '',
        colores: '',
        categoria_id: '',
        esta_activo: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategorias();
        if (isEdit) {
            fetchProducto();
        }
    }, [id]);

    const getAccessToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const fetchCategorias = async () => {
        try {
            const data = await getCategoriasSelectOptions();
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            toast.error('Error al cargar categorías');
        }
    };

    const fetchProducto = async () => {
        setLoading(true);
        try {
            const token = await getAccessToken();
            const data = await getProductoById(id, token);
            setFormData({
                nombre: data.nombre || '',
                precio: data.precio?.toString() || '',
                imagen_url: data.imagen_url || '',
                colores: data.colores || '',
                categoria_id: data.categoria_id?.toString() || '',
                esta_activo: data.esta_activo ?? true
            });
            setPreviewUrl(data.imagen_url || '');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar producto');
            navigate('/admin/productos');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        const precioNum = parseFloat(formData.precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            newErrors.precio = 'El precio debe ser un número positivo mayor a cero';
        }

        if (!formData.categoria_id) {
            newErrors.categoria_id = 'La categoría es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, imagen_url: '' }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Limpiar error del campo al modificar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Por favor corrige los errores del formulario');
            return;
        }

        setSaving(true);

        try {
            const token = await getAccessToken();

            const fd = new FormData();
            fd.append('nombre', formData.nombre.trim());
            fd.append('precio', String(parseFloat(formData.precio)));
            fd.append('colores', formData.colores || '');
            fd.append('categoria_id', String(parseInt(formData.categoria_id)));
            fd.append('esta_activo', String(formData.esta_activo));
            if (imageFile) {
                fd.append('imagen', imageFile);
            } else if (formData.imagen_url) {
                fd.append('imagen_url', formData.imagen_url);
            }

            if (isEdit) {
                await updateProducto(id, fd, token);
            } else {
                await createProducto(fd, token);
            }

            toast.success(isEdit
                ? '¡Producto actualizado correctamente!'
                : '¡Producto creado correctamente!'
            );
            setImageFile(null);
            setPreviewUrl('');
            navigate('/admin/productos');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al guardar producto');
        } finally {
            setSaving(false);
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
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl sm:text-2xl font-heading text-stone-800">
                    {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-sm sm:text-base text-stone-500 mt-1">
                    {isEdit ? 'Modifica los datos del producto' : 'Completa los datos del nuevo producto'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-stone-700 mb-2">
                        Nombre del producto *
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={saving}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.nombre ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="Ej: Vestido rojo de seda"
                    />
                    {errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                    )}
                </div>

                {/* Precio */}
                <div>
                    <label htmlFor="precio" className="block text-sm font-medium text-stone-700 mb-2">
                        Precio (ARS) *
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">$</span>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            disabled={saving}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.precio ? 'border-red-500' : 'border-stone-300'
                            }`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.precio && (
                        <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
                    )}
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="categoria_id" className="block text-sm font-medium text-stone-700 mb-2">
                        Categoría *
                    </label>
                    <select
                        id="categoria_id"
                        name="categoria_id"
                        value={formData.categoria_id}
                        onChange={handleChange}
                        disabled={saving}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.categoria_id ? 'border-red-500' : 'border-stone-300'
                        }`}
                    >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    {errors.categoria_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>
                    )}
                </div>

                {/* Imagen */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Imagen del producto
                    </label>

                    {/* File picker */}
                    <label
                        htmlFor="imagen_file"
                        className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg transition-colors bg-stone-50 ${
                            saving
                                ? 'border-stone-200 opacity-50 cursor-not-allowed pointer-events-none'
                                : 'border-stone-300 cursor-pointer hover:border-stone-400'
                        }`}
                    >
                        <span className="text-xs text-stone-500 text-center px-4">
                            {imageFile
                                ? imageFile.name
                                : 'Haz clic para subir archivo (JPG, PNG, WEBP — máx. 10 MB)'}
                        </span>
                        <span className="mt-1 text-[10px] text-stone-400">
                            El fondo se eliminará automáticamente y se convertirá a .webp
                        </span>
                    </label>
                    <input
                        type="file"
                        id="imagen_file"
                        accept="image/*"
                        disabled={saving}
                        className="sr-only"
                        onChange={handleFileChange}
                    />

                    {/* Fallback: URL manual */}
                    {!imageFile && (
                        <div className="mt-3">
                            <p className="text-[11px] text-stone-400 mb-1">O bien, pega una URL directa:</p>
                            <input
                                type="url"
                                id="imagen_url"
                                name="imagen_url"
                                value={formData.imagen_url}
                                onChange={handleChange}
                                disabled={saving}
                                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    {/* Preview */}
                    {previewUrl && (
                        <div className="mt-3 flex items-start gap-3">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-stone-200"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setPreviewUrl(formData.imagen_url); }}
                                    className="text-xs text-stone-400 hover:text-red-500 transition-colors mt-1"
                                >
                                    Quitar archivo
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Colores */}
                <div>
                    <label htmlFor="colores" className="block text-sm font-medium text-stone-700 mb-2">
                        Colores disponibles
                    </label>
                    <input
                        type="text"
                        id="colores"
                        name="colores"
                        value={formData.colores}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Rojo, Azul, Negro"
                    />
                </div>

                {/* Activo */}
                <div className="flex items-center gap-3 bg-stone-50 p-3 sm:bg-transparent sm:p-0 rounded-lg sm:rounded-none">
                    <input
                        type="checkbox"
                        id="esta_activo"
                        name="esta_activo"
                        checked={formData.esta_activo}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-5 h-5 text-stone-700 border-stone-300 rounded focus:ring-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label htmlFor="esta_activo" className="text-sm font-medium text-stone-700 select-none cursor-pointer">
                        Producto activo (visible en la tienda)
                    </label>
                </div>

                {/* Botones - Apilados en mobile, en línea en desktop */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-stone-200">
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => navigate('/admin/productos')}
                        className="w-full sm:flex-1 px-4 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
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
                        {saving
                            ? (imageFile ? 'Procesando imagen con IA...' : 'Guardando...')
                            : (isEdit ? 'Guardar Cambios' : 'Crear Producto')
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
