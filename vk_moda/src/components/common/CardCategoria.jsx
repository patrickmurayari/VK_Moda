import { Link } from "react-router-dom"

const CardProducts = ({ products }) => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return (
        <div className="md:mt-20 mt-16 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                {products &&
                    products.map((elem, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center justify-center w-full h-auto md:h-96 transition-all duration-500 hover:shadow-elegant-hover"
                        >
                            {/* Contenedor de imagen */}
                            <div className="relative w-full overflow-hidden rounded-lg shadow-elegant">
                                <img
                                    data-aos="fade-in" 
                                    data-aos-duration="1500"
                                    className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={elem.image}
                                    alt={elem.name}
                                />
                                {/* Overlay oscuro en hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 rounded-lg"></div>
                            </div>
                            
                            {/* Contenido */}
                            <div className="flex flex-col gap-4 items-center justify-center w-full mt-6">
                                <h6 
                                    data-aos="fade-in" 
                                    data-aos-duration="1500" 
                                    className="text-lg md:text-2xl font-elegant font-semibold text-primary-900 text-center tracking-wide"
                                >
                                    {elem.name}
                                </h6>
                                
                                <Link to={elem.id_name} onClick={scrollToTop} className="w-full">
                                    <button 
                                        data-aos="zoom-in-right" 
                                        data-aos-duration="1500"
                                        className="w-full md:w-56 px-6 py-3 bg-primary-900 text-white font-medium text-sm rounded-lg transition-all duration-300 hover:bg-accent-600 hover:shadow-elegant-lg transform hover:scale-105 active:scale-95"
                                    >
                                        Ver Productos
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CardProducts;
