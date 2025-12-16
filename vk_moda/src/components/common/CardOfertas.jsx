const CardOfertas = ({ products }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {products &&
                    products.map((elem, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer"
                        >
                            {/* Contenedor de imagen con badge */}
                            <div className="relative overflow-hidden mb-6">
                                <div className="relative h-96 overflow-hidden bg-neutral-100">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={elem.image}
                                        alt={elem.name}
                                    />
                                    {/* Overlay elegante */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500"></div>
                                    
                                    {/* Badge de descuento - Posicionado elegantemente */}
                                    <div className="absolute top-6 right-6 z-10 bg-accent-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-elegant-lg transform group-hover:scale-110 transition-transform duration-300">
                                        ¡Oferta!
                                    </div>
                                </div>
                            </div>

                            {/* Información del producto */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-elegant font-semibold text-primary-900 group-hover:text-accent-600 transition-colors duration-300 tracking-wide line-clamp-2">
                                    {elem.name}
                                </h3>
                                
                                {/* Línea decorativa */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-neutral-300"></div>
                                    <p className="text-accent-600 font-bold text-2xl whitespace-nowrap">
                                        {elem.precio}
                                    </p>
                                    <div className="h-px flex-1 bg-neutral-300"></div>
                                </div>
                                
                                {/* Texto de interacción */}
                                <p className="text-neutral-500 text-sm font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                                    Ver detalles
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CardOfertas;
