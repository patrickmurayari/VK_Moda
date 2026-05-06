import { useEffect, useState } from 'react';
import CategoriaTemplate from "./CategoriaTemplate";
import { getProductosByCategoria } from "../../services/api";

// Import estático original (comentado — datos ahora desde API)
// import { productosVestidos } from "../../data/productosData";

const Vestidos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosByCategoria('vestidos')
            .then((data) => {
                const mapped = data.productos.map((p) => ({
                    id: p.id,
                    image: p.imagen_url,
                    name: p.nombre,
                    precio: p.precio,
                    categoria: 'vestidos',
                }));
                setProductos(mapped);
            })
            .catch((err) => console.error('Error cargando vestidos:', err))
            .finally(() => setLoading(false));
    }, []);

    return <CategoriaTemplate titulo="VESTIDOS" productos={productos} loading={loading} />;
};

export default Vestidos;