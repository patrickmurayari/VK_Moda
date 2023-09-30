import { useState, useEffect } from "react";

import { RxDot } from "react-icons/rx";
import foto1 from "../img/Carrousel/foto1.jpg";
import foto2 from "../img/Carrousel/foto2.jpg";
import foto3 from "../img/Carrousel/fotoPortada.jpg";
import foto4 from "../img/Carrousel/fotoPortada1.jpg";
import ofertas from "../img/ofertafoto.jpg";
import carteras from "../img/Categoria/bolsofoto.jpg";
import joya1 from "../img/Categoria/fotojoyas.jpg";
import vestidos from "../img/Categoria/fotovestido.jpg";
import ropapersonalizada from "../img/Categoria/ropapersonalizada1.jpg";
import insta from "../img/insta.png"
import facebook from "../img/facebook.png"
import CardOfertas from "./CardOfertas";
import CardProducts from "./CardCategoria";
import CarrouselSwip from "./CarrouselSwip";
import fotoabout from "../img/fotoabout.jpg"
import about from "../img/about.jpg"

import oferta1 from '../img/ofertas/oferta1.jpg'
import oferta2 from '../img/ofertas/oferta2.jpg'
import oferta3 from '../img/ofertas/oferta3.jpg'
import oferta4 from '../img/ofertas/oferta4.jpg'
import oferta5 from '../img/ofertas/oferta5.jpg'
import oferta6 from '../img/ofertas/oferta6.jpg'
import oferta7 from '../img/ofertas/oferta7.jpg'
import oferta8 from '../img/ofertas/oferta8.jpg'
import oferta9 from '../img/ofertas/oferta9.jpg'
import oferta10 from '../img/ofertas/oferta10.jpg'

const ofertsProducts = [
    {
        id: 1,
        id_name: "vestidos",
        image: `${oferta1}`,
        name: "Jogging verde de algodón con friza",
        precio: "$12000",
    },
    {
        id: 2,
        id_name: "bolsos",
        image: `${oferta2}`,
        name: "Pantalón deportivo",
        precio: "$10000",
    },
    {
        id: 3,
        id_name: "indumentaria",
        image: `${oferta3}`,
        name: "Pantalón cargo",
        precio: "$10000",
    },
    {
        id: 4,
        id_name: "joyeria",
        image: `${oferta4}`,
        name: "Pantalón de Morley lanilla",
        precio: "$12000",
    },
    {
        id: 5,
        id_name: "joyeria",
        image: `${oferta5}`,
        name: "Pantalón de algodón negro ",
        precio: "$10000",
    },
    {
        id: 6,
        id_name: "joyeria",
        image: `${oferta6}`,
        name: "Pantalón algodón friza",
        precio: "$12000",
    },
    {
        id: 7,
        id_name: "joyeria",
        image: `${oferta7}`,
        name: "Pantalón palazo camel",
        precio: "$12000",
    },
    {
        id: 8,
        id_name: "joyeria",
        image: `${oferta8}`,
        name: "Pantalón palazo lino verde olivo",
        precio: "$12000",
    },
    {
        id: 9,
        id_name: "joyeria",
        image: `${oferta9}`,
        name: "Jogging negro",
        precio: "$7000",
    },
    {
        id: 10,
        id_name: "joyeria",
        image: `${oferta10}`,
        name: "Jogging camuflado",
        precio: "$5000",
    }
]


const ProductsCategoria = [
    {
        id: 1,
        id_name: "vestidos",
        image: `${vestidos}`,
        name: "VESTIDOS",
        precio: "$3519",
    },
    {
        id: 2,
        id_name: "bolsos",
        image: `${carteras}`,
        name: "BOLSOS",
        precio: "$3519",
    },
    {
        id: 3,
        id_name: "indumentaria",
        image: `${ropapersonalizada}`,
        name: "INDUMENTARIA",
        precio: "$3519",
    },
    {
        id: 4,
        id_name: "joyeria",
        image: `${joya1}`,
        name: "JOYERIA",
        precio: "$3519",
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
            <div className="w-full py-0 md:px-1 relative group" id="carrousel">
                <div className="bg-black w-full py-60 h-[400px] md:h-[700px]  overflow-hidden relative">
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
                        <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black flex justify-center font-extralight font-montserrat_alternates text-lg mt-8 md:text-4xl">Categorias Destacadas</h1>
                    </div>
                    <CardProducts products={ProductsCategoria} />
                </div>
                <div className=" mt-24 md:mt-28" id="coleccion">
                    <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight font-montserrat_alternates   text-2xl mt-10 md:text-4xl">Nueva coleccion 2023</h1>
                    <div className="mt-6">
                        <CarrouselSwip />
                    </div>
                </div>
                <div className=" mt-20 md:mt-20">
                    <div className="flex justify-center items-center w-full">
                        <img className="object-cover  md:h-[600px] md:w-[2000px] h-[300px] transform scale-110" src={ofertas} alt="" />
                    </div>
                    <div>
                        <CardOfertas products={ofertsProducts} />
                    </div>
                </div>
                <div className="container mx-auto mt-20">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                        <div data-aos="zoom-in" data-aos-duration="1500" className="md:w-1/2 mb-4 md:mb-0">
                            <img
                                className="w-full  h-auto"
                                src={fotoabout}
                                alt="quienes somos"
                            />
                        </div >
                        <div data-aos="fade-up" data-aos-duration="1500" className="md:w-1/2 md:ml-8">
                            <h2 className="text-black font-extralight font-montserrat_alternates text-2xl  md:text-4xl ">Quiénes Somos</h2>
                            <div id="Quienes-somos">
                                <p className="text-gray-600 mt-10 ">
                                    Somos una marca con mas de 20 años de experiencia con todo lo relacionado a la moda y la indumentaria.
                                    Nos enorgullece ofrecer una amplia gama de estilos, tallas y diseños que se adaptan a todos los gustos y
                                    ocasiones
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
                                        Sabemos que la moda es una forma de expresión personal, y estamos aquí para ayudarte a
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
                        <div className='p-4 md:p-8'>
                            <div className='max-w-screen-md mx-auto'>
                                <h1 className='text-center text-3xl md:text-6xl font-extralight text-black mt-12 mb-6 font-serif'>Contactanos</h1>
                                <div className="flex flex-col justify-center mt-4 md:mt-6" id="contactos" >
                                    <div className='text-black text-xl md:text-2xl'>
                                        <p className='mb-10'>
                                            Visítanos en: <span className='font-bold text-black'>Av. Bartolome Mitre 363 - Shopping Via Manzanares </span>
                                        </p>
                                        <p className='mb-10'>
                                            Nuestros Horarios <span className='font-bold text-black'>Lunes a sabados de 10 am 13pm - 16 a 20pm</span>
                                        </p>
                                        <p className='mb-10'>
                                            Llámanos: <span className='font-bold text-black'>(+54) 1126073801</span>
                                        </p>
                                        <p className='mb-4'>
                                            Escríbenos: <span className='font-bold text-black'>murayarivirginia797@gmail.com</span>
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
        </div>
    );
}

export default Home;
