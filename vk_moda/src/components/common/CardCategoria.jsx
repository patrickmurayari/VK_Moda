import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"

const CardProducts = ({ products }) => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return (
        <div className="md:mt-20 mt-16 px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {products &&
                    products.map((elem, index) => (
                        <Link 
                            key={index}
                            to={elem.id_name} 
                            onClick={scrollToTop}
                            className="group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50 rounded-3xl"
                            aria-label={`Ver productos de ${elem.name}`}
                        >
                            <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-white border border-neutral-200/70 shadow-elegant transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-elegant-hover cursor-pointer">
                                
                                {/* Contenedor de imagen con overlay elegante */}
                                <div className="relative w-full h-72 md:h-80 overflow-hidden bg-neutral-100">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src={elem.image}
                                        alt={elem.name}
                                    />
                                    
                                    {/* Overlay gradiente elegante */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-90"></div>

                                    {/* Título sobre la imagen */}
                                    <div className="absolute inset-x-0 bottom-0 p-5">
                                        <p className="text-white/90 font-heading text-[10px] tracking-[0.28em] uppercase">
                                            Categoría
                                        </p>
                                        <h6 className="mt-2 text-white font-display text-2xl font-light tracking-wide">
                                            {elem.name}
                                        </h6>
                                    </div>
                                    
                                    {/* Icono de flecha en hover */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                            <FiArrowRight className="w-6 h-6 text-primary-900" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Contenido */}
                                <div className="flex flex-col flex-grow px-6 py-6 justify-between bg-white">
                                    <p className="text-neutral-600 font-body text-sm leading-relaxed">
                                        Descubrí piezas seleccionadas con diseño y terminaciones que elevan tu look.
                                    </p>
                                    
                                    {/* CTA */}
                                    <div className="mt-6">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-5 py-2.5 text-[11px] font-heading font-semibold tracking-[0.22em] uppercase text-white transition-colors duration-300 group-hover:bg-accent-600">
                                            Ver productos
                                            <FiArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Borde elegante en hover */}
                                <div className="absolute inset-0 rounded-3xl border border-accent-600/0 group-hover:border-accent-600/35 transition-all duration-500 pointer-events-none"></div>

                                {/* Shine sutil */}
                                <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,126,34,0.18),transparent_55%)]"></div>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

CardProducts.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            id_name: PropTypes.string,
            image: PropTypes.any,
            name: PropTypes.string,
            precio: PropTypes.string,
        })
    ),
};

export default CardProducts;
