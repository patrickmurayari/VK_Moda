import { useEffect, useState } from 'react';
import CardProducts from "../common/CardCategoria";
import { getHomeCategorias } from "../../services/api";

function SeccionCategorias() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHomeCategorias()
            .then((data) => {
                const mapped = data
                    .filter((row) => row.categoria_id && row.imagen_url)
                    .map((row) => ({
                        id: row.categoria_id,
                        id_name: row.slug,
                        image: row.imagen_url,
                        name: row.nombre,
                    }));
                setCategories(mapped);
            })
            .catch((err) => console.error('Error cargando categorías home:', err))
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
