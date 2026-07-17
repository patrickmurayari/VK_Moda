import { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrecio } from '../../utils/format';

const WHATSAPP_NUMBER = '541126073801';

function buildWhatsappMessage(items, totalPrecio) {
    const lineas = items.map((item) => {
        const talleStr = item.talle ? ` (Talle: ${item.talle})` : '';
        const subtotal = item.precio * item.cantidad;
        return `• ${item.cantidad}x ${item.nombre}${talleStr} — ${formatPrecio(subtotal)}`;
    });
    return (
        `Hola! Quiero realizar el siguiente pedido:\n\n` +
        lineas.join('\n') +
        `\n\n*Total: ${formatPrecio(totalPrecio)}*`
    );
}

export default function CartDrawer() {
    const {
        items,
        drawerOpen,
        setDrawerOpen,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        totalPrecio,
    } = useCart();

    // Bloquear scroll cuando el drawer está abierto
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [setDrawerOpen]);

    const handleWhatsapp = () => {
        const msg = encodeURIComponent(buildWhatsappMessage(items, totalPrecio));
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
        vaciarCarrito();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px] transition-opacity duration-400 ${
                    drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setDrawerOpen(false)}
            />

            {/* Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-[95] flex flex-col bg-white w-full max-w-sm shadow-2xl transition-transform duration-500 ease-in-out ${
                    drawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-black" strokeWidth={1.5} />
                        <span className="font-body text-xs tracking-[0.2em] uppercase">
                            Carrito {items.length > 0 && `(${items.reduce((s, i) => s + i.cantidad, 0)})`}
                        </span>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="hover:opacity-50 transition-opacity"
                        aria-label="Cerrar bolsa"
                    >
                        <X className="w-5 h-5" strokeWidth={1} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                            <ShoppingBag className="w-10 h-10 text-neutral-200" strokeWidth={1} />
                            <p className="font-body text-xs tracking-[0.15em] uppercase text-neutral-400">
                                Tu carrito está vacío
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-100">
                            {items.map((item) => (
                                <li key={item.idUnique} className="flex gap-4 p-5">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-20 flex-shrink-0 bg-neutral-50 overflow-hidden">
                                        {item.imagen_url ? (
                                            <img
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-100" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                            <p className="font-body text-xs tracking-wide text-black leading-snug line-clamp-2">
                                                {item.nombre}
                                            </p>
                                            {item.talle && (
                                                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-neutral-400 mt-0.5">
                                                    Talle {item.talle}
                                                </p>
                                            )}
                                            <p className="font-body text-xs text-neutral-600 mt-1">
                                                {formatPrecio(item.precio)}
                                            </p>
                                        </div>

                                        {/* Quantity + Delete */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-neutral-200">
                                                <button
                                                    onClick={() => actualizarCantidad(item.idUnique, item.cantidad - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                                                    aria-label="Reducir cantidad"
                                                >
                                                    <Minus className="w-3 h-3" strokeWidth={1.5} />
                                                </button>
                                                <span className="w-7 h-7 flex items-center justify-center font-body text-xs text-black select-none">
                                                    {item.cantidad}
                                                </span>
                                                <button
                                                    onClick={() => actualizarCantidad(item.idUnique, item.cantidad + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    <Plus className="w-3 h-3" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => eliminarDelCarrito(item.idUnique)}
                                                className="text-neutral-300 hover:text-red-500 transition-colors"
                                                aria-label="Eliminar prenda"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="flex-shrink-0 border-t border-neutral-100 px-6 py-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400">Total</span>
                            <span className="font-body text-sm text-black font-medium">{formatPrecio(totalPrecio)}</span>
                        </div>
                        <button
                            onClick={handleWhatsapp}
                            className="w-full py-3.5 bg-black text-white font-body text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-neutral-800 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Finalizar pedido por WhatsApp
                        </button>
                        <button
                            onClick={vaciarCarrito}
                            className="w-full text-center font-body text-[10px] tracking-[0.15em] uppercase text-neutral-400 hover:text-black transition-colors py-1"
                        >
                            Vaciar bolsa
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
