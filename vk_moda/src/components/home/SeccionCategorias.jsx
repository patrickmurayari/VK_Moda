import CardProducts from "../common/CardCategoria";
import { ProductsCategoria } from "../../data/categoriasData";

function SeccionCategorias() {
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
            <CardProducts products={ProductsCategoria} />
        </section>
    );
}

export default SeccionCategorias;
