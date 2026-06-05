import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatPrecio } from '../../utils/format';

function GaleriaProductos({ productos, mostrarPrecio = true }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px]">
            {productos.map((producto, index) => (
                <Link
                    key={producto.id ?? index}
                    to={`/producto/${producto.id}`}
                    className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
                    aria-label={producto.name}
                >
                    {/* Imagen */}
                    <div className="aspect-[3/4] overflow-hidden bg-white p-2 md:p-4">
                        <img
                            src={producto.image}
                            alt={producto.name}
                            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>

                    {/* Información */}
                    {mostrarPrecio && (
                        <div className="px-2 md:px-4 pt-3 pb-2">
                            <h3 className="font-display text-[10px] md:text-sm font-normal tracking-wide text-black line-clamp-1">
                                {producto.name}
                            </h3>
                            {producto.precio && (
                                <p className="font-body text-[9px] md:text-xs text-neutral-500 mt-0.5 md:mt-1">
                                    {formatPrecio(producto.precio)}
                                </p>
                            )}
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
}

GaleriaProductos.propTypes = {
    productos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            image: PropTypes.string,
            name: PropTypes.string,
            precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            colores: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })
    ).isRequired,
    mostrarPrecio: PropTypes.bool
};

export default GaleriaProductos;
