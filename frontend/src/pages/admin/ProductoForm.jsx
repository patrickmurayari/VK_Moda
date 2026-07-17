import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getCategoriasSelectOptions, getProductoById, createProducto, updateProducto } from '@/services/api';

const TALLES_LETRAS = ['S', 'M', 'L', 'XL', 'XXL'];
const TALLES_NUMERICOS = ['36', '38', '40', '42', '44', '46', '48', '50'];
const TALLE_UNICO = ['Único'];

export default function ProductoForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categorias, setCategorias] = useState([]);

    const [imagenPrincipal, setImagenPrincipal] = useState({ file: null, preview: '' });
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
    const [tallesSeleccionados, setTallesSeleccionados] = useState([]);

    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
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
                precio: data.precio != null ? Math.round(data.precio).toString() : '',
                categoria_id: data.categoria_id?.toString() || '',
                esta_activo: data.esta_activo ?? true
            });
            if (data.imagen_url) {
                setImagenPrincipal({ file: null, preview: data.imagen_url });
            }
            if (data.talles && Array.isArray(data.talles)) {
                setTallesSeleccionados(data.talles);
            }
            if (data.imagenes_adicionales && data.imagenes_adicionales.length > 0) {
                setImagenesAdicionales(data.imagenes_adicionales.map(v => ({
                    etiqueta: v.etiqueta,
                    imagen_url: v.imagen_url,
                    file: null,
                    preview: v.imagen_url
                })));
            }
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

    const handleImagenPrincipalChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (imagenPrincipal.preview && imagenPrincipal.file) {
            URL.revokeObjectURL(imagenPrincipal.preview);
        }
        setImagenPrincipal({ file, preview: URL.createObjectURL(file) });
    };

    const addImagenAdicional = () => {
        setImagenesAdicionales(prev => [...prev, { etiqueta: '', imagen_url: '', file: null, preview: '' }]);
    };

    const handleImagenFileChange = (index, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const updated = [...imagenesAdicionales];
        if (updated[index].preview && updated[index].file) {
            URL.revokeObjectURL(updated[index].preview);
        }
        updated[index] = { ...updated[index], file, preview: URL.createObjectURL(file) };
        setImagenesAdicionales(updated);
    };

    const handleEtiquetaChange = (index, etiqueta) => {
        const updated = [...imagenesAdicionales];
        updated[index] = { ...updated[index], etiqueta };
        setImagenesAdicionales(updated);
    };

    const removeImagenAdicional = (index) => {
        const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta foto adicional? Se perderán la imagen y la etiqueta cargadas.");
        if (!confirmar) return;
        const updated = imagenesAdicionales.filter((_, i) => i !== index);
        if (imagenesAdicionales[index].preview && imagenesAdicionales[index].file) {
            URL.revokeObjectURL(imagenesAdicionales[index].preview);
        }
        setImagenesAdicionales(updated);
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
            fd.append('categoria_id', String(parseInt(formData.categoria_id)));
            fd.append('esta_activo', String(formData.esta_activo));

            // Talles disponibles
            fd.append('talles', JSON.stringify(tallesSeleccionados));

            // Bloque A: Imagen principal
            if (imagenPrincipal.file) {
                fd.append('imagen_principal', imagenPrincipal.file);
            } else if (imagenPrincipal.preview) {
                fd.append('imagen_url', imagenPrincipal.preview);
            }

            // Bloque B: Imágenes adicionales
            const imagenesConFile = imagenesAdicionales.filter(v => v.file);
            for (const img of imagenesConFile) {
                fd.append('imagenes_variantes', img.file);
            }

            // Mapeo de etiquetas para imágenes adicionales (incluye las que ya tenían imagen de Supabase)
            const imagenesData = imagenesAdicionales.map(v => ({
                etiqueta: v.etiqueta || '',
                imagen_url: v.imagen_url || '',
                es_nueva: !!v.file
            }));
            if (imagenesData.length > 0) {
                fd.append('imagenes_adicionales', JSON.stringify(imagenesData));
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
            setImagenPrincipal({ file: null, preview: '' });
            setImagenesAdicionales([]);
            setTallesSeleccionados([]);
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
                            step="1"
                            min="0"
                            disabled={saving}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                errors.precio ? 'border-red-500' : 'border-stone-300'
                            }`}
                            placeholder="0"
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

                {/* ─── BLOQUE A: Imagen Principal / Portada ─── */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                        Imagen principal *
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* File selector */}
                        <div className="flex-1">
                            <label
                                htmlFor="imagen_principal"
                                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg transition-colors bg-stone-50 ${
                                    saving
                                        ? 'border-stone-200 opacity-50 cursor-not-allowed pointer-events-none'
                                        : 'border-stone-300 cursor-pointer hover:border-stone-400'
                                }`}
                            >
                                {imagenPrincipal.preview ? (
                                    <span className="text-xs text-stone-500">Toca para reemplazar la imagen</span>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-stone-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs text-stone-500">Seleccionar imagen (JPG, PNG, WEBP)</span>
                                    </>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imagen_principal"
                                accept="image/*"
                                disabled={saving}
                                className="sr-only"
                                onChange={handleImagenPrincipalChange}
                            />
                        </div>

                        {/* Preview */}
                        {imagenPrincipal.preview && (
                            <img
                                src={imagenPrincipal.preview}
                                alt="Imagen principal"
                                className="w-20 h-24 object-cover shrink-0"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                    </div>
                </div>

                {/* ─── BLOQUE B: Galería de imágenes adicionales ─── */}
                <div>
                    <p className="text-sm font-medium text-stone-700 mb-1">
                        ¿Querés agregar más fotos o ángulos de este producto?
                    </p>
                    <p className="text-[11px] text-stone-400 mb-3">
                        Agregá una imagen y una etiqueta descriptiva por cada ángulo o detalle adicional.
                    </p>

                    {/* Botón agregar */}
                    <button
                        type="button"
                        onClick={addImagenAdicional}
                        disabled={saving || imagenesAdicionales.length >= 9}
                        className="flex items-center gap-2 px-0 py-2 text-xs font-body tracking-wide text-neutral-500 hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        + Agregar Foto / Ángulo
                    </button>

                    {/* Filas dinámicas */}
                    {imagenesAdicionales.length > 0 && (
                        <div className="mt-3">
                            {imagenesAdicionales.map((img, index) => (
                                <div key={index} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 ${index < imagenesAdicionales.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                                    {/* File selector exclusivo por imagen */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <label
                                            htmlFor={`img_file_${index}`}
                                            className={`block w-16 h-20 overflow-hidden border-2 border-dashed transition-colors ${
                                                img.preview
                                                    ? 'border-neutral-200 cursor-pointer hover:border-neutral-400'
                                                    : 'border-neutral-200 bg-stone-50 cursor-pointer hover:border-stone-400'
                                            } ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            {img.preview ? (
                                                <img
                                                    src={img.preview}
                                                    alt={`Imagen ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            id={`img_file_${index}`}
                                            accept="image/*"
                                            disabled={saving}
                                            className="sr-only"
                                            onChange={(e) => handleImagenFileChange(index, e)}
                                        />
                                    </div>

                                    {/* Etiqueta input + delete */}
                                    <div className="flex-1 min-w-0 flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={img.etiqueta}
                                            onChange={(e) => handleEtiquetaChange(index, e.target.value)}
                                            disabled={saving}
                                            placeholder="Ángulo / Detalle (Ej: Espalda, Calce, Textura - Opcional)"
                                            className="flex-1 px-0 py-2 border-b border-neutral-200 focus:border-black rounded-none bg-transparent text-sm focus:outline-none transition-colors disabled:opacity-50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImagenAdicional(index)}
                                            disabled={saving}
                                            className="p-1.5 text-neutral-300 hover:text-red-400 transition-colors shrink-0 disabled:opacity-50"
                                            title="Quitar imagen"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── TALLES DISPONIBLES ─── */}
                <div>
                    <p className="text-sm font-medium text-stone-700 mb-1">
                        Talles disponibles
                    </p>
                    <p className="text-[11px] text-stone-400 mb-3">
                        Usá los atajos para cargar una curva completa, y luego destildá los talles sin stock.
                    </p>

                    {/* Atajos rápidos */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button
                            type="button"
                            onClick={() => setTallesSeleccionados([...TALLES_LETRAS.slice(0, 4)])}
                            disabled={saving}
                            className="px-3 py-1.5 text-xs font-body tracking-wide border border-stone-300 text-stone-600 hover:border-black hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Curva S a XL
                        </button>
                        <button
                            type="button"
                            onClick={() => setTallesSeleccionados(['36', '38', '40', '42', '44', '46'])}
                            disabled={saving}
                            className="px-3 py-1.5 text-xs font-body tracking-wide border border-stone-300 text-stone-600 hover:border-black hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Curva Jeans 36 a 46
                        </button>
                        <button
                            type="button"
                            onClick={() => setTallesSeleccionados([...TALLE_UNICO])}
                            disabled={saving}
                            className="px-3 py-1.5 text-xs font-body tracking-wide border border-stone-300 text-stone-600 hover:border-black hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Talle Único
                        </button>
                        <button
                            type="button"
                            onClick={() => setTallesSeleccionados([])}
                            disabled={saving || tallesSeleccionados.length === 0}
                            className="px-3 py-1.5 text-xs font-body tracking-wide border border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Limpiar
                        </button>
                    </div>

                    {/* Grilla de checkboxes */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {[...TALLES_LETRAS, ...TALLES_NUMERICOS].map(talle => {
                            const activo = tallesSeleccionados.includes(talle);
                            return (
                                <button
                                    key={talle}
                                    type="button"
                                    disabled={saving}
                                    onClick={() => {
                                        setTallesSeleccionados(prev =>
                                            activo
                                                ? prev.filter(t => t !== talle)
                                                : [...prev, talle]
                                        );
                                    }}
                                    className={`py-2 text-xs font-body tracking-wide border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                        activo
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                                    }`}
                                >
                                    {talle}
                                </button>
                            );
                        })}
                    </div>
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
                        className={`w-full sm:flex-1 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 tracking-widest text-xs uppercase ${
                            saving
                                ? 'bg-neutral-800 opacity-50 cursor-not-allowed'
                                : 'bg-black hover:bg-neutral-800 active:scale-[0.98]'
                        }`}
                    >
                        {saving && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {saving
                            ? ((imagenPrincipal.file || imagenesAdicionales.some(v => v.file)) ? 'Procesando y subiendo prendas...' : 'Guardando...')
                            : (isEdit ? 'Guardar Cambios' : 'Crear Producto')
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
