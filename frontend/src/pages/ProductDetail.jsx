import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductoByIdPublic } from '@/services/api';
import { formatPrecio } from '@/utils/format';

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

    const whatsappMsg = encodeURIComponent(
        `Hola, me interesa el producto: ${producto.nombre} ($${producto.precio})`
    );
    const whatsappUrl = `https://wa.me/541126073801?text=${whatsappMsg}`;

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

                    {/* Color variant thumbnails */}
                    {(() => {
                        const allImages = [
                            ...(producto.imagen_url ? [{ imagen_url: producto.imagen_url, color: 'Principal' }] : []),
                            ...(producto.colores_variantes || [])
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
                                        title={img.color}
                                    >
                                        <img
                                            src={img.imagen_url}
                                            alt={img.color}
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

                    {/* Color variants */}
                    {(() => {
                        const allColors = [
                            ...(producto.imagen_url ? [{ imagen_url: producto.imagen_url, color: 'Principal' }] : []),
                            ...(producto.colores_variantes || [])
                        ];
                        return allColors.length > 0 ? (
                            <div className="mb-6">
                                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-3">
                                    Colores disponibles
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {allColors.map((variante, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(variante.imagen_url)}
                                            className={`px-3 py-1.5 text-xs font-body tracking-wide border transition-all ${
                                                selectedImage === variante.imagen_url
                                                    ? 'border-black text-black'
                                                    : 'border-neutral-200 text-neutral-400 hover:text-black'
                                            }`}
                                        >
                                            {variante.color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : producto.colores ? (
                            <div className="mb-6">
                                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
                                    Colores disponibles
                                </p>
                                <p className="font-body text-sm text-neutral-700">
                                    {producto.colores}
                                </p>
                            </div>
                        ) : null;
                    })()}
                    {/* Description placeholder */}
                    <div className="mb-8">
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
                            Detalle
                        </p>
                        <p className="font-body text-sm text-neutral-500 leading-relaxed">
                            Producto de indumentaria y confección V&A Diseño y Moda.
                        </p>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 bg-black text-white font-body text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Consultar por WhatsApp
                    </a>

                    {/* Back link */}
                    <Link
                        to={producto.categoria_slug ? `/categoria/${producto.categoria_slug}` : '/'}
                        className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors mt-6 inline-block"
                    >
                        ← Volver a la colección
                    </Link>
                </div>
            </div>
        </div>
    );
}
