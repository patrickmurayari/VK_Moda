import fotoabout from "../../img/fotoabout11.jpg"
import about from "../../img/about1.jpg"

function SeccionQuienesSomos() {
    return (
        <div className="relative mt-16 md:mt-20" id="quienes-somos">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/5 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/5 rounded-full -ml-40 -mb-40"></div>
            </div>

            {/* Primera sección - Quiénes Somos */}
            <div className="relative w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-[50vh] md:h-screen group">
                        <img
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={fotoabout}
                            alt="quienes somos"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"></div>
                    </div>

                    <div className="relative h-[50vh] md:h-screen group md:col-start-2 md:row-start-1">
                        <img
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={about}
                            alt="Nuestra empresa"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"></div>
                    </div>
                </div>

                <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-10">
                    <div className="w-full max-w-4xl rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-elegant-lg p-6 sm:p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-px w-12 bg-accent-600"></div>
                                        <span className="text-accent-600 font-semibold tracking-widest text-sm uppercase">Nuestra Historia</span>
                                    </div>
                                    <h2 className="text-primary-900 font-elegant text-3xl sm:text-4xl md:text-4xl font-bold tracking-wider mb-6">
                                        Quiénes Somos
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="h-px w-16 bg-accent-600"></div>
                                        <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                                        <div className="h-px w-16 bg-accent-600"></div>
                                    </div>
                                </div>

                                <p className="text-neutral-600 leading-relaxed text-sm sm:text-base font-light">
                                    Somos una marca con más de 20 años de experiencia en el mundo de la moda e indumentaria. Nos enorgullece ofrecer una amplia gama de estilos, tallas y diseños que se adaptan a todos los gustos y ocasiones.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-px w-12 bg-accent-600"></div>
                                        <span className="text-accent-600 font-semibold tracking-widest text-sm uppercase">Nuestro Valor</span>
                                    </div>
                                    <h2 className="text-primary-900 font-elegant text-3xl sm:text-4xl md:text-4xl font-bold tracking-wider mb-6">
                                        Por Qué Elegirnos
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="h-px w-16 bg-accent-600"></div>
                                        <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                                        <div className="h-px w-16 bg-accent-600"></div>
                                    </div>
                                </div>

                                <p className="text-neutral-600 leading-relaxed text-sm sm:text-base font-light">
                                    Lo que nos distingue es nuestro compromiso con la calidad y la atención al detalle. Cada prenda que vendemos y creamos está cuidadosamente elaborada para que te sientas cómodo, seguro y elegante en cada ocasión.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeccionQuienesSomos;
