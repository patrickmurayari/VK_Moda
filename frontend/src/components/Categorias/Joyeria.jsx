import { useEffect, useState } from 'react';
import CategoriaTemplate from "./CategoriaTemplate";
import { getProductosByCategoria } from "../../services/api";

// Import estático original (comentado — datos ahora desde API)
// import { productosJoyeria } from "../../data/productosData";

const Joyeria = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosByCategoria('joyeria')
            .then((data) => {
                const mapped = data.productos.map((p) => ({
                    id: p.id,
                    image: p.imagen_url,
                    name: p.nombre,
                    precio: p.precio,
                    categoria: 'joyeria',
                }));
                setProductos(mapped);
            })
            .catch((err) => console.error('Error cargando joyería:', err))
            .finally(() => setLoading(false));
    }, []);

    return <CategoriaTemplate titulo="JOYERÍA" productos={productos} loading={loading} />;
};

export default Joyeria;