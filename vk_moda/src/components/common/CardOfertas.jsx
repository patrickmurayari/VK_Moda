const CardOfertas = ({ products }) => {
    return (
        <div className="mt-20 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                {products &&
                    products.map((elem, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center justify-center w-full h-auto transition-all duration-500 hover:shadow-elegant-hover"
                        >
                            {/* Badge de Oferta */}
                            <div className="absolute top-4 right-4 z-20 bg-accent-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-elegant-lg transform group-hover:scale-110 transition-transform duration-300">
                                ¡Oferta!
                            </div>

                            {/* Contenedor de imagen */}
                            <div className="relative w-full overflow-hidden rounded-lg shadow-elegant">
                                <img
                                    className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={elem.image}
                                    alt={elem.name}
                                />
                                {/* Overlay oscuro en hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 rounded-lg"></div>
                            </div>

                            {/* Contenido */}
                            <div className="flex flex-col gap-3 items-center justify-center w-full mt-6">
                                <h6 
                                    data-aos="fade" 
                                    data-aos-duration="3000"
                                    className="text-lg md:text-lg font-medium text-primary-900 text-center"
                                >
                                    {elem.name}
                                </h6>
                                
                                <div className="flex items-center gap-2">
                                    <h3 
                                        data-aos="fade" 
                                        data-aos-duration="3000"
                                        className="text-2xl md:text-3xl font-elegant font-bold text-accent-600"
                                    >
                                        {elem.precio}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CardOfertas;
