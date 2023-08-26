import logo from "../img/logoVK.png"
import { useState } from 'react';
import { Link } from "react-scroll"

import insta from "../img/insta.png"
import facebook from "../img/facebook.png"



function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className={`bg-white md: h-24  py-4 px-8 fixed top-0 left-0 w-full z-50 ${menuOpen ? 'h-screen  shadow-md' : 'md:shadow-none'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="carrousel" spy={true} smooth={true} offset={-100} duration={500}>
                        <img data-aos="fade-right" data-aos-duration="3000" src={logo} alt="Logo" className={`${menuOpen? 'h-18 w-18 mr-2 rounded-full' : 'h-14 w-14 mr-2 rounded-full'}`}  />
                    </Link>
                    {!menuOpen ?( <span  data-aos="zoom-im" data-aos-duration="3000" className=" mt-1 text-black font-semibold">Diseño y Moda</span>
                    ): null}
                   
                </div>
                <div className="md:hidden"> {/* Mostrar solo en dispositivos móviles */}
                    <button className="text-gray-600  mt-3 hover:text-black focus:outline-none" onClick={toggleMenu}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>
                <ul className={`md:flex md:mt-10 ${menuOpen ? 'flex flex-col gap-6 text-xl border  border-blue-50' : 'hidden'} md:space-x-6 mt-4  md:gap-10 md:mt-0`}>
                    <li data-aos="zoom-im" data-aos-duration="3000" >
                        <Link to="carrousel" spy={true} smooth={true} onClick={closeMenu}  offset={-100} duration={500} className="text-black md:text-base text-xl cursor-pointer hover:text-gray-400">Inicio</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000">
                        <Link to="productos" spy={true} smooth={true} onClick={closeMenu} offset={-100} duration={500} className="text-black md:text-base text-xl  cursor-pointer  hover:text-gray-400" >Productos</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000" >
                        <Link to="coleccion" spy={true} smooth={true}onClick={closeMenu}  offset={-100} duration={500} className="text-black md:text-base text-xl cursor-pointer  hover:text-gray-400">Colección</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000" >
                        <Link to="Quienes-somos" spy={true} smooth={true} onClick={closeMenu} offset={-350} duration={500} className="text-black md:text-base text-xl cursor-pointer  hover:text-gray-400">Quienes somos</Link>
                    </li>
                    <li data-aos="zoom-im" data-aos-duration="3000">
                        <Link to="contactos" spy={true} smooth={true} onClick={closeMenu} offset={-150} duration={500} className="text-black md:text-base text-xl  cursor-pointer  hover:text-gray-400">Contáctanos</Link>
                    </li>
                </ul>
                <div> 
                {menuOpen ? null : (
                        <div data-aos="zoom-im" data-aos-duration="3000" className="flex mt-2">
                            <a href="https://www.instagram.com/vk_design_moda/" target="_blank" rel="noopener noreferrer">
                                <img  className="h-5 mb-1 mr-3 md:h-7" src={insta} alt="" />
                            </a>
                            <a href="https://www.facebook.com/Granjaelsolarman" target="_blank" rel="noopener noreferrer">
                                <img  className="h-5 mb-1 mr-3 md:h-7 text-gray" src={facebook} alt="" />
                            </a>
                        </div>
                    )}
            </div>
        </div>
        
    </nav>
    );
}

export default Navbar;
