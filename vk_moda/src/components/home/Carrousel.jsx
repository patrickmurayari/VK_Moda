import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carruselSlides } from "../../data/categoriasData";

function Carrousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [direction, setDirection] = useState("next");

    const nextSlide = useCallback(() => {
        setDirection("next");
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carruselSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection("prev");
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carruselSlides.length) % carruselSlides.length);
    }, []);

    const goToSlide = (slideIndex) => {
        setDirection(slideIndex > currentIndex ? "next" : "prev");
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        if (!isAutoPlay) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);

        return () => clearInterval(interval);
    }, [nextSlide, isAutoPlay]);

    return (
        <div className="w-full relative group" id="carrousel">
            {/* Contenedor Principal del Carrousel */}
            <div 
                className="relative w-full h-[600px] sm:h-[600px] md:h-[700px] lg:h-[850px] overflow-hidden bg-gradient-to-b from-primary-900 to-primary-800"
                onMouseEnter={() => setIsAutoPlay(false)}
                onMouseLeave={() => setIsAutoPlay(true)}
            >
                {/* Slides con Animación */}
                {carruselSlides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            slideIndex === currentIndex
                                ? "opacity-100 scale-100"
                                : direction === "next"
                                ? slideIndex < currentIndex
                                    ? "opacity-0 scale-95 translate-x-full"
                                    : "opacity-0 scale-95 -translate-x-full"
                                : slideIndex > currentIndex
                                ? "opacity-0 scale-95 -translate-x-full"
                                : "opacity-0 scale-95 translate-x-full"
                        }`}
                    >
                        {/* Imagen con Overlay Elegante */}
                        <img
                            src={slide.url}
                            alt={`Slide ${slideIndex}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradiente Elegante */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                ))}

                {/* Botones de Navegación */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-300 transform hover:scale-110 border border-white/20 group/btn"
                    aria-label="Slide anterior"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-300 transform hover:scale-110 border border-white/20 group/btn"
                    aria-label="Siguiente slide"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:-translate-x-1 transition-transform" />
                </button>

                {/* Indicadores de Progreso */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    {carruselSlides.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`transition-all duration-500 rounded-full cursor-pointer ${
                                slideIndex === currentIndex
                                    ? "bg-accent-600 w-8 h-2 shadow-elegant-lg"
                                    : "bg-white/30 hover:bg-white/50 w-2 h-2"
                            }`}
                            aria-label={`Ir a slide ${slideIndex + 1}`}
                        />
                    ))}
                </div>

                {/* Contador de Slides */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <p className="text-white text-sm font-medium font-heading">
                        <span className="text-accent-600 font-bold">{currentIndex + 1}</span>
                        <span className="text-white/70"> / {carruselSlides.length}</span>
                    </p>
                </div>

                {/* Indicador de Auto-Play */}
                <div className="absolute bottom-8 right-8 z-20">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                        <div className={`w-2 h-2 rounded-full transition-colors ${isAutoPlay ? "bg-accent-600 animate-pulse" : "bg-white/50"}`}></div>
                        <p className="text-white text-xs font-medium">{isAutoPlay ? "Auto" : "Manual"}</p>
                    </div>
                </div>
            </div>

            {/* Barra de Progreso Inferior */}
            <div className="h-1 bg-gradient-to-r from-accent-600 via-accent-500 to-accent-600 transition-all duration-1000" 
                style={{width: `${((currentIndex + 1) / carruselSlides.length) * 100}%`}}
            ></div>
        </div>
    );
}

export default Carrousel;
