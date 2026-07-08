import { Link } from 'react-router-dom';

export default function AtelierBanner() {
    return (
        <section className="w-full bg-neutral-50 py-20 text-center">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-4">
                V&A Diseño y Moda
            </p>
            <h2 className="font-display text-xl tracking-widest uppercase text-black mb-4">
                Diseños a Medida & Alta Costura
            </h2>
            <p className="font-body text-sm text-neutral-500 font-light mb-8 max-w-md mx-auto leading-relaxed">
                El arte de materializar tu silueta ideal en movimiento.
            </p>
            <Link
                to="/atelier"
                className="inline-block border border-black px-6 py-3 font-body text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
            >
                Explorar el Atelier
            </Link>
        </section>
    );
}
