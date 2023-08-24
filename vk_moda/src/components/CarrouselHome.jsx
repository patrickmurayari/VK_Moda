import { useState, useEffect } from "react";

import { RxDot } from "react-icons/rx";


import foto1 from "../img/Carrousel/foto1.jpg";
import foto2 from "../img/Carrousel/foto2.jpg";
import foto3 from "../img/Carrousel/fotoPortada.jpg";
import foto4 from "../img/Carrousel/fotoPortada1.jpg";
import ofertas from "../img/ofertafoto.jpg";

import carteras from "../img/Categoria/bolsofoto.jpg";
import joya1 from "../img/Categoria/fotojoyas.jpg";
import vestidos from "../img/Categoria/joya2.jpg";
import ropapersonalizada from   "../img/Categoria/ropapersonalizada1.jpg";

import CardOfertas from "./CardOfertas";
import CardProducts from "./CardCategoria";
import CardNuevaColeccion from "./CardNuevaColeccion";

const ProductsCategoria = [
    {
        id: 1,
        id_name: "vestidos",
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 2,
        id_name: "bolsos",
        image: `${carteras}`,
        name: "BOLSOS",
        // description: "$3519",
    },
    {
        id: 3,
        id_name: "indumentaria",
        image: `${ropapersonalizada}`,
        name: "INDUMENTARIA",
        // description: "$3519",
    },
    {
        id: 4,
        id_name: "joyeria",
        image: `${joya1}`,
        name: "JOYERIA",
        // description: "$3519",
    },

]

const NuevaColeccion = [
    {
        id: 1,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 2,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 3,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 4,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 5,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 6,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 7,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 8,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },

]

function Home() {
    const slides = [

        {
            url: `${foto1}`,
        },
        {
            url: `${foto3}`,
        },
        {
            url: `${foto2}`,
        },
        {
            url: `${foto4}`,
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
            <div className="w-full h-[200px] md:h-[700px]  overflow-hidden relative">
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
            <div className=" md:mt-20">
                <div className="">
                    <h1   data-aos="zoom-in-right" data-aos-duration="1500"  className="text-black font-extralight font-montserrat_alternates   text-2xl mt-10 md:text-4xl">Categorias Destacadas</h1>
                </div>
                <CardProducts products={ProductsCategoria} />
            </div>
            <div className=" md:mt-20">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500"  className="text-black font-extralight font-montserrat_alternates   text-2xl mt-10 md:text-4xl">La nueva coleccion 2023</h1>
                <CardNuevaColeccion products={NuevaColeccion} />
            </div>
            <div className=" mt-20 md:mt-20">
                
                <div className="flex w-full  mr-44">
                    <img className="h-full w-full" src={ofertas} alt="" />
                </div>
                <CardOfertas products={ProductsCategoria} />
            </div>
        </div>
    );
}

export default Home;
