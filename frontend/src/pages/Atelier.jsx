import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AtelierSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-4 py-16">
            {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                    <div className="w-full h-[65vh] bg-neutral-100 animate-pulse" />
                    <div className="mt-4 h-4 w-2/3 bg-neutral-100 rounded animate-pulse" />
                    <div className="mt-2 h-3 w-1/2 bg-neutral-100 rounded animate-pulse" />
                </div>
            ))}
        </div>
    );
}

export default function Atelier() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Iniciando consulta a Supabase para seccion: 'atelier'...");

        // Prueba de lectura general (descomentar para verificar si RLS bloquea)
        // supabase.from('contenido_web').select('id').limit(1).then(res => console.log("Prueba RLS (Trae al menos 1 ID?):", res.data));

        supabase
            .from('contenido_web')
            .select('*')
            .eq('seccion', 'atelier')
            .order('orden')
            .then(({ data, error }) => {
                console.log("Respuesta de Supabase recibida.");
                console.log("Error de la query:", error);
                console.log("Datos crudos obtenidos:", data);

                if (error) throw error;
                setItems(data || []);
            })
            .catch((err) => {
                console.error("Error capturado en catch:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24">
            {/* Header */}
            <div className="text-center py-16 px-4 border-b border-neutral-100">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-4">
                    V&A Diseño y Moda
                </p>
                <h1 className="font-display text-3xl md:text-5xl tracking-[0.3em] uppercase text-black font-light">
                    El Atelier
                </h1>
                <p className="font-body text-sm text-neutral-500 font-light mt-6 max-w-lg mx-auto leading-relaxed">
                    Cada prenda nace de una conversación. Trabajos a medida, confección artesanal y alta costura para quienes buscan la pieza exacta.
                </p>
            </div>

            {/* Gallery */}
            {loading && <AtelierSkeleton />}

            {error && (
                <div className="flex items-center justify-center py-20 px-4">
                    <p className="font-body text-sm text-neutral-400">{error}</p>
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className="flex items-center justify-center py-20 px-4">
                    <p className="font-body text-sm text-neutral-400 tracking-widest uppercase">
                        Próximamente
                    </p>
                </div>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-4 py-16">
                    {items.map((item) => (
                        <div key={item.id}>
                            {item.posicion === 'video' ? (
                                <video
                                    src={item.imagen_url}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-[65vh] object-cover bg-neutral-100 shadow-sm"
                                />
                            ) : (
                                <img
                                    src={item.imagen_url}
                                    alt={item.titulo || 'V&A Atelier'}
                                    loading="lazy"
                                    className="w-full h-[65vh] object-cover bg-neutral-100 shadow-sm"
                                />
                            )}
                            {(item.titulo || item.subtitulo) && (
                                <div className="mt-4">
                                    {item.titulo && (
                                        <p className="font-body tracking-wider text-base font-medium text-black">
                                            {item.titulo}
                                        </p>
                                    )}
                                    {item.subtitulo && (
                                        <p className="font-body text-sm font-light text-neutral-500 mt-1">
                                            {item.subtitulo}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
