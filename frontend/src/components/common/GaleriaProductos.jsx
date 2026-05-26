import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { formatPrecio } from '../../utils/format';

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px]">
                {productos.map((producto, index) => (
                    <button
                        key={producto.id ?? index}
                        type="button"
                        onClick={() => {
                            setIndiceSeleccionado(index);
                            setModalAbierto(true);
                        }}
                        className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
                        aria-label={producto.name}
                    >
                        {/* Imagen */}
                        <div className="aspect-[3/4] overflow-hidden bg-neutral-50">
                            <img
                                src={producto.image}
                                alt={producto.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        {/* Información */}
                        {mostrarPrecio && (
                            <div className="px-2 md:px-4 pt-3 pb-2">
                                <h3 className="font-display text-[10px] md:text-sm font-normal tracking-wide text-black line-clamp-1">
                                    {producto.name}
                                </h3>
                                {producto.precio && (
                                    <p className="font-body text-[9px] md:text-xs text-neutral-500 mt-0.5 md:mt-1">
                                        {formatPrecio(producto.precio)}
                                    </p>
                                )}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Modal Fullscreen */}
            {modalAbierto && productoSeleccionado && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    {/* Botón Cerrar */}
                    <button
                        onClick={cerrarModal}
                        className="absolute top-6 right-6 text-white hover:opacity-60 transition-opacity z-[60]"
                        aria-label="Cerrar modal"
                    >
                        <FiX className="w-6 h-6" strokeWidth={1} />
                    </button>

                    {/* Contenedor Principal */}
                    <div className="flex items-center justify-center gap-8 max-w-6xl w-full">
                        {/* Botón Anterior */}
                        <button
                            onClick={irAnterior}
                            className="hidden md:flex items-center justify-center text-white hover:opacity-60 transition-opacity"
                            aria-label="Imagen anterior"
                        >
                            <FiChevronLeft className="w-8 h-8" strokeWidth={1} />
                        </button>

                        {/* Imagen Principal */}
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={productoSeleccionado.image}
                                alt={productoSeleccionado.name}
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        </div>

                        {/* Botón Siguiente */}
                        <button
                            onClick={irSiguiente}
                            className="hidden md:flex items-center justify-center text-white hover:opacity-60 transition-opacity"
                            aria-label="Imagen siguiente"
                        >
                            <FiChevronRight className="w-8 h-8" strokeWidth={1} />
                        </button>
                    </div>

                    {/* Información del Producto */}
                    <div className="absolute bottom-8 left-6 right-6 text-center">
                        <h2 className="font-display text-lg tracking-[0.2em] font-light uppercase text-white">
                            {productoSeleccionado.name}
                        </h2>
                    </div>

                    {/* Controles Móvil */}
                    <div className="md:hidden absolute bottom-20 left-0 right-0 flex justify-center gap-8 px-4">
                        <button
                            onClick={irAnterior}
                            className="text-white hover:opacity-60 transition-opacity"
                            aria-label="Imagen anterior"
                        >
                            <FiChevronLeft className="w-6 h-6" strokeWidth={1} />
                        </button>
                        <button
                            onClick={irSiguiente}
                            className="text-white hover:opacity-60 transition-opacity"
                            aria-label="Imagen siguiente"
                        >
                            <FiChevronRight className="w-6 h-6" strokeWidth={1} />
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
