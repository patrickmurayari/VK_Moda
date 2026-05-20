import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getContenido } from '../../services/api';

// Imports estáticos originales (comentados — datos ahora desde API)
// import foto11 from '../../img/Carrousel/foto111.jpg';
// import foto21 from '../../img/Carrousel/foto311.png';
// import foto3 from '../../img/Carrousel/foto211.jpg';

function HeroSection() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [incomingSlide, setIncomingSlide] = useState(null);
    const [showIncoming, setShowIncoming] = useState(false);

    useEffect(() => {
        getContenido('hero')
            .then((data) => {
                const mapped = data.map((item) => ({
                    title: item.titulo,
                    subtitle: item.subtitulo,
                    image: item.imagen_url,
                }));
                setSlides(mapped);
            })
            .catch((err) => console.error('Error cargando hero:', err))
            .finally(() => setLoading(false));
    }, []);

    // Preload images once loaded
    useEffect(() => {
        if (slides.length === 0) return;
        slides.forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
        });
    }, [slides]);

    const goToSlide = (index) => {
        if (incomingSlide !== null || slides.length === 0) return;

        setIncomingSlide(index);
        setShowIncoming(false);

        requestAnimationFrame(() => {
            setShowIncoming(true);
        });

        window.setTimeout(() => {
            setCurrentSlide(index);
            setIncomingSlide(null);
            setShowIncoming(false);
        }, 700);
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    if (loading) {
        return (
            <div className="relative w-full h-screen bg-neutral-900 flex items-center justify-center">
                <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 shadow-elegant">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-accent-600 animate-pulse" aria-hidden="true" />
                        <p className="text-sm font-body text-neutral-700">Cargando…</p>
                    </div>
                </div>
            </div>
        );
    }

    if (slides.length === 0) return null;

    return (
        <div id="hero" className="relative w-full h-screen overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-10"></div>
                <div className="absolute inset-0">
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                    />
                    {incomingSlide !== null && (
                        <img
                            src={slides[incomingSlide].image}
                            alt={slides[incomingSlide].title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out will-change-transform ${showIncoming ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                            loading="eager"
                            decoding="async"
                        />
                    )}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className={`absolute left-6 top-[24%] md:top-1/2 -translate-y-1/2 z-20 text-white/90 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${incomingSlide !== null ? 'opacity-50 pointer-events-none' : ''}`}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-14 h-14" strokeWidth={1.25} />
            </button>
            
            <button 
                onClick={nextSlide}
                className={`absolute right-6 top-[74%] md:top-1/2 -translate-y-1/2 z-20 text-white/90 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${incomingSlide !== null ? 'opacity-50 pointer-events-none' : ''}`}
                aria-label="Next slide"
            >
                <ChevronRight className="w-14 h-14" strokeWidth={1.25} />
            </button>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white font-light mb-6 leading-tight max-w-5xl">
                    {slides[currentSlide].title}
                </h1>
                <p className="text-2xl md:text-3xl lg:text-4xl font-display text-white font-light mb-12 max-w-3xl">
                    {slides[currentSlide].subtitle}
                </p>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white animate-bounce">
                <ChevronDown className="w-6 h-6" />
            </div>
        </div>
    );
}

export default HeroSection;
