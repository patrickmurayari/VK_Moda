import { Link } from "react-scroll";

import imgLeft from "../../img/Otros/otro6.jpg";
import imgRight from "../../img/Otros/otro4.jpg";

function SeccionInspiracionModa() {
    return (
        <section className="mt-12 md:mt-16 py-0 md:py-14" aria-label="Inspiración V&A">
            <div className="px-0 md:px-8 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-0 md:gap-6 lg:gap-8">
                    <div className="group relative overflow-hidden rounded-none bg-neutral-100 h-screen w-full md:w-auto md:h-auto md:aspect-[4/3] lg:aspect-auto lg:h-[82vh] lg:min-h-[640px] 2xl:h-[88vh] 2xl:min-h-[720px]">
                        <img
                            src={imgLeft}
                            alt="Inspiración urbana"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                            <p className="text-white/90 font-heading text-[10px] sm:text-xs tracking-[0.28em] uppercase">
                                INSPIRACIÓN
                            </p>
                            <h3 className="mt-2 text-white font-display text-xl sm:text-2xl lg:text-4xl font-light leading-tight">
                                Looks urbanos
                            </h3>
                            <p className="mt-2 text-white/85 text-xs sm:text-sm lg:text-base font-light max-w-md">
                                Prendas para todos los días con caída, comodidad y un toque de diseño.
                            </p>

                            <div className="mt-4">
                                <Link
                                    to="categorias"
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                    className="inline-flex items-center justify-center rounded-none bg-white/15 px-4 py-2 text-[10px] sm:text-xs font-heading font-semibold tracking-[0.22em] uppercase text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    Ver categorías
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-none bg-neutral-100 h-screen w-full md:w-auto md:h-auto md:aspect-[4/3] lg:aspect-auto lg:h-[82vh] lg:min-h-[640px] 2xl:h-[88vh] 2xl:min-h-[720px]">
                        <img
                            src={imgRight}
                            alt="Inspiración clásica"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                            <p className="text-white/90 font-heading text-[10px] sm:text-xs tracking-[0.28em] uppercase">
                                ATELIER
                            </p>
                            <h3 className="mt-2 text-white font-display text-xl sm:text-2xl lg:text-4xl font-light leading-tight">
                                A medida
                            </h3>
                            <p className="mt-2 text-white/85 text-xs sm:text-sm lg:text-base font-light max-w-md">
                                Ajustes, arreglos y confección para que te quede perfecto.
                            </p>

                            <div className="mt-4">
                                <Link
                                    to="contactos"
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                    className="inline-flex items-center justify-center rounded-none bg-white/15 px-4 py-2 text-[10px] sm:text-xs font-heading font-semibold tracking-[0.22em] uppercase text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    Consultar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-neutral-600 font-body text-base sm:text-lg">
                        Inspirate con nuestra selección y encontrá tu próximo look en V&A.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default SeccionInspiracionModa;
