import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight, FiX, FiHeart } from 'react-icons/fi';

function GaleriaProductos({ productos, mostrarPrecio = true }) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);
    const [wishlist, setWishlist] = useState({});

    const productoSeleccionado = indiceSeleccionado !== null ? productos[indiceSeleccionado] : null;

    const toggleWishlist = (id, e) => {
        e.stopPropagation();
        setWishlist(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    
    const cerrarModal = () => {
        setModalAbierto(false);
        setIndiceSeleccionado(null);
    };

    const irAnterior = () => {
        setIndiceSeleccionado((prev) => {
            if (prev === null) return prev;
            return (prev - 1 + productos.length) % productos.length;
        });
    };

    const irSiguiente = () => {
        setIndiceSeleccionado((prev) => {
            if (prev === null) return prev;
            return (prev + 1) % productos.length;
        });
    };

    return (
        <>
            {/* Grid de Productos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productos.map((producto, index) => {
                    const wishlistId = producto.id ?? index;

                    return (
                        <div
                            key={producto.id ?? index}
                            className="group relative"
                        >
                            {/* Contenedor de imagen */}
                            <div className="relative overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-black/5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl">
                                <img
                                    src={producto.image}
                                    alt={producto.name}
                                    className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-[1.03]"
                                />

                                {!mostrarPrecio && (
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-black/75 via-black/15 to-transparent p-4">
                                        <h3 className="text-sm md:text-base font-semibold tracking-wide text-white line-clamp-2">
                                            {producto.name}
                                        </h3>
                                        {producto.colores && (
                                            <p className="mt-1 text-xs md:text-sm text-white/80">
                                                + {producto.colores} colores
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Wishlist button */}
                                <button
                                    onClick={(e) => toggleWishlist(wishlistId, e)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
                                    aria-label={wishlist[wishlistId] ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                                >
                                    <FiHeart
                                        className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                                            wishlist[wishlistId]
                                                ? 'text-red-500 fill-current'
                                                : 'text-gray-600'
                                        }`}
                                    />
                                </button>

                                                            </div>

                            {/* Información del producto */}
                            {mostrarPrecio && (
                                <div className="p-3 md:p-4">
                                    <p className="text-base md:text-lg font-bold text-primary-900 mb-2">
                                        $ {Number(producto.precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>

                                    <h3 className="text-sm md:text-base font-medium text-primary-900 mb-2 line-clamp-2 hover:text-accent-600 transition-colors">
                                        {producto.name}
                                    </h3>

                                    {producto.colores && (
                                        <p className="text-xs md:text-sm text-neutral-600">
                                            + {producto.colores} colores
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal Fullscreen */}
            {modalAbierto && productoSeleccionado && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    {/* Botón Cerrar */}
                    <button
                        onClick={cerrarModal}
                        className="absolute top-6 right-6 text-white hover:text-accent-600 transition-colors z-60"
                        aria-label="Cerrar modal"
                    >
                        <FiX className="text-4xl" />
                    </button>

                    {/* Contenedor Principal */}
                    <div className="flex items-center justify-center gap-8 max-w-6xl w-full">
                        {/* Botón Anterior */}
                        <button
                            onClick={irAnterior}
                            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-accent-600 text-white hover:bg-primary-900 transition-colors"
                            aria-label="Imagen anterior"
                        >
                            <FiChevronLeft className="text-2xl" />
                        </button>

                        {/* Imagen Principal */}
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={productoSeleccionado.image}
                                alt={productoSeleccionado.name}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>

                        {/* Botón Siguiente */}
                        <button
                            onClick={irSiguiente}
                            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-accent-600 text-white hover:bg-primary-900 transition-colors"
                            aria-label="Imagen siguiente"
                        >
                            <FiChevronRight className="text-2xl" />
                        </button>
                    </div>

                    {/* Información del Producto */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 rounded-lg p-6 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-primary-900 mb-2">
                            {productoSeleccionado.name}
                        </h2>
                        {mostrarPrecio && (
                            <p className="text-accent-600 font-bold text-2xl">
                                $ {Number(productoSeleccionado.precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Controles Móvil */}
                    <div className="md:hidden absolute bottom-32 left-0 right-0 flex justify-center gap-4 px-4">
                        <button
                            onClick={irAnterior}
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-600 text-white hover:bg-primary-900 transition-colors"
                            aria-label="Imagen anterior"
                        >
                            <FiChevronLeft className="text-2xl" />
                        </button>
                        <button
                            onClick={irSiguiente}
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-600 text-white hover:bg-primary-900 transition-colors"
                            aria-label="Imagen siguiente"
                        >
                            <FiChevronRight className="text-2xl" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

GaleriaProductos.propTypes = {
    productos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            image: PropTypes.string,
            name: PropTypes.string,
            precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            colores: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })
    ).isRequired,
    mostrarPrecio: PropTypes.bool
};

export default GaleriaProductos;
