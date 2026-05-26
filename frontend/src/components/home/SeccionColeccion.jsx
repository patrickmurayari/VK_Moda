import CarrouselSwip from "../common/CarrouselSwip";

function SeccionColeccion() {
    return (
        <div className="mt-16 md:mt-20 pt-20 pb-10 md:pb-12" id="coleccion">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-200/30 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-neutral-200/20 rounded-full -ml-40 -mb-40"></div>
            </div>

            {/* Encabezado */}
            <div className="text-center mb-12 md:mb-16 px-4 md:px-8">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-12 bg-neutral-300"></div>
                    <span className="text-neutral-500 font-semibold tracking-widest text-sm uppercase">Destacado</span>
                    <div className="h-px w-12 bg-neutral-300"></div>
                </div>
                
                <h1  
                    className="text-primary-900 font-elegant text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider mb-6"
                >
                    Nueva Colección 2026
                </h1>
                
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-neutral-200"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full"></div>
                    <div className="h-px w-16 bg-neutral-200"></div>
                </div>
                
                <p 
                    className="text-neutral-600 mt-8 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto"
                >
                    Descubre las piezas más exclusivas de nuestra colección de otoño/invierno
                </p>
            </div>

            {/* Carrusel - Ancho completo en mobile */}
            <div 
                className="mt-12 md:mt-16 w-full"
            >
                <CarrouselSwip />
            </div>

            <div className="mt-10 md:mt-12 flex items-center justify-center gap-4" aria-hidden="true">
                <div className="h-px w-20 bg-neutral-200"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-300"></div>
                <div className="h-px w-20 bg-neutral-200"></div>
            </div>
        </div>
    );
}

export default SeccionColeccion;
