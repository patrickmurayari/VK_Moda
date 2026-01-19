import GaleriaProductos from "../common/GaleriaProductos";

function CategoriaTemplate({ titulo, productos }) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-96 bg-gradient-to-r from-primary-900 via-primary-800 to-accent-600 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900 rounded-full -ml-40 -mb-40"></div>
                </div>
                
                <div className="relative h-full flex flex-col items-center justify-center px-4">
                    <h1 className="text-5xl md:text-6xl font-elegant font-bold text-white mb-6 tracking-wider text-center">
                        {titulo}
                    </h1>
                    <div className="w-32 h-1 bg-accent-400 rounded-full"></div>
                    <p className="text-white/80 mt-8 text-lg md:text-xl text-center max-w-2xl font-light">
                        Explora nuestra colección exclusiva de {titulo.toLowerCase()}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="w-full px-2 sm:px-4 md:px-8 lg:px-12 py-20">
                {/* Decoración superior */}
                <div className="flex items-center justify-center gap-4 mb-16">
                    <div className="h-px w-12 bg-accent-600"></div>
                    <span className="text-accent-600 font-semibold tracking-widest text-sm">COLECCIÓN</span>
                    <div className="h-px w-12 bg-accent-600"></div>
                </div>

                {/* Galería de Productos */}
                <GaleriaProductos productos={productos} mostrarPrecio={true} />

                {/* Decoración inferior */}
                <div className="flex items-center justify-center gap-4 mt-20">
                    <div className="h-px w-12 bg-neutral-300"></div>
                    <span className="text-neutral-500 font-light tracking-widest text-xs">FIN DE LA COLECCIÓN</span>
                    <div className="h-px w-12 bg-neutral-300"></div>
                </div>
            </div>
        </div>
    );
}

export default CategoriaTemplate;
