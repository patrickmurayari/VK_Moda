import CarrouselSwip from "../common/CarrouselSwip";

function SeccionColeccion() {
    return (
        <div className="mt-32 md:mt-40 py-20" id="coleccion">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/5 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/5 rounded-full -ml-40 -mb-40"></div>
            </div>

            {/* Encabezado */}
            <div className="text-center mb-16 md:mb-20 px-4 md:px-8">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-12 bg-accent-600"></div>
                    <span data-aos="fade-in" data-aos-duration="1000" className="text-accent-600 font-semibold tracking-widest text-sm uppercase">Destacado</span>
                    <div className="h-px w-12 bg-accent-600"></div>
                </div>
                
                <h1 
                    data-aos="zoom-in" 
                    data-aos-duration="1500" 
                    className="text-primary-900 font-elegant text-3xl sm:text-4xl md:text-6xl font-bold tracking-wider mb-6"
                >
                    Nueva Colección 2024
                </h1>
                
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-accent-600"></div>
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                    <div className="h-px w-16 bg-accent-600"></div>
                </div>
                
                <p 
                    data-aos="fade-up" 
                    data-aos-duration="1500"
                    data-aos-delay="200"
                    className="text-neutral-600 mt-8 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto"
                >
                    Descubre las piezas más exclusivas de nuestra colección de otoño/invierno
                </p>
            </div>

            {/* Carrusel - Ancho completo en mobile */}
            <div 
                data-aos="fade-up" 
                data-aos-duration="1500"
                data-aos-delay="300"
                className="mt-12 md:mt-16 w-full"
            >
                <CarrouselSwip />
            </div>
        </div>
    );
}

export default SeccionColeccion;
