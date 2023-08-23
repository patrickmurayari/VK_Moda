import  { useState, useEffect } from "react";

import { RxDot } from "react-icons/rx";


import foto1 from "../img/foto1.jpg";
import foto2 from "../img/foto2.jpg";
import foto3 from "../img/foto3.jpg";

function Home() {
    const slides = [
       
        {
            url: `${foto1}`,
        },
        {
            url: `${foto2}`,
        },
        {
            url: `${foto3}`,
        },
        
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const newIndex = (currentIndex + 1) % slides.length;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    // Cambio automático de slide cada 5 segundos (ajusta el tiempo según tus necesidades)
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Cambio cada 5 segundos

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="  w-full m-auto py-8 md:py-16 px-4 relative group" id="carrousel">
            <div className="w-full h-[200px] md:h-[700px] rounded-2xl overflow-hidden relative">
                {slides.map((slide, slideIndex) => (
                    <img
                        key={slideIndex}
                        src={slide.url}
                        alt={`Slide ${slideIndex}`}
                        className={`w-full h-full absolute top-0 left-0 transition-opacity duration-1000 opacity-0  ${slideIndex === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))}
            </div>
           
            <div className="flex top-4 justify-center py-2">
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`text-1xl cursor-pointer ${slideIndex === currentIndex ? "text-black" : "text-gray-400"
                            }`}
                    >
                        <RxDot />
                    </div>
                ))}
            </div>
            <div className=" md:mt-20">
            <h1 className="text-black font-extralight font-montserrat_alternates  text-2xl mt-10 md:text-4xl">Categorias Destacadas</h1>
            </div>
        </div>
    );
}

export default Home;
