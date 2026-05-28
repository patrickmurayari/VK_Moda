import CarrouselSwip from "../common/CarrouselSwip";

function SeccionColeccion() {
    return (
        <div className="mt-16 md:mt-20 pt-20 pb-10 md:pb-12" id="coleccion">
            {/* Encabezado */}
            <div className="text-center mb-10 md:mb-14 px-4">
                <h2 className="text-primary-900 font-display text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] uppercase">
                    Colección
                </h2>
            </div>

            {/* Carrusel - Ancho completo en mobile */}
            <div 
                className="mt-12 md:mt-16 w-full"
            >
                <CarrouselSwip />
            </div>

        </div>
    );
}

export default SeccionColeccion;
