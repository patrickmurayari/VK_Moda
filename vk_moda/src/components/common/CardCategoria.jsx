import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"

const CardProducts = ({ products }) => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return (
        <div className="md:mt-20 mt-16 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                {products &&
                    products.map((elem, index) => (
                        <Link 
                            key={index}
                            to={elem.id_name} 
                            onClick={scrollToTop}
                            className="group h-full"
                        >
                            <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-700 hover:shadow-2xl cursor-pointer">
                                
                                {/* Contenedor de imagen con overlay elegante */}
                                <div className="relative w-full h-72 md:h-80 overflow-hidden bg-neutral-100">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={elem.image}
                                        alt={elem.name}
                                    />
                                    
                                    {/* Overlay gradiente elegante */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Icono de flecha en hover */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                            <FiArrowRight className="w-6 h-6 text-primary-900" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Contenido */}
                                <div className="flex flex-col flex-grow px-6 py-8 justify-between">
                                    <div>
                                        <h6 
                                            className="text-xl md:text-2xl font-elegant font-semibold text-primary-900 tracking-wide group-hover:text-accent-600 transition-colors duration-300"
                                        >
                                            {elem.name}
                                        </h6>
                                        <div className="w-12 h-0.5 bg-accent-600 mt-3 group-hover:w-16 transition-all duration-500"></div>
                                    </div>
                                    
                                    {/* Botón integrado */}
                                    <div className="mt-6 pt-6 border-t border-neutral-200 group-hover:border-accent-600 transition-colors duration-300">
                                        <button 
                                            className="w-full px-4 py-3 text-sm font-medium text-primary-900 bg-neutral-50 rounded-lg transition-all duration-300 group-hover:bg-accent-600 group-hover:text-white flex items-center justify-center gap-2 hover:gap-3"
                                        >
                                            Ver Productos
                                            <FiArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Borde elegante en hover */}
                                <div className="absolute inset-0 rounded-2xl border border-accent-600/0 group-hover:border-accent-600/30 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default CardProducts;
