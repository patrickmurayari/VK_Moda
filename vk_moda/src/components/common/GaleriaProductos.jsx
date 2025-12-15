import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

function GaleriaProductos({ productos }) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const abrirModal = (index) => {
        setProductoSeleccionado(productos[index]);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setProductoSeleccionado(null);
    };

    const irAnterior = () => {
        const indiceActual = productos.findIndex(p => p.id === productoSeleccionado.id);
        const nuevoIndice = (indiceActual - 1 + productos.length) % productos.length;
        setProductoSeleccionado(productos[nuevoIndice]);
    };

    const irSiguiente = () => {
        const indiceActual = productos.findIndex(p => p.id === productoSeleccionado.id);
        const nuevoIndice = (indiceActual + 1) % productos.length;
        setProductoSeleccionado(productos[nuevoIndice]);
    };

    return (
        <>
            {/* Grid de Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productos.map((producto, index) => (
                    <div
                        key={producto.id}
                        className="group cursor-pointer"
                        onClick={() => abrirModal(index)}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                            <img
                                src={producto.image}
                                alt={producto.name}
                                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 bg-accent-600 rounded-full flex items-center justify-center">
                                        <FiChevronRight className="text-white text-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-primary-900 group-hover:text-accent-600 transition-colors">
                                {producto.name}
                            </h3>
                            <p className="text-accent-600 font-bold text-xl mt-2">
                                {producto.precio}
                            </p>
                        </div>
                    </div>
                ))}
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
                        <p className="text-accent-600 font-bold text-2xl">
                            {productoSeleccionado.precio}
                        </p>
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

export default GaleriaProductos;
