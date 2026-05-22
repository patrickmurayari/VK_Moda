import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GaleriaProductos from "../common/GaleriaProductos";
import { getCategorias, getProductosByCategoria } from "../../services/api";

function CategoriaTemplate() {
    const { slug } = useParams();
    const [titulo, setTitulo] = useState('');
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);

        const fetchCategoria = async () => {
            try {
                const categorias = await getCategorias();
                const cat = categorias.find(c => c.slug === slug);
                const nombre = cat?.nombre || slug.replace(/-/g, ' ').toUpperCase();
                setTitulo(nombre);

                const data = await getProductosByCategoria(slug);
                const mapped = (data.productos || []).map((p) => ({
                    id: p.id,
                    image: p.imagen_url,
                    name: p.nombre,
                    precio: p.precio,
                    colores: p.colores,
                    categoria: slug,
                }));
                setProductos(mapped);
            } catch (err) {
                console.error('Error cargando categoría:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoria();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center pt-20">
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-black/20 animate-pulse" />
                    <p className="text-xs font-body tracking-[0.3em] uppercase text-black/30">Cargando</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24">
            {/* Header */}
            <div className="px-6 md:px-8 lg:px-12 pt-8 pb-6">
                <h1 className="font-display text-3xl md:text-4xl tracking-[0.3em] font-light uppercase text-black">
                    {titulo}
                </h1>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-3">
                    {productos.length} ARTÍCULO{productos.length !== 1 ? 'S' : ''}
                </p>
            </div>

            {/* Filter / Sort Bar */}
            <div className="border-b-[0.5px] border-neutral-100 px-6 md:px-8 lg:px-12 py-4 flex items-center justify-between">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 cursor-pointer hover:text-black transition-colors duration-300">
                    Ordenar por
                </span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-neutral-400 cursor-pointer hover:text-black transition-colors duration-300">
                    Filtros
                </span>
            </div>

            {/* Product Grid */}
            <div className="py-10">
                <GaleriaProductos productos={productos} mostrarPrecio={true} />
            </div>
        </div>
    );
}

export default CategoriaTemplate;
