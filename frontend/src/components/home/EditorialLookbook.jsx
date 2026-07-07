import { useEffect, useRef, useState } from 'react';

const LOOKBOOK_ITEMS = [
    {
        id: 1,
        urlImagen: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/imagenes_vya/Editorial/03ed96d7-74d5-4b32-b702-032ceb84b76a.JPG.webp',
        titulo: 'Línea Sastrera',
        subtitulo: 'Diseño y caída impecable',
        texto: 'Prendas construidas con precisión artesanal. Cada detalle pensado para una silueta que habla por sí sola.',
        reverse: false,
    },
    {
        id: 2,
        urlImagen: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/imagenes_vya/Editorial/979a05d8-4c1f-4e12-942b-75c5b793d41f.JPG.webp',
        titulo: 'Colección Casual',
        subtitulo: 'Comodidad sin resignar elegancia',
        texto: 'La versatilidad hecha prenda. Piezas que acompañan desde el amanecer hasta la noche sin perder identidad.',
        reverse: true,
    },
    {
        id: 3,
        urlImagen: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/imagenes_vya/Editorial/a842b98f-5f17-4298-95f6-06b5ad3b95df.JPG.webp',
        titulo: 'Esencia Urbana',
        subtitulo: 'La ciudad como pasarela',
        texto: 'Confección local con mirada global. Diseños que dialogan con el ritmo contemporáneo.',
        reverse: false,
    },
    {
        id: 4,
        urlImagen: 'https://vdatngjhpompoemllczo.supabase.co/storage/v1/object/public/imagenes_vya/Editorial/IMG_0084.JPG.webp',
        titulo: 'Hecho a Medida',
        subtitulo: 'Tu cuerpo, tu corte',
        texto: 'Cada prenda nace de un encargo. Trabajamos contigo para que el resultado sea exactamente lo que imaginaste.',
        reverse: true,
    },
];

function LookbookRow({ item }) {
    const rowRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={rowRef}
            className={`grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch w-full transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            {/* Image */}
            <div className={`w-full h-[70vh] md:h-screen overflow-hidden bg-neutral-100 ${item.reverse ? 'md:order-last' : ''}`}>
                <img
                    src={item.urlImagen}
                    alt={item.titulo}
                    loading="lazy"
                    className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-1000 ease-out"
                />
            </div>

            {/* Text */}
            <div className={`flex flex-col justify-center gap-6 px-8 md:px-20 lg:px-32 py-12 md:py-0 bg-white ${item.reverse ? 'md:order-first' : ''}`}>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                    V&A Diseño y Moda
                </p>
                <h3 className="font-display text-3xl md:text-4xl tracking-[0.15em] uppercase text-black leading-tight">
                    {item.titulo}
                </h3>
                <p className="font-body text-sm tracking-[0.08em] text-neutral-500 leading-relaxed">
                    {item.subtitulo}
                </p>
                <div className="h-px w-12 bg-neutral-300" />
                <p className="font-body text-sm text-neutral-600 leading-relaxed max-w-sm">
                    {item.texto}
                </p>
            </div>
        </div>
    );
}

export default function EditorialLookbook() {
    return (
        <section className="w-full">
            {LOOKBOOK_ITEMS.map((item) => (
                <LookbookRow key={item.id} item={item} />
            ))}
        </section>
    );
}
