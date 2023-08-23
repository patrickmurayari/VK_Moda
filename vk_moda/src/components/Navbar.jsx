import logo from "../img/logoVK.png"
import { useState } from 'react';
import { Link } from "react-scroll"

import insta from "../img/insta.png"
import facebook from "../img/facebook.png"
import whatsapp from "../img/whatsapp.png"


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className={`bg-white py-4 px-8 fixed top-0 left-0 w-full z-50 ${menuOpen ? 'shadow-md' : 'md:shadow-none'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="carrousel" spy={true} smooth={true} offset={-100} duration={500}>
                        <img data-aos="fade-right" data-aos-duration="3000" src={logo} alt="Logo" className="h-14 w-14 mr-2 rounded-full" />
                    </Link>
                    <span  data-aos="zoom-im" data-aos-duration="3000" className="text-black font-semibold">VK Moda</span>
                </div>
                <div className="md:hidden"> {/* Mostrar solo en dispositivos móviles */}
                    <button className="text-gray-600 hover:text-red-600 focus:outline-none" onClick={toggleMenu}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>
                <ul className={`md:flex ${menuOpen ? 'flex flex-col' : 'hidden'} md:space-x-6 mt-4  md:mt-0`}>
                    <li data-aos="zoom-im" data-aos-duration="3000" >
                        <Link to="carrousel" spy={true} smooth={true} offset={-100} duration={500} className="text-black md:text-base text-xl cursor-pointer hover:text-orange-600">Inicio</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000">
                        <Link to="about" spy={true} smooth={true} offset={-100} duration={500} className="text-black  md:text-base text-xl  cursor-pointer hover:text-orange-600" >Catalogo</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000" >
                        <Link to="productos" spy={true} smooth={true} offset={-350} duration={500} className="text-black md:text-base text-xl cursor-pointer hover:text-orange-600">Quienes somos</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000">
                        <Link to="contactos" spy={true} smooth={true} offset={-150} duration={500} className="text-black md:text-base text-xl  cursor-pointer hover:text-orange-600">Contáctanos</Link>
                    </li>
                </ul>
                <div> 
                <div data-aos="zoom-im" data-aos-duration="3000" className="flex">
                    <a href="https://www.instagram.com/elgustoenfamilia/" target="_blank" rel="noopener noreferrer">
                        <img  className=" h-5 mb-1  mr-3 md:h-7" src={insta} alt="" />
                    </a>
                    <a href="https://www.facebook.com/Granjaelsolarman" target="_blank" rel="noopener noreferrer">
                        <img  className=" h-5 mb-1  mr-3 md:h-7 text-gray" src={facebook} alt="" />
                    </a>
                    <a href="https://api.whatsapp.com/send?phone=541131666991" target="_blank" rel="noopener noreferrer">
                        <img  className=" h-5 mb-1  mr-3 md:h-7 text-gray" src={whatsapp} alt="" />
                    </a>
                </div>
            </div>
        </div>
        
    </nav>
    );
}

export default Navbar;
