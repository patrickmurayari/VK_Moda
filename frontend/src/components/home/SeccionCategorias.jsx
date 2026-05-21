import { useEffect, useState } from 'react';
import CardProducts from "../common/CardCategoria";
import { getCategorias } from "../../services/api";

// Import estático original (comentado — datos ahora desde API)
// import { ProductsCategoria } from "../../data/categoriasData";

function SeccionCategorias() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategorias()
            .then((data) => {
                const mapped = data.map((cat) => ({
                    id: cat.id,
                    id_name: cat.slug,
                    image: cat.imagen_url,
                    name: cat.nombre,
                }));
                setCategories(mapped);
            })
            .catch((err) => console.error('Error cargando categorías:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section id="categorias">
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
                        <p className="text-xs font-body tracking-[0.3em] uppercase text-black/30">Cargando</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="categorias">
            <CardProducts products={categories} />
        </section>
    );
}

export default SeccionCategorias;
