import { useState } from "react";
import BuscadorProductos from "../common/BuscadorProductos";
import GaleriaProductos from "../common/GaleriaProductos";

function CategoriaTemplate({ titulo, productos }) {
    const [productosFiltrados, setProductosFiltrados] = useState(productos);

    const handleFiltro = (productosFiltrados) => {
        setProductosFiltrados(productosFiltrados);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Encabezado */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-elegant font-bold text-primary-900 mb-4 tracking-wide">
                        {titulo}
                    </h1>
                    <div className="w-24 h-1 bg-accent-600 mx-auto rounded-full"></div>
                    <p className="text-neutral-600 mt-6 text-lg">
                        Descubre nuestra colección exclusiva de {titulo.toLowerCase()}
                    </p>
                </div>

                {/* Buscador y Filtros */}
                <div className="mb-12">
                    <BuscadorProductos 
                        productos={productos} 
                        onFiltro={handleFiltro}
                    />
                </div>

                {/* Galería de Productos */}
                {productosFiltrados.length > 0 ? (
                    <GaleriaProductos productos={productosFiltrados} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 text-lg">
                            No se encontraron productos que coincidan con tu búsqueda.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoriaTemplate;
