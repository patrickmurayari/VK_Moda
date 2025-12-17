import fotoabout from "../../img/fotoabout11.jpg"
import about from "../../img/about1.jpg"

function SeccionQuienesSomos() {
    return (
        <div className="mt-16 md:mt-20 py-20" id="Quienes-somos">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/5 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/5 rounded-full -ml-40 -mb-40"></div>
            </div>

            {/* Primera sección - Quiénes Somos */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    {/* Imagen con efecto elegante */}
                    <div className="relative overflow-hidden group">
                        <div className="relative overflow-hidden rounded-none shadow-elegant">
                            <img
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={fotoabout}
                                alt="quienes somos"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                        </div>
                        {/* Decoración de esquina */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-accent-600/30 rounded-none"></div>
                    </div>

                    {/* Contenido */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px w-12 bg-accent-600"></div>
                                <span className="text-accent-600 font-semibold tracking-widest text-sm uppercase">Nuestra Historia</span>
                            </div>
                            <h2 className="text-primary-900 font-elegant text-4xl md:text-5xl font-bold tracking-wider mb-6">
                                Quiénes Somos
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="h-px w-16 bg-accent-600"></div>
                                <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                                <div className="h-px w-16 bg-accent-600"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-neutral-600 leading-relaxed text-base md:text-lg font-light">
                                Somos una marca con más de 20 años de experiencia en el mundo de la moda e indumentaria.
                                Nos enorgullece ofrecer una amplia gama de estilos, tallas y diseños que se adaptan a todos los gustos y
                                ocasiones.
                            </p>
                            <p className="text-neutral-600 leading-relaxed text-base md:text-lg font-light">
                                Nuestra pasión por la moda no se limita solo a ofrecer productos de alta calidad, sino que también nos destacamos
                                en la creación de prendas únicas que reflejen tu estilo personal. Nuestro equipo de expertos en diseño y confección
                                está listo para convertir tus ideas en realidad.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segunda sección - Por Qué Elegirnos */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    {/* Contenido */}
                    <div className="space-y-8 order-2 md:order-1">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px w-12 bg-accent-600"></div>
                                <span className="text-accent-600 font-semibold tracking-widest text-sm uppercase">Nuestro Valor</span>
                            </div>
                            <h2 className="text-primary-900 font-elegant text-4xl md:text-5xl font-bold tracking-wider mb-6">
                                Por Qué Elegirnos
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="h-px w-16 bg-accent-600"></div>
                                <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                                <div className="h-px w-16 bg-accent-600"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-neutral-600 leading-relaxed text-base md:text-lg font-light">
                                Lo que nos distingue es nuestro compromiso con la calidad y la atención al detalle. Cada prenda que vendemos
                                y creamos está cuidadosamente elaborada para asegurarnos de que te sientas cómodo, seguro y elegante en
                                cada ocasión.
                            </p>
                            <p className="text-neutral-600 leading-relaxed text-base md:text-lg font-light">
                                Sabemos que la moda es una forma de expresión personal, y estamos aquí para ayudarte a
                                expresarte de la mejor manera posible. Desde diseños personalizados hasta adaptaciones únicas, tu satisfacción es nuestra prioridad.
                            </p>
                        </div>
                    </div>

                    {/* Imagen con efecto elegante */}
                    <div className="relative overflow-hidden group order-1 md:order-2">
                        <div className="relative overflow-hidden rounded-none shadow-elegant">
                            <img
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={about}
                                alt="Nuestra empresa"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                        </div>
                        {/* Decoración de esquina */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-accent-600/30 rounded-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeccionQuienesSomos;
