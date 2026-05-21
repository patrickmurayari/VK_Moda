import PropTypes from "prop-types"
import { Link } from "react-router-dom"

const CardProducts = ({ products }) => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const renderCard = (elem, key) => (
        <Link
            key={key}
            to={elem.id_name}
            onClick={scrollToTop}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
            aria-label={`Ver productos de ${elem.name}`}
        >
            <div className="overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden">
                    <img
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        src={elem.image}
                        alt={elem.name}
                        loading="lazy"
                    />
                </div>
                <div className="py-8 text-center">
                    <span className="font-display text-sm md:text-base font-light tracking-[0.3em] uppercase text-neutral-900">
                        {elem.name}
                    </span>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-neutral-200/50">
                {products && products.map((elem, index) => renderCard(elem, elem.id ?? index))}
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
        })
    ),
};

export default CardProducts;
