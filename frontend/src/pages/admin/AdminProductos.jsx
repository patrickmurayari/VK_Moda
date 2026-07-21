import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getProductos, deleteProducto } from '@/services/api';
import { formatPrecio } from '@/utils/format';

const ITEMS_PER_PAGE = 10;

// Componente de esqueleto de carga adaptado a mobile
function ProductSkeleton() {
    return (
        <tr className="animate-pulse border-b border-stone-100">
            <td className="px-4 py-4"><div className="h-4 bg-stone-200 rounded w-40"></div></td>
            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell"><div className="h-4 bg-stone-200 rounded w-20"></div></td>
            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell"><div className="h-4 bg-stone-200 rounded w-24"></div></td>
            <td className="px-4 py-4 whitespace-nowrap"><div className="h-8 bg-stone-200 rounded w-16 ml-auto"></div></td>
        </tr>
    );
}

export default function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [catQuery, setCatQuery] = useState('');
    const [catOpen, setCatOpen] = useState(false);
    const catRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProductos();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    useEffect(() => {
        const handler = (e) => {
            if (catRef.current && !catRef.current.contains(e.target)) {
                setCatOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const getAccessToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const fetchProductos = async () => {
        try {
            const token = await getAccessToken();
            const data = await getProductos(token);
            setProductos(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const categorias = [...new Set(productos.map(p => p.categoria_nombre).filter(Boolean))].sort();
    const categoriasFiltradas = categorias.filter(cat =>
        cat.toLowerCase().includes(catQuery.toLowerCase())
    );

    const productosFiltrados = productos.filter((producto) => {
        const coincideNombre = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const coincideCategoria = selectedCategory === '' || producto.categoria_nombre === selectedCategory;
        return coincideNombre && coincideCategoria;
    });

    const totalPages = Math.ceil(productosFiltrados.length / ITEMS_PER_PAGE);
    const productosPagina = productosFiltrados.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        
        setDeleteId(id);
        try {
            const token = await getAccessToken();
            await deleteProducto(id, token);
            toast.success('Producto eliminado correctamente');
            setProductos(productos.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al eliminar producto');
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <>
        <div className="space-y-6">
            {/* Header: Apilado en mobile, en línea en sm+ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Productos</h2>
                    <p className="text-sm sm:text-base text-stone-500 mt-1">{productosFiltrados.length}{(searchTerm || selectedCategory) ? ` de ${productos.length}` : ''} productos registrados</p>
                </div>
                <Link
                    to="/admin/productos/nuevo"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition-colors active:scale-[0.98]"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo Producto</span>
                </Link>
            </div>

            {/* Barra de búsqueda y filtro */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre de producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-base sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-black transition-colors"
                    />
                </div>
                <div ref={catRef} className="relative w-full sm:w-56">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Todas las categorías"
                            value={catQuery}
                            onChange={(e) => { setCatQuery(e.target.value); setSelectedCategory(''); setCatOpen(true); }}
                            onFocus={() => setCatOpen(true)}
                            className="w-full px-3 py-2.5 pr-8 bg-white border border-neutral-200 rounded-lg text-base sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-black transition-colors"
                        />
                        {selectedCategory ? (
                            <button
                                onClick={() => { setSelectedCategory(''); setCatQuery(''); }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                                title="Limpiar filtro"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        ) : (
                            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </div>
                    {catOpen && (
                        <ul className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            <li
                                onMouseDown={() => { setSelectedCategory(''); setCatQuery(''); setCatOpen(false); }}
                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-stone-50 ${
                                    !selectedCategory ? 'font-medium text-stone-900' : 'text-stone-500'
                                }`}
                            >
                                Todas las categorías
                            </li>
                            {categoriasFiltradas.map(cat => (
                                <li
                                    key={cat}
                                    onMouseDown={() => { setSelectedCategory(cat); setCatQuery(cat); setCatOpen(false); }}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-stone-50 ${
                                        selectedCategory === cat ? 'font-medium text-stone-900 bg-stone-50' : 'text-stone-700'
                                    }`}
                                >
                                    {cat}
                                </li>
                            ))}
                            {categoriasFiltradas.length === 0 && (
                                <li className="px-3 py-3 text-sm text-stone-400 italic text-center">Sin resultados</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Tabla: Edge-to-edge en mobile (-mx-4) y con bordes en sm+ */}
            <div className="bg-white sm:rounded-xl shadow-sm border-y sm:border border-stone-200 overflow-hidden -mx-4 sm:mx-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base">
                        <thead className="bg-stone-50 border-b border-stone-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-stone-600">Nombre</th>
                                <th className="px-4 py-3 text-left font-medium text-stone-600 whitespace-nowrap hidden sm:table-cell">Precio</th>
                                <th className="px-4 py-3 text-left font-medium text-stone-600 whitespace-nowrap hidden sm:table-cell">Categoría</th>
                                <th className="px-4 py-3 text-right font-medium text-stone-600 whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {loading ? (
                                <>
                                    <ProductSkeleton />
                                    <ProductSkeleton />
                                    <ProductSkeleton />
                                </>
                            ) : productosFiltrados.length === 0 && (searchTerm || selectedCategory) ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-stone-400">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <p className="text-sm">No se encontraron productos que coincidan con la búsqueda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : productos.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                                        No hay productos registrados
                                    </td>
                                </tr>
                            ) : (
                                productosPagina.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-4 py-3 align-middle">
                                            <div className="flex items-center gap-3">
                                                {producto.imagen_url && (
                                                    <img
                                                        src={producto.imagen_url}
                                                        alt={producto.nombre}
                                                        onClick={() => setSelectedImage(producto.imagen_url)}
                                                        className="w-12 h-16 sm:w-40 sm:h-52 rounded shrink-0 border border-stone-200 cursor-pointer hover:opacity-80 transition-opacity object-cover"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-stone-800">{producto.nombre}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 sm:hidden">
                                                        <span className="text-xs font-semibold text-stone-600">{formatPrecio(producto.precio)}</span>
                                                        {producto.categoria_nombre && (
                                                            <span className="text-xs text-stone-400">· {producto.categoria_nombre}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600 whitespace-nowrap hidden sm:table-cell">
                                            {formatPrecio(producto.precio)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                                            <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                                                {producto.categoria_nombre || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                <Link
                                                    to={`/admin/productos/editar/${producto.id}`}
                                                    className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(producto.id)}
                                                    disabled={deleteId === producto.id}
                                                    className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                >
                                                    {deleteId === producto.id ? (
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
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

            {/* Pagination bar */}
            {!loading && productosFiltrados.length > ITEMS_PER_PAGE && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-stone-500 shrink-0">
                        Mostrando{' '}
                        <span className="font-medium text-stone-700">
                            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, productosFiltrados.length)}
                        </span>{' '}de{' '}
                        <span className="font-medium text-stone-700">{productosFiltrados.length}</span>{' '}productos
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        {(() => {
                            const pages = [];
                            const delta = 2;
                            const range = [];
                            for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
                                range.push(i);
                            }
                            if (range[0] > 1) {
                                pages.push(1);
                                if (range[0] > 2) pages.push('...');
                            }
                            range.forEach(p => pages.push(p));
                            if (range[range.length - 1] < totalPages) {
                                if (range[range.length - 1] < totalPages - 1) pages.push('...');
                                pages.push(totalPages);
                            }
                            return pages.map((p, i) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-stone-400">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`min-w-[2rem] px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                                            currentPage === p
                                                ? 'bg-stone-800 text-white border-stone-800'
                                                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            );
                        })()}
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Image preview modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-lg bg-white p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black rounded-full w-7 h-7 flex items-center justify-center text-xs transition-colors z-10"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✕
                        </button>
                        <img
                            src={selectedImage}
                            alt="Vista previa ampliada"
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}