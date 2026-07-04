import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getContenido } from '../../services/api';

SlideImage.propTypes = {
    slide: PropTypes.shape({
        image: PropTypes.string.isRequired,
        imageDesktop: PropTypes.string.isRequired,
        alt: PropTypes.string,
    }).isRequired,
    extraClass: PropTypes.string,
};

function SlideImage({ slide, extraClass = '' }) {
    return (
        <div className={`absolute inset-0 w-full h-full ${extraClass}`}>
            {/* Mobile: full-cover */}
            <img
                src={slide.image}
                alt={slide.alt}
                className="lg:hidden absolute inset-0 w-full h-full object-cover object-top"
                loading="eager"
                decoding="async"
            />
            {/* Desktop: Pantalla Completa Limpia */}
            <img
                src={slide.imageDesktop}
                alt={slide.alt}
                className="hidden lg:block absolute inset-0 w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
            />
        </div>
    );
}

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
                    image: item.imagen_url,
                    imageDesktop: item.imagen_desktop_url || item.imagen_url,
                    alt: item.titulo || 'V&A Banner',
                }));
                setSlides(mapped);
            })
            .catch((err) => console.error('Error cargando hero:', err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        slides.forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
            if (slide.imageDesktop !== slide.image) {
                const imgD = new Image();
                imgD.src = slide.imageDesktop;
            }
        });
    }, [slides]);

    const goToSlide = useCallback((index) => {
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
    }, [incomingSlide, slides.length]);

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [currentSlide, slides.length, goToSlide]);

    if (loading) {
        return (
            <div className="relative w-full h-screen md:h-screen max-h-[70vh] md:max-h-none bg-neutral-900 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
                    <p className="text-xs font-body tracking-[0.3em] uppercase text-white/40">Cargando</p>
                </div>
            </div>
        );
    }

    if (slides.length === 0) return null;

    return (
        <div id="hero" className="relative w-full h-screen max-h-[73vh] md:max-h-none overflow-hidden group">
            {/* Images */}
            <div className="absolute inset-0">
                <SlideImage slide={slides[currentSlide]} />
                {incomingSlide !== null && (
                    <SlideImage
                        slide={slides[incomingSlide]}
                        extraClass={`transition-all duration-700 ease-out will-change-transform ${showIncoming ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    />
                )}
            </div>

            {/* Minimal line indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`block transition-all duration-500 ${
                                index === currentSlide
                                    ? 'w-8 h-[1px] bg-white/80'
                                    : 'w-4 h-[1px] bg-white/25 hover:bg-white/50'
                            }`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HeroSection;
