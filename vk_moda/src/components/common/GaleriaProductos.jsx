import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX, FiHeart, FiEye } from 'react-icons/fi';

function GaleriaProductos({ productos }) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [wishlist, setWishlist] = useState({});

    const toggleWishlist = (id, e) => {
        e.stopPropagation();
        setWishlist(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productos.map((producto, index) => {
                    const precioSinImpuestos = (producto.precio * 0.826).toFixed(2);
                    
                    return (
                        <div
                            key={producto.id}
                            className="group relative bg-white"
                        >
                            {/* Contenedor de imagen */}
                            <div className="relative overflow-hidden bg-neutral-50">
                                <img
                                    src={producto.image}
                                    alt={producto.name}
                                    className="w-full h-auto object-cover aspect-[3/4]"
                                />
                                
                                {/* Wishlist button */}
                                <button 
                                    onClick={(e) => toggleWishlist(producto.id, e)}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
                                    aria-label={wishlist[producto.id] ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                                >
                                    <FiHeart 
                                        className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                                            wishlist[producto.id] 
                                                ? 'text-red-500 fill-current' 
                                                : 'text-gray-600'
                                        }`} 
                                    />
                                </button>
                                
                                {/* Quick view button */}
                                <button 
                                    onClick={() => abrirModal(index)}
                                    className="absolute bottom-3 right-3 w-10 h-10 md:w-12 md:h-12 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors shadow-lg z-10"
                                    aria-label="Vista rápida"
                                >
                                    <FiEye className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>

                            {/* Información del producto */}
                            <div className="p-3 md:p-4">
                                {/* Precio */}
                                <div className="mb-2">
                                    <p className="text-base md:text-lg font-bold text-primary-900">
                                        $ {producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs md:text-sm text-neutral-500">
                                        *Precio sin impuestos nacionales: <span className="text-accent-600 font-semibold">$ {precioSinImpuestos}</span>
                                    </p>
                                </div>
                                
                                {/* Nombre del producto */}
                                <h3 className="text-sm md:text-base font-medium text-primary-900 mb-2 line-clamp-2 hover:text-accent-600 transition-colors">
                                    {producto.name}
                                </h3>
                                
                                {/* Colores disponibles */}
                                {producto.colores && (
                                    <p className="text-xs md:text-sm text-neutral-600">
                                        + {producto.colores} colores
                                    </p>
                                )}
                            </div>
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
