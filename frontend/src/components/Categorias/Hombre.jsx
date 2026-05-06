import { useEffect, useState } from 'react';
import CategoriaTemplate from "./CategoriaTemplate";
import { getProductosByCategoria } from "../../services/api";

// Import estático original (comentado — datos ahora desde API)
// import { productosHombre } from "../../data/productosData";

const Hombre = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosByCategoria('hombre')
            .then((data) => {
                const mapped = data.productos.map((p) => ({
                    id: p.id,
                    image: p.imagen_url,
                    name: p.nombre,
                    precio: p.precio,
                    categoria: 'hombre',
                }));
                setProductos(mapped);
            })
            .catch((err) => console.error('Error cargando hombre:', err))
            .finally(() => setLoading(false));
    }, []);

    return <CategoriaTemplate titulo="HOMBRE" productos={productos} loading={loading} />;
};

export default Hombre;
