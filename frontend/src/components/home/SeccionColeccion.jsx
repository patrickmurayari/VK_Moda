import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductosDestacados } from '../../services/api';
import { formatPrecio } from '../../utils/format';

function SeccionColeccion() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosDestacados(4)
            .then(setProductos)
            .catch((err) => console.error('Error cargando productos destacados:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="mt-16 md:mt-20 pt-20" id="coleccion">
            {/* Título */}
            <div className="text-center mb-10 md:mb-14 px-4">
                <h2 className="text-primary-900 font-display text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] uppercase">
                    Colección
                </h2>
            </div>

            {/* Grilla edge-to-edge */}
            {!loading && productos.length > 0 && (
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-neutral-200">
                    {productos.slice(0, 4).map((producto) => (
                        <Link key={producto.id} to={`/producto/${producto.id}`} className="group bg-white">
                            <div className="aspect-[3/4] overflow-hidden bg-white p-2 md:p-4">
                                <img
                                    src={producto.imagen_url}
                                    alt={producto.nombre}
                                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="px-3 md:px-4 pt-3 pb-4">
                                <h3 className="font-display text-[10px] md:text-sm font-normal tracking-wide text-black line-clamp-1">
                                    {producto.nombre}
                                </h3>
                                {producto.precio && (
                                    <p className="font-body text-[9px] md:text-xs text-neutral-500 mt-0.5 md:mt-1">
                                        {formatPrecio(producto.precio)}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SeccionColeccion;
