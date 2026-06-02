import { useEffect, useState } from 'react';
import { getContenido } from '../../services/api';

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
        <section id="editorial" className="">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative overflow-hidden">
                    <img
                        src={imagenes['principal-izquierda']}
                        alt="V&A Diseño y Moda"
                        className="w-full h-[70vh] md:h-[85vh] lg:h-screen object-cover"
                    />
                </div>
                <div className="relative overflow-hidden">
                    <img
                        src={imagenes['principal-derecha']}
                        alt="Atelier V&A Diseño y Moda"
                        className="w-full h-[70vh] md:h-[85vh] lg:h-screen object-cover"
                    />
                </div>
            </div>
        </section>
    );
}

export default SeccionEditorialModa;
