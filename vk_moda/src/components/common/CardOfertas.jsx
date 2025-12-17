import { FiHeart, FiEye } from "react-icons/fi"
import { useState } from "react"

const CardOfertas = ({ products }) => {
    const [wishlist, setWishlist] = useState({});

    const toggleWishlist = (id, e) => {
        e.stopPropagation();
        setWishlist(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products &&
                    products.map((elem, index) => {
                        const precioSinImpuestos = (elem.precio * 0.826).toFixed(2);
                        
                        return (
                            <div
                                key={index}
                                className="group relative bg-white"
                            >
                                {/* Contenedor de imagen */}
                                <div className="relative overflow-hidden bg-neutral-50">
                                    <img
                                        className="w-full h-auto object-cover aspect-[3/4]"
                                        src={elem.image}
                                        alt={elem.name}
                                    />
                                    
                                    {/* Badge de oferta */}
                                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs md:text-sm shadow-lg">
                                        ¡OFERTA!
                                    </div>
                                    
                                    {/* Wishlist button */}
                                    <button 
                                        onClick={(e) => toggleWishlist(elem.id || index, e)}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
                                        aria-label={wishlist[elem.id || index] ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                                    >
                                        <FiHeart 
                                            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                                                wishlist[elem.id || index] 
                                                    ? 'text-red-500 fill-current' 
                                                    : 'text-gray-600'
                                            }`} 
                                        />
                                    </button>
                                    
                                    {/* Quick view button */}
                                    <button 
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
                                            $ {elem.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-xs md:text-sm text-neutral-500">
                                            *Precio sin impuestos nacionales: <span className="text-accent-600 font-semibold">$ {precioSinImpuestos}</span>
                                        </p>
                                    </div>
                                    
                                    {/* Nombre del producto */}
                                    <h3 className="text-sm md:text-base font-medium text-primary-900 mb-2 line-clamp-2 hover:text-accent-600 transition-colors">
                                        {elem.name}
                                    </h3>
                                    
                                    {/* Colores disponibles */}
                                    {elem.colores && (
                                        <p className="text-xs md:text-sm text-neutral-600">
                                            + {elem.colores} colores
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default CardOfertas;
