import { useState, useEffect, useCallback } from "react";
import { RxDot } from "react-icons/rx";
import { carruselSlides } from "../../data/categoriasData";

function Carrousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carruselSlides.length);
    }, []);

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="w-full py-0 md:px-1 relative group" id="carrousel">
            <div className="bg-black w-full h-[700px] sm:h-[600px] md:h-[800px] lg:h-[900px] overflow-hidden relative">
                {carruselSlides.map((slide, slideIndex) => (
                    <img
                        key={slideIndex}
                        src={slide.url}
                        alt={`Slide ${slideIndex}`}
                        className={`w-full h-full absolute top-0 left-0 object-cover transition-opacity duration-1000 ${slideIndex === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))}
            </div>
            <div className="flex top-4 justify-center py-2">
                {carruselSlides.map((slide, slideIndex) => (
                    <div
                        id="productos"
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`text-1xl cursor-pointer ${slideIndex === currentIndex ? "text-black" : "text-gray-400"
                            }`}
                    >
                        <RxDot />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carrousel;
