import { useEffect, useRef, useState } from 'react';
import { getHomeEditorial } from '../../services/api';

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
                    src={item.imagen_url}
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
                {item.titulo && (
                    <h3 className="font-display text-3xl md:text-4xl tracking-[0.15em] uppercase text-black leading-tight">
                        {item.titulo}
                    </h3>
                )}
                {item.subtitulo && (
                    <p className="font-body text-sm tracking-[0.08em] text-neutral-500 leading-relaxed">
                        {item.subtitulo}
                    </p>
                )}
                {(item.subtitulo || item.titulo) && item.descripcion && (
                    <div className="h-px w-12 bg-neutral-300" />
                )}
                {item.descripcion && (
                    <p className="font-body text-sm text-neutral-600 leading-relaxed max-w-sm">
                        {item.descripcion}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function EditorialLookbook() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getHomeEditorial()
            .then(data => setItems(data.map((row, i) => ({ ...row, reverse: i % 2 !== 0 }))))
            .catch(err => console.error('Error cargando editorial:', err));
    }, []);

    if (items.length === 0) return null;

    return (
        <section className="w-full">
            {items.map((item) => (
                <LookbookRow key={item.id} item={item} />
            ))}
        </section>
    );
}
