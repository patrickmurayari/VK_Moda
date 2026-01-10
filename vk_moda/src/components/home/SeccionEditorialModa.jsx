import { Link } from "react-scroll";

import editorialImg from "../../img/Otros/otro7.jpg";
import detailImg from "../../img/Otros/otro8.jpg";
import editorialAltImg from "../../img/Otros/otro9.jpg";
import detailAltImg from "../../img/Otros/otro2.jpg";

function SeccionEditorialModa() {
    return (
        <section id="editorial" className="relative mt-10 md:mt-14 py-20">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full -ml-48 -mt-48"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-900/5 rounded-full -mr-40 -mb-40"></div>
            </div>

            <div className="px-4 md:px-8">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                    <div className="w-full">
                        <div className="bg-white shadow-elegant rounded-2xl p-4 md:p-6">
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src={editorialImg}
                                    alt="V&A Diseño y Moda"
                                    className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>

                                <div className="hidden lg:block absolute -bottom-8 -left-8">
                                    <div className="bg-white rounded-2xl shadow-elegant-lg p-3">
                                        <img
                                            src={detailImg}
                                            alt="Inspiración de moda"
                                            className="w-44 h-44 object-cover rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="max-w-xl">
                            <p className="text-accent-600 font-heading text-xs sm:text-sm tracking-[0.28em] uppercase">
                                V&A DISEÑO Y MODA
                            </p>

                            <h2 className="mt-5 text-primary-900 font-display text-3xl sm:text-4xl md:text-6xl font-light leading-tight">
                                Moda que acompaña tu estilo.
                            </h2>

                            <p className="mt-6 text-neutral-600 font-body text-base sm:text-lg leading-relaxed">
                                Prendas seleccionadas, confección a medida y arreglos para que cada detalle te quede perfecto. Combinamos tendencia,
                                comodidad y terminaciones prolijas para que te sientas única en cualquier ocasión.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="coleccion"
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                    className="inline-flex items-center justify-center rounded-xl bg-primary-900 px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-white hover:bg-accent-600 transition-colors"
                                >
                                    Ver colección
                                </Link>

                                <Link
                                    to="contactos"
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                    className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-neutral-900 hover:bg-neutral-50 transition-colors"
                                >
                                    Consultar arreglos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                    <div className="w-full">
                        <div className="max-w-xl">
                            <p className="text-accent-600 font-heading text-xs sm:text-sm tracking-[0.28em] uppercase">
                                ATELIER & DETALLES
                            </p>

                            <h2 className="mt-5 text-primary-900 font-display text-3xl sm:text-4xl md:text-6xl font-light leading-tight">
                                Hecho a tu medida.
                            </h2>

                            <p className="mt-6 text-neutral-600 font-body text-base sm:text-lg leading-relaxed">
                                Ajustes, arreglos y confección con precisión: entalles, dobladillos, cierres y terminaciones cuidadas para que la prenda
                                caiga como debe. Traé tu idea y la transformamos en una pieza con identidad.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="contactos"
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                    className="inline-flex items-center justify-center rounded-xl bg-primary-900 px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-white hover:bg-accent-600 transition-colors"
                                >
                                    Pedir turno
                                </Link>

                                <Link
                                    to="categorias"
                                    spy={true}
                                    smooth={true}
                                    offset={-100}
                                    duration={500}
                                    className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-neutral-900 hover:bg-neutral-50 transition-colors"
                                >
                                    Ver prendas
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="bg-white shadow-elegant rounded-2xl p-4 md:p-6">
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src={editorialAltImg}
                                    alt="Atelier V&A Diseño y Moda"
                                    className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>

                                <div className="hidden lg:block absolute -bottom-8 -right-8">
                                    <div className="bg-white rounded-2xl shadow-elegant-lg p-3">
                                        <img
                                            src={detailAltImg}
                                            alt="Detalle de confección"
                                            className="w-44 h-44 object-cover rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SeccionEditorialModa;
