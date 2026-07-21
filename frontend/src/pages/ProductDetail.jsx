import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoByIdPublic } from '@/services/api';
import { formatPrecio } from '@/utils/format';
import { useCart } from '@/context/CartContext';

function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-6rem)]">
                <div className="aspect-[3/4] md:aspect-auto md:min-h-[calc(100vh-6rem)] bg-neutral-100 animate-pulse" />
                <div className="p-6 md:p-12 flex flex-col justify-center gap-6">
                    <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-10 w-3/4 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-6 w-32 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-px w-full bg-neutral-100" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse" />
                    </div>
                    <div className="h-12 w-64 bg-neutral-100 rounded animate-pulse mt-4" />
                </div>
            </div>
        </div>
    );
}

export default function ProductDetail() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [talleSeleccionado, setTalleSeleccionado] = useState(null);
    const [errorTalle, setErrorTalle] = useState(false);
    const { agregarAlCarrito, setDrawerOpen } = useCart();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        getProductoByIdPublic(id)
            .then((data) => {
                setProducto(data);
                setSelectedImage(data.imagen_url);
            })
            .catch((err) => setError(err.message || 'Error al cargar el producto'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <ProductDetailSkeleton />;

    if (error || !producto) {
        return (
            <div className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="font-body text-sm text-neutral-400 mb-6">
                        {error || 'Producto no encontrado'}
                    </p>
                    <Link
                        to="/"
                        className="font-body text-xs uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    // Determinar hilera de talles a mostrar
    const talles = Array.isArray(producto.talles) ? producto.talles : [];
    let hileraTalles = [];
    if (talles.length > 0) {
        if (talles.includes('Único')) {
            hileraTalles = ['Único'];
        } else if (!isNaN(talles[0])) {
            hileraTalles = ['36', '38', '40', '42', '44', '46', '48'];
        } else {
            hileraTalles = ['S', 'M', 'L', 'XL', 'XXL'];
        }
    }

    const handleAgregarAlCarrito = () => {
        if (talles.length > 0 && !talles.includes('Único') && !talleSeleccionado) {
            setErrorTalle(true);
            return;
        }
        setErrorTalle(false);
        agregarAlCarrito(producto, talleSeleccionado);
        setDrawerOpen(true);
    };

    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24">
            {/* Breadcrumb */}
            <div className="px-6 md:px-12 py-4 border-b border-neutral-100">
                <nav className="flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                    <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
                    <span>/</span>
                    {producto.categoria_slug && (
                        <>
                            <Link to={`/categoria/${producto.categoria_slug}`} className="hover:text-black transition-colors">
                                {producto.categoria_nombre}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-black">{producto.nombre}</span>
                </nav>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-10rem)]">
                {/* Left: Image */}
                <div className="aspect-[3/4] md:aspect-auto md:min-h-full bg-white flex flex-col items-center justify-center p-6 md:p-12">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt={producto.nombre}
                            className="w-full h-full object-contain max-h-[80vh] transition-opacity duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
                            <span className="font-body text-xs tracking-widest uppercase text-neutral-300">Sin imagen</span>
                        </div>
                    )}

                    {/* Gallery thumbnails */}
                    {(() => {
                        const allImages = [
                            ...(producto.imagen_url ? [{ imagen_url: producto.imagen_url, etiqueta: 'Principal' }] : []),
                            ...(producto.imagenes_adicionales || [])
                        ];
                        return allImages.length > 1 && (
                            <div className="flex gap-3 mt-6">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img.imagen_url)}
                                        className={`w-12 h-16 overflow-hidden border-2 transition-all ${
                                            selectedImage === img.imagen_url
                                                ? 'border-black'
                                                : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                        title={img.etiqueta}
                                    >
                                        <img
                                            src={img.imagen_url}
                                            alt={img.etiqueta || `Imagen ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                {/* Right: Info */}
                <div className="p-6 md:p-12 flex flex-col justify-center">
                    {/* Category label */}
                    {producto.categoria_nombre && (
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-3">
                            {producto.categoria_nombre}
                        </p>
                    )}

                    {/* Title */}
                    <h1 className="font-display text-2xl md:text-3xl tracking-widest uppercase text-black leading-tight">
                        {producto.nombre}
                    </h1>

                    {/* Price */}
                    {producto.precio && (
                        <p className="font-body text-lg md:text-xl text-neutral-600 mt-4">
                            {formatPrecio(producto.precio)}
                        </p>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-neutral-200 my-6" />

                    {/* Description placeholder */}
                    <div className="mb-8">
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
                            Detalle
                        </p>
                        <p className="font-body text-sm text-neutral-500 leading-relaxed">
                            Producto de indumentaria y confección V&A Diseño y Moda.
                        </p>
                    </div>

                    {/* Talles disponibles */}
                    {hileraTalles.length > 0 && (
                        <div className="mb-6">
                            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-3">
                                Talle
                            </p>
                            <div className={`flex flex-wrap gap-2 rounded p-1 -m-1 transition-all ${errorTalle ? 'ring-1 ring-red-400' : ''}`}>
                                {hileraTalles.map(talle => {
                                    const disponible = talles.includes(talle);
                                    const seleccionado = talleSeleccionado === talle;
                                    return (
                                        <button
                                            key={talle}
                                            disabled={!disponible}
                                            onClick={() => { setTalleSeleccionado(seleccionado ? null : talle); setErrorTalle(false); }}
                                            className={`px-4 py-2 text-xs font-body tracking-wide border transition-all ${
                                                !disponible
                                                    ? 'opacity-40 bg-neutral-50 text-neutral-300 border-neutral-100 line-through cursor-not-allowed'
                                                    : seleccionado
                                                        ? 'bg-black text-white border-black'
                                                        : 'bg-white text-stone-700 border-neutral-300 hover:border-black hover:text-black'
                                            }`}
                                        >
                                            {talle}
                                        </button>
                                    );
                                })}
                            </div>
                            {errorTalle && (
                                <p className="text-red-500 text-xs font-medium mt-2 animate-pulse">
                                    Por favor, seleccioná un talle para continuar.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Agregar al Carrito CTA */}
                    <button
                        onClick={handleAgregarAlCarrito}
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 font-body text-xs uppercase tracking-widest transition-colors bg-black text-white hover:bg-neutral-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Agregar al carrito
                    </button>

                    {/* Back link */}
                    <Link
                        to={producto.categoria_slug ? `/categoria/${producto.categoria_slug}` : '/'}
                        className="font-body text-[10px] tracking-[0.2em] uppercase text-black hover:text-black transition-colors mt-6 inline-block"
                    >
                        ← Volver a la colección
                    </Link>
                </div>
            </div>
        </div>
    );
}
