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
            <section id="categorias" className="md:mt-24 mt-16 px-4 md:px-0">
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-accent-600 animate-pulse" aria-hidden="true" />
                        <p className="text-sm font-body text-neutral-700">Cargando categorías…</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="categorias" className="md:mt-24 mt-16 px-4 md:px-0">
            <div className="text-center mb-12 md:mb-16">
                <div className="inline-block">
                    <p className="text-accent-600 text-sm md:text-base font-medium tracking-widest uppercase mb-4">Explora Nuestras Colecciones</p>
                    <h1 className="text-primary-900 font-elegant text-4xl md:text-6xl font-bold tracking-wide leading-tight">
                        Categorías Destacadas
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <div className="w-12 h-0.5 bg-accent-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                        <div className="w-12 h-0.5 bg-accent-600 rounded-full"></div>
                    </div>
                </div>
                <p className="text-neutral-600 text-base md:text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
                    Descubre nuestras colecciones cuidadosamente seleccionadas, diseñadas para reflejar tu estilo único y personalidad
                </p>
            </div>
            <CardProducts products={categories} />
        </section>
    );
}

export default SeccionCategorias;
