import { useEffect, useState } from 'react';
import { getContenido } from '../../services/api';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Imports estáticos originales (comentados — datos ahora desde API)
// import imgLeft from "../../img/Otros/otro6.jpg";
// import imgRight from "../../img/Otros/otro4.jpg";

function SeccionInspiracionModa() {
    const [imagenes, setImagenes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getContenido('inspiracion')
            .then((data) => {
                const map = {};
                data.forEach((item) => {
                    map[item.posicion] = {
                        image: item.imagen_url,
                        title: item.titulo,
                        subtitle: item.subtitulo,
                    };
                });
                setImagenes(map);
            })
            .catch((err) => console.error('Error cargando inspiración:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="mt-12 md:mt-16 py-14" aria-label="Inspiración V&A">
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
        <section className="mt-12 md:mt-16 py-0 md:py-14" aria-label="Inspiración V&A">
            <div className="px-0 md:px-8 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-0 md:gap-6 lg:gap-8">
                    <div className="group relative overflow-hidden rounded-none bg-neutral-100 h-screen w-full md:w-auto md:h-auto md:aspect-[4/3] lg:aspect-auto lg:h-[82vh] lg:min-h-[640px] 2xl:h-[88vh] 2xl:min-h-[720px]">
                        <img
                            src={imagenes.izquierda?.image}
                            alt={imagenes.izquierda?.title || "Inspiración urbana"}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                            <p className="text-white/90 font-heading text-[10px] sm:text-xs tracking-[0.28em] uppercase">
                                INSPIRACIÓN
                            </p>
                            <h3 className="mt-2 text-white font-display text-xl sm:text-2xl lg:text-4xl font-light leading-tight">
                                {imagenes.izquierda?.title || "Looks urbanos"}
                            </h3>
                            <div className="mt-4">
                                <button
                                    onClick={() => scrollTo('categorias')}
                                    className="inline-flex items-center justify-center rounded-none bg-white/15 px-4 py-2 text-[10px] sm:text-xs font-heading font-semibold tracking-[0.22em] uppercase text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    Ver categorías
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-none bg-neutral-100 h-screen w-full md:w-auto md:h-auto md:aspect-[4/3] lg:aspect-auto lg:h-[82vh] lg:min-h-[640px] 2xl:h-[88vh] 2xl:min-h-[720px]">
                        <img
                            src={imagenes.derecha?.image}
                            alt={imagenes.derecha?.title || "Inspiración clásica"}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>

                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                            <p className="text-white/90 font-heading text-[10px] sm:text-xs tracking-[0.28em] uppercase">
                                ATELIER
                            </p>
                            <h3 className="mt-2 text-white font-display text-xl sm:text-2xl lg:text-4xl font-light leading-tight">
                                {imagenes.derecha?.title || "A medida"}
                            </h3>
                            <div className="mt-4">
                                <button
                                    onClick={() => scrollTo('contactos')}
                                    className="inline-flex items-center justify-center rounded-none bg-white/15 px-4 py-2 text-[10px] sm:text-xs font-heading font-semibold tracking-[0.22em] uppercase text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    Consultar
                                </button>
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
