import { useEffect, useState } from 'react';
import CategoriaTemplate from "./CategoriaTemplate";
import { getProductosByCategoria } from "../../services/api";

// Import estático original (comentado — datos ahora desde API)
// import { productosBolsos } from "../../data/productosData";

const Bolsos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosByCategoria('bolsos')
            .then((data) => {
                const mapped = data.productos.map((p) => ({
                    id: p.id,
                    image: p.imagen_url,
                    name: p.nombre,
                    precio: p.precio,
                    categoria: 'bolsos',
                }));
                setProductos(mapped);
            })
            .catch((err) => console.error('Error cargando bolsos:', err))
            .finally(() => setLoading(false));
    }, []);

    return <CategoriaTemplate titulo="BOLSOS" productos={productos} loading={loading} />;
};

export default Bolsos;