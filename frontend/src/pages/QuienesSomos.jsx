import { useEffect, useState } from 'react';
import { getContenido } from '../services/api';

export default function QuienesSomos() {
    const [imagenes, setImagenes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        getContenido('quienes_somos')
            .then((data) => {
                const map = {};
                data.forEach((item) => {
                    map[item.posicion] = item.imagen_url;
                });
                setImagenes(map);
            })
            .catch((err) => console.error('Error cargando quiénes somos:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="bg-white min-h-screen">

            {/* Hero: full-bleed image pair */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[70vh] md:h-screen">
                <div className="relative overflow-hidden bg-neutral-100">
                    {!loading && imagenes.izquierda && (
                        <img
                            src={imagenes.izquierda}
                            alt="V&A Diseño y Moda"
                            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="relative overflow-hidden bg-neutral-100">
                    {!loading && imagenes.derecha && (
                        <img
                            src={imagenes.derecha}
                            alt="Atelier V&A Diseño y Moda"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-6 py-24 md:py-32">

                {/* Nuestra Historia */}
                <div className="mb-20">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                        Nuestra Historia
                    </span>
                    <h1 className="mt-5 font-display text-5xl sm:text-6xl md:text-7xl font-light tracking-[0.08em] text-black leading-none">
                        Quiénes<br />Somos
                    </h1>
                    <div className="mt-10 h-px w-16 bg-neutral-200" />
                    <p className="mt-10 font-body font-light text-neutral-500 leading-loose text-base md:text-lg">
                        Somos una marca con más de 20 años de experiencia en el mundo de la moda e indumentaria.
                        Nos enorgullece ofrecer una amplia gama de estilos, tallas y diseños que se adaptan a
                        todos los gustos y ocasiones.
                    </p>
                </div>

                {/* Por Qué Elegirnos */}
                <div className="border-t border-neutral-100 pt-20">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                        Nuestro Valor
                    </span>
                    <h2 className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.08em] text-black leading-tight">
                        Por Qué<br />Elegirnos
                    </h2>
                    <div className="mt-10 h-px w-16 bg-neutral-200" />
                    <p className="mt-10 font-body font-light text-neutral-500 leading-loose text-base md:text-lg">
                        Lo que nos distingue es nuestro compromiso con la calidad y la atención al detalle.
                        Cada prenda que vendemos y creamos está cuidadosamente elaborada para que te sientas
                        cómodo, seguro y elegante en cada ocasión.
                    </p>
                </div>

            </div>
        </main>
    );
}
