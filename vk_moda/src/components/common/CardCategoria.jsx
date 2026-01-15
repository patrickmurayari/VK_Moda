import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"

const CardProducts = ({ products }) => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
 
     const renderCard = (elem, key) => (
         <Link 
             key={key}
             to={elem.id_name} 
             onClick={scrollToTop}
             className="group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50"
             aria-label={`Ver productos de ${elem.name}`}
         >
             <div className="relative h-full flex flex-col overflow-hidden bg-white border border-neutral-200/70 shadow-elegant transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-elegant-hover cursor-pointer">
                 
                 {/* Contenedor de imagen con overlay elegante */}
                 <div className="relative w-full h-96 md:h-[32rem] overflow-hidden bg-neutral-100">
                     <img
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         src={elem.image}
                         alt={elem.name}
                     />
                     
                     {/* Overlay gradiente elegante */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-90"></div>
 
                     {/* Título sobre la imagen */}
                     <div className="hidden" aria-hidden="true"></div>
                     
                     {/* Icono de flecha en hover */}
                     <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                             <FiArrowRight className="w-6 h-6 text-primary-900" />
                         </div>
                     </div>
                 </div>
                 
                 {/* Contenido */}
                 <div className="flex flex-col flex-grow px-6 py-6 justify-between bg-white">
                     <h6 className="text-primary-900 font-display text-2xl font-light tracking-wide">
                         {elem.name}
                     </h6>
                     {/* CTA */}
                     <div className="mt-6">
                         <div className="inline-flex items-center gap-2 bg-primary-900 px-5 py-2.5 text-[11px] font-heading font-semibold tracking-[0.22em] uppercase text-white transition-colors duration-300 group-hover:bg-accent-600">
                             Ver productos
                             <FiArrowRight className="w-4 h-4" />
                         </div>
                     </div>
                 </div>
                 
                 {/* Borde elegante en hover */}
                 <div className="absolute inset-0 border border-accent-600/0 group-hover:border-accent-600/35 transition-all duration-500 pointer-events-none"></div>
 
                 {/* Shine sutil */}
                 <div className="pointer-events-none absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,126,34,0.18),transparent_55%)]"></div>
                 </div>
             </div>
         </Link>
     );
    
    return (
        <div className="md:mt-20 mt-16 px-2 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
                    {products && products.slice(0, 3).map((elem, index) => renderCard(elem, elem.id ?? index))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8 md:max-w-4xl md:mx-auto">
                    {products && products.slice(3, 5).map((elem, index) => renderCard(elem, elem.id ?? index + 3))}
                </div>
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
