const CardNuevaColeccion = ({ products }) => {
    return (
        <div className="mt-20 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                {products &&
                    products.map((elem, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center justify-center w-full h-auto transition-all duration-500 hover:shadow-elegant-hover"
                        >
                            {/* Contenedor de imagen */}
                            <div className="relative w-full overflow-hidden rounded-lg shadow-elegant">
                                <img
                                    className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={elem.image}
                                    alt={elem.name}
                                />
                                {/* Overlay oscuro en hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 rounded-lg"></div>
                            </div>

                            {/* Contenido */}
                            <div className="flex flex-col gap-4 items-center justify-center w-full mt-6">
                                <h6 className="text-lg md:text-2xl font-elegant font-semibold text-primary-900 text-center tracking-wide">
                                    {elem.name}
                                </h6>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CardNuevaColeccion;