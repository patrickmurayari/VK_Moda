import { useState, useEffect } from "react";

import { RxDot } from "react-icons/rx";
import foto1 from "../img/Carrousel/foto11.jpg";
import foto2 from "../img/Carrousel/foto21.jpg";
import foto3 from "../img/Carrousel/foto31.jpg";
import ofertas from "../img/ofertafoto1.jpg";
import carteras from "../img/Categoria/bolsofoto.jpg";
import joya1 from "../img/Categoria/fotojoyas.jpg";
import vestidos from "../img/Categoria/fotovestido.jpg";
import ropapersonalizada from "../img/Categoria/ropapersonalizada1.jpg";
import insta from "../img/insta.png"
import facebook from "../img/facebook.png"
import CardOfertas from "./CardOfertas";
import CardProducts from "./CardCategoria";
import CarrouselSwip from "./CarrouselSwip";
import MapaContacto from "./MapaContacto";
import FormularioContacto from "./FormularioContacto";
import fotoabout from "../img/fotoabout11.jpg"
import about from "../img/about1.jpg"

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
        }

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
                <div className="bg-black w-full h-[700px] sm:h-[600px] md:h-[800px] lg:h-[900px] overflow-hidden relative">
                    {slides.map((slide, slideIndex) => (
                        <img
                            key={slideIndex}
                            src={slide.url}
                            alt={`Slide ${slideIndex}`}
                            className={`w-full h-full absolute top-0 left-0 object-cover transition-opacity duration-1000 ${slideIndex === currentIndex ? "opacity-100" : "opacity-0"
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
                <div className="md:mt-20 mt-12">
                    <div className="text-center mb-12">
                        <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-primary-900 font-elegant text-3xl md:text-5xl font-bold tracking-wide">Categorías Destacadas</h1>
                        <div className="w-24 h-1 bg-accent-600 mx-auto mt-4 rounded-full"></div>
                    </div>
                    <CardProducts products={ProductsCategoria} />
                </div>
                <div className="mt-24 md:mt-28 px-4 md:px-8" id="coleccion">
                    <div className="text-center mb-12">
                        <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-primary-900 font-elegant text-3xl md:text-5xl font-bold tracking-wide">Nueva Colección 2024</h1>
                        <div className="w-24 h-1 bg-accent-600 mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div className="mt-8">
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
                        <div data-aos="fade-up" data-aos-duration="1500" className="md:w-1/2 md:ml-12">
                            <h2 className="text-primary-900 font-elegant text-3xl md:text-4xl font-bold tracking-wide">Quiénes Somos</h2>
                            <div className="w-16 h-1 bg-accent-600 mt-4 rounded-full"></div>
                            <div id="Quienes-somos">
                                <p className="text-neutral-600 mt-8 leading-relaxed text-base md:text-lg">
                                    Somos una marca con más de 20 años de experiencia en el mundo de la moda e indumentaria.
                                    Nos enorgullece ofrecer una amplia gama de estilos, tallas y diseños que se adaptan a todos los gustos y
                                    ocasiones.
                                </p>
                                <p className="text-neutral-600 mt-6 leading-relaxed text-base md:text-lg">
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
                                    <h2 className="text-primary-900 font-elegant text-3xl md:text-4xl font-bold tracking-wide">Por Qué Elegirnos</h2>
                                    <div className="w-16 h-1 bg-accent-600 mt-4 rounded-full"></div>
                                    <p className="text-neutral-600 mt-8 leading-relaxed text-base md:text-lg">
                                        Lo que nos distingue es nuestro compromiso con la calidad y la atención al detalle. Cada prenda que vendemos
                                        y creamos está cuidadosamente elaborada para asegurarnos de que te sientas cómodo, seguro y elegante en
                                        cada ocasión.
                                    </p>
                                    <p className="text-neutral-600 mt-6 leading-relaxed text-base md:text-lg">
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
                        <div className='p-4 md:p-12 bg-neutral-50 rounded-xl shadow-elegant mt-12' id="contactos">
                            <div className='max-w-7xl mx-auto'>
                                <h1 className='text-center text-3xl md:text-5xl font-elegant font-bold text-primary-900 mt-6 mb-2 tracking-wide'>Contáctanos</h1>
                                <div className="w-24 h-1 bg-accent-600 mx-auto mb-12 rounded-full"></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    {/* Columna Izquierda: Información y Mapa */}
                                    <div className="space-y-8">
                                        {/* Información de Contacto */}
                                        <div className='text-neutral-700 space-y-6'>
                                            <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                                                <span className='text-accent-600 font-bold text-3xl flex-shrink-0'>📍</span>
                                                <div>
                                                    <p className='font-semibold text-primary-900 text-lg'>Visítanos en:</p>
                                                    <p className='text-neutral-600 mt-1 font-medium'>V&A DISEÑO Y MODA</p>
                                                    <p className='text-neutral-600 text-sm'>Localidad: Zona Sur, Buenos Aires</p>
                                                    <p className='text-neutral-600 text-sm'>Argentina</p>
                                                    <a 
                                                        href="https://www.google.com/maps/place/V%26A+DISE%C3%91O+Y+MODA/@-34.44548603723854,-58.98292763996581,15z/data=!4m6!3m5!1s0x95bc830071a4eb65:0x6abb3b406ef6f180!8m2!3d-34.44548603723854!4d-58.98292763996581!16s%2Fg%2F11s5v5v5v5"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className='text-accent-600 hover:text-primary-900 text-xs font-semibold mt-2 inline-block transition-colors'
                                                    >
                                                        Ver en Google Maps →
                                                    </a>
                                                </div>
                                            </div>

                                            <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                                                <span className='text-accent-600 font-bold text-3xl flex-shrink-0'>🕐</span>
                                                <div>
                                                    <p className='font-semibold text-primary-900 text-lg'>Nuestros Horarios:</p>
                                                    <p className='text-neutral-600 mt-1'>Lunes a Viernes: 10:00 - 13:00 | 16:00 - 20:00</p>
                                                    <p className='text-neutral-600'>Sábados: 10:00 - 13:00 | 16:00 - 20:00</p>
                                                    <p className='text-neutral-600 text-sm mt-2'>Domingos: Cerrado</p>
                                                </div>
                                            </div>

                                            <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                                                <span className='text-accent-600 font-bold text-3xl flex-shrink-0'>📞</span>
                                                <div>
                                                    <p className='font-semibold text-primary-900 text-lg'>Llámanos:</p>
                                                    <a href="tel:+541126073801" className='text-accent-600 hover:text-accent-700 font-semibold mt-1 transition-colors'>
                                                        (+54) 11 2607-3801
                                                    </a>
                                                </div>
                                            </div>

                                            <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                                                <span className='text-accent-600 font-bold text-3xl flex-shrink-0'>✉️</span>
                                                <div>
                                                    <p className='font-semibold text-primary-900 text-lg'>Escríbenos:</p>
                                                    <a href="mailto:murayarivirginia797@gmail.com" className='text-accent-600 hover:text-accent-700 font-semibold mt-1 transition-colors break-all'>
                                                        murayarivirginia797@gmail.com
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mapa */}
                                        <div data-aos="zoom-in" data-aos-duration="1500">
                                            <h3 className='text-lg font-semibold text-primary-900 mb-4'>Ubicación</h3>
                                            <MapaContacto />
                                        </div>
                                    </div>

                                    {/* Columna Derecha: Formulario */}
                                    <div data-aos="fade-up" data-aos-duration="1500">
                                        <h3 className='text-lg font-semibold text-primary-900 mb-6'>Envíanos un Mensaje</h3>
                                        <div className='bg-white p-6 rounded-lg shadow-elegant'>
                                            <FormularioContacto />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 md:gap-8 mt-12 pb-8">
                            <a 
                                href="https://www.instagram.com/vk_design_moda/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-accent-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-900 group-hover:shadow-elegant-lg transform group-hover:scale-110">
                                    <img className="w-6 h-6 md:w-7 md:h-7" src={insta} alt="Instagram" />
                                </div>
                            </a>
                            <a 
                                href="https://www.facebook.com/Granjaelsolarman" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-accent-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-900 group-hover:shadow-elegant-lg transform group-hover:scale-110">
                                    <img className="w-6 h-6 md:w-7 md:h-7" src={facebook} alt="Facebook" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
