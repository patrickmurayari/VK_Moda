import { useEffect, useState } from 'react';
import { getContenido } from '../../services/api';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Imports estáticos originales (comentados — datos ahora desde API)
// import editorialImg from "../../img/Otros/otro7.jpg";
// import detailImg from "../../img/Otros/otro8.jpg";
// import editorialAltImg from "../../img/Otros/otro9.jpg";
// import detailAltImg from "../../img/Otros/otro2.jpg";

function SeccionEditorialModa() {
    const [imagenes, setImagenes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContenido('editorial')
            .then((data) => {
                const map = {};
                data.forEach((item) => {
                    map[item.posicion] = item.imagen_url;
                });
                setImagenes(map);
            })
            .catch((err) => console.error('Error cargando editorial:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section id="editorial" className="relative mt-10 md:mt-14 py-20">
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-accent-600 animate-pulse" aria-hidden="true" />
                        <p className="text-sm font-body text-neutral-700">Cargando…</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="editorial" className="relative mt-10 md:mt-14 py-20">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full -ml-48 -mt-48"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-900/5 rounded-full -mr-40 -mb-40"></div>
            </div>

            <div className="w-full">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-0 items-center">
                    <div className="w-full">
                        <div className="relative overflow-hidden">
                            <img
                                src={imagenes['principal-izquierda']}
                                alt="V&A Diseño y Moda"
                                className="w-full h-[520px] sm:h-[600px] lg:h-[760px] xl:h-[860px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>
                        </div>
                    </div>

                    <div className="w-full px-4 md:px-8 lg:pl-14">
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
                                <button
                                    onClick={() => scrollTo('coleccion')}
                                    className="inline-flex items-center justify-center rounded-none bg-primary-900 px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-white hover:bg-accent-600 transition-colors"
                                >
                                    Ver colección
                                </button>

                                <button
                                    onClick={() => scrollTo('contactos')}
                                    className="inline-flex items-center justify-center rounded-none border border-black/15 bg-white px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-neutral-900 hover:bg-neutral-50 transition-colors"
                                >
                                    Consultar arreglos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 md:mt-20 lg:mt-0 grid lg:grid-cols-2 gap-10 lg:gap-0 items-center">
                    <div className="w-full px-4 md:px-8 lg:pr-14">
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
                                <button
                                    onClick={() => scrollTo('contactos')}
                                    className="inline-flex items-center justify-center rounded-none bg-primary-900 px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-white hover:bg-accent-600 transition-colors"
                                >
                                    Pedir turno
                                </button>

                                <button
                                    onClick={() => scrollTo('categorias')}
                                    className="inline-flex items-center justify-center rounded-none border border-black/15 bg-white px-6 py-3 font-heading text-[12px] font-semibold tracking-[0.22em] uppercase text-neutral-900 hover:bg-neutral-50 transition-colors"
                                >
                                    Ver prendas
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="relative overflow-hidden">
                            <img
                                src={imagenes['principal-derecha']}
                                alt="Atelier V&A Diseño y Moda"
                                className="w-full h-[520px] sm:h-[600px] lg:h-[760px] xl:h-[860px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SeccionEditorialModa;
