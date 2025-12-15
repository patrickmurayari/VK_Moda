import CarrouselSwip from "../common/CarrouselSwip";

function SeccionColeccion() {
    return (
        <div className="mt-24 md:mt-28 px-4 md:px-8" id="coleccion">
            <div className="text-center mb-12">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-primary-900 font-elegant text-3xl md:text-5xl font-bold tracking-wide">Nueva Colección 2024</h1>
                <div className="w-24 h-1 bg-accent-600 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="mt-8">
                <CarrouselSwip />
            </div>
        </div>
    );
}

export default SeccionColeccion;
