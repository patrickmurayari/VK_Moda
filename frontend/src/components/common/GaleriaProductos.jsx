import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight, FiX, FiShoppingBag } from 'react-icons/fi';

function GaleriaProductos({ productos, mostrarPrecio = true }) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);

    const productoSeleccionado = indiceSeleccionado !== null ? productos[indiceSeleccionado] : null;

    
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-0 lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:border-neutral-200">
                {productos.map((producto, index) => {
                    return (
                        <div
                            key={producto.id ?? index}
                            className="group relative w-full lg:px-6"
                        >
                            {/* Contenedor de imagen */}
                            <div className="relative overflow-hidden rounded-none bg-neutral-50 ring-1 ring-black/5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl">
                                <img
                                    src={producto.image}
                                    alt={producto.name}
                                    className="w-full object-cover h-[78vh] sm:h-auto sm:aspect-[3/4] lg:h-[72vh] lg:aspect-auto transition-transform duration-700 group-hover:scale-[1.02]"
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
                                    type="button"
                                    onClick={() => {
                                        setIndiceSeleccionado(index);
                                        setModalAbierto(true);
                                    }}
                                    className="absolute left-1/2 bottom-5 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-md transition-colors z-10 hover:bg-white"
                                    aria-label="Ver producto"
                                >
                                    <FiShoppingBag className="w-5 h-5 text-neutral-700" />
                                </button>
                            </div>

                            {/* Información del producto */}
                            {mostrarPrecio && (
                                <div className="pt-7 pb-6 text-center">
                                    <h3 className="text-[15px] md:text-sm font-body font-medium tracking-wide text-accent-600 mb-1 line-clamp-2 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:text-accent-700">
                                        {producto.name}
                                    </h3>

                                    {producto.colores && (
                                        <p className="mt-2 text-xs md:text-sm text-neutral-600">
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
