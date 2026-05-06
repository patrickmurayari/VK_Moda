import { useEffect, useState } from 'react';
import CategoriaTemplate from "./CategoriaTemplate";
import { getProductosByCategoria } from "../../services/api";

// Import estático original (comentado — datos ahora desde API)
// import { productosIndumentaria } from "../../data/productosData";

const Indumentaria = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosByCategoria('indumentaria')
            .then((data) => {
                const mapped = data.productos.map((p) => ({
                    id: p.id,
                    image: p.imagen_url,
                    name: p.nombre,
                    precio: p.precio,
                    categoria: 'indumentaria',
                }));
                setProductos(mapped);
            })
            .catch((err) => console.error('Error cargando indumentaria:', err))
            .finally(() => setLoading(false));
    }, []);

    return <CategoriaTemplate titulo="INDUMENTARIA" productos={productos} loading={loading} />;
};

export default Indumentaria;