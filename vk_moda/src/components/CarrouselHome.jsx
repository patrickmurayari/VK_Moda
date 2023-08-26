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
import ropapersonalizada from "../img/Categoria/ropapersonalizada1.jpg";

import insta from "../img/insta.png"
import facebook from "../img/facebook.png"

import CardOfertas from "./CardOfertas";
import CardProducts from "./CardCategoria";
import CarrouselSwip from "./CarrouselSwip";

import logovk from "../img/logoVK.png"
import about from "../img/about.jpg"

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
        <div>

            <div className="w-full m-auto py-16  md:py-16 px-4 relative group" id="carrousel">
                <div className="bg-black w-full h-[400px] md:h-[700px]  overflow-hidden relative">
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

                <div className=" flex top-4 justify-center py-2">
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
                        <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight font-montserrat_alternates text-lg mt-8 md:text-4xl">Categorias Destacadas</h1>
                    </div>
                    <CardProducts products={ProductsCategoria} />
                </div>
                <div className=" mt-24 md:mt-28" id="coleccion">
                    <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight font-montserrat_alternates   text-2xl mt-10 md:text-4xl">Nueva coleccion 2023</h1>
                    <div className=" mt-6">
                        <CarrouselSwip />
                    </div>
                </div>
                <div className=" mt-20 md:mt-20">

                    <div className="flex w-full  mr-44">
                        <img className="md:h-full  md:w-full h-[300px] rounded-2xl  " src={ofertas} alt="" />
                    </div>
                    <CardOfertas products={ProductsCategoria} />
                </div>
                <div className="container mx-auto mt-20">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                        <div data-aos="zoom-in" data-aos-duration="1500" className="md:w-1/2 mb-4 md:mb-0">
                            <img
                                className="w-full  h-auto"
                                src={logovk}
                                alt="Nuestra empresa"
                            />
                        </div>
                        <div data-aos="fade-up" data-aos-duration="1500" id="Quienes-somos" className="md:w-1/2 md:ml-8">
                            <h2 className="text-black font-extralight font-montserrat_alternates   text-2xl  md:text-4xl ">Quiénes Somos</h2>
                            <p className="text-gray-600 mt-10 ">
                            Somos tu destino único para todo lo relacionado con la moda y la indumentaria. Nos enorgullece ofrecer una amplia
                            gama de estilos, tallas y diseños que se adaptan a todos los gustos y ocasiones
                            </p>
                            <p className="text-gray-600 mt-2">
                            Nuestra pasión por la moda no se limita solo a ofrecer productos de alta calidad, sino que también nos destacamos 
                            en la creación de prendas únicas que reflejen tu estilo personal. Nuestro equipo de expertos en diseño y confección 
                            está listo para convertir tus ideas en realidad. Desde diseños personalizados que se ajustan perfectamente a tu 
                            visión hasta adaptaciones únicas de prendas existentes, estamos comprometidos a brindarte una experiencia de moda 
                            verdaderamente personalizada.
                            </p>
                        </div>
                    </div>
                    <div className="container mx-auto mt-20">
                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                            <div className="md:w-1/2 mb-4 md:mb-0">
                                <div data-aos="fade-down" data-aos-duration="1500" className="md:w-3/4">
                                    <h2 className="text-black font-extralight font-montserrat_alternates text-2xl md:text-4xl">Por que elegirnos</h2>
                                    <p className="text-gray-600 mt-10">
                                    Lo que nos distingue es nuestro compromiso con la calidad y la atención al detalle. Cada prenda que vendemos 
                                    y creamos está cuidadosamente elaborada para asegurarnos de que te sientas cómodo, seguro y elegante en 
                                    cada ocasión.
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                    Creemos que la moda es una forma de expresión personal, y estamos aquí para ayudarte a 
                                    expresarte de la mejor manera posible.
                                    </p>
                                </div>
                            </div>
                            <div data-aos="zoom-in" data-aos-duration="1500" className="md:w-1/2 md:ml-8">
                                <img
                                    className="w-full h-auto"
                                    src={about}
                                    alt="Nuestra empresa"
                                />
                            </div>
                        </div>
                        <div className=' p-4 md:p-8  ' id="contactos">
                            <div className='max-w-screen-md mx-auto'>
                                <h1  className='text-center text-3xl md:text-6xl font-extralight text-black mt-12 mb-6 font-serif'>Contactanos</h1>
                                <div className="flex flex-col justify-center mt-4 md:mt-6">
                                    <div  className='text-black text-xl md:text-2xl'>
                                        <p className='mb-10'>
                                            Visítanos en: <span className='font-bold text-black'>Isla Jorge 299</span>
                                        </p>
                                        <p className='mb-10'>
                                            Llámanos: <span className='font-bold text-black'>(+54) 1126073801</span>
                                        </p>
                                        <p className='mb-4'>
                                            Escríbenos: <span className='font-bold text-black'>virginiamurayari@gmail.com</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 md:mt-3">
                            <a href="https://www.instagram.com/vk_design_moda/" target="_blank" rel="noopener noreferrer" >
                                <img className="w-10 h-10" src={insta} alt="" />
                            </a>
                            <img className="w-10 h-10" src={facebook} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-black text-white text-center py-0.5">
                <p>Diseño Web &copy; Pauin 2023</p>
            </footer>
        </div>
    );
}

export default Home;
