import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import foto11 from '../../img/Carrousel/foto11.jpg';
import foto21 from '../../img/Carrousel/foto21.jpg';
import foto3 from '../../img/Carrousel/foto3.jpg';
import foto31 from '../../img/Carrousel/foto31.jpg';

function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [incomingSlide, setIncomingSlide] = useState(null);
    const [showIncoming, setShowIncoming] = useState(false);
    
    const slides = [
        {
            title: "Indumentaria y estilo para todos los días",
            subtitle: "Prendas seleccionadas y confecciones con detalle para que te sientas única",
            image: foto11
        },
        {
            title: "Arreglos y ajustes de todo tipo de prendas",
            subtitle: "Dobladillos, entalles, cierres y reparaciones: dejá tu ropa como nueva",
            image: foto21
        },
        {
            title: "Confección a medida",
            subtitle: "Diseñamos y confeccionamos según tu idea, tu cuerpo y tu ocasión",
            image: foto3
        }
    ];

    useEffect(() => {
        [foto11, foto21, foto3, foto31].forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    const goToSlide = (index) => {
        if (incomingSlide !== null) return;

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
                    />
                    {incomingSlide !== null && (
                        <img
                            src={slides[incomingSlide].image}
                            alt={slides[incomingSlide].title}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out will-change-transform ${showIncoming ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        />
                    )}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className={`absolute left-6 top-[24%] md:top-1/2 -translate-y-1/2 z-20 text-white/90 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${incomingSlide !== null ? 'opacity-50 pointer-events-none' : ''}`}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-14 h-14" strokeWidth={1.25} />
            </button>
            
            <button 
                onClick={nextSlide}
                className={`absolute right-6 top-[74%] md:top-1/2 -translate-y-1/2 z-20 text-white/90 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${incomingSlide !== null ? 'opacity-50 pointer-events-none' : ''}`}
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
