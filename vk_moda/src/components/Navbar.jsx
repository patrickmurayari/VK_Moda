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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            menuOpen 
                ? 'bg-white h-screen shadow-elegant-lg' 
                : 'bg-white/95 backdrop-blur-md h-20 md:h-24 shadow-elegant'
        }`}>
            <div className="flex items-center justify-between px-6 md:px-12 py-4 md:py-6">
                {/* Logo y Marca */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <Link to="carrousel" spy={true} smooth={true} offset={-100} duration={500}>
                        <img 
                            data-aos="fade-right" 
                            data-aos-duration="3000" 
                            src={logo} 
                            alt="Logo VK Moda" 
                            className={`rounded-full transition-transform duration-300 group-hover:scale-110 ${
                                menuOpen ? 'h-16 w-16' : 'h-12 w-12 md:h-14 md:w-14'
                            }`}  
                        />
                    </Link>
                    {!menuOpen && (
                        <span 
                            data-aos="zoom-in" 
                            data-aos-duration="3000" 
                            className="hidden md:block text-primary-900 font-elegant text-xl font-semibold tracking-wide"
                        >
                            VK
                        </span>
                    )}
                </div>

                {/* Menú Desktop */}
                <ul className="hidden md:flex items-center gap-8">
                    <li>
                        <Link 
                            to="carrousel" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className="text-primary-700 text-sm font-medium cursor-pointer hover:text-accent-600 transition-colors duration-300 relative group"
                        >
                            Inicio
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="productos" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className="text-primary-700 text-sm font-medium cursor-pointer hover:text-accent-600 transition-colors duration-300 relative group"
                        >
                            Productos
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="coleccion" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className="text-primary-700 text-sm font-medium cursor-pointer hover:text-accent-600 transition-colors duration-300 relative group"
                        >
                            Colección
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="Quienes-somos" 
                            spy={true} 
                            smooth={true} 
                            offset={-350} 
                            duration={500} 
                            className="text-primary-700 text-sm font-medium cursor-pointer hover:text-accent-600 transition-colors duration-300 relative group"
                        >
                            Quiénes Somos
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="contactos" 
                            spy={true} 
                            smooth={true} 
                            offset={-150} 
                            duration={500} 
                            className="text-primary-700 text-sm font-medium cursor-pointer hover:text-accent-600 transition-colors duration-300 relative group"
                        >
                            Contáctanos
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-600 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </li>
                </ul>

                {/* Redes Sociales Desktop */}
                {!menuOpen && (
                    <div 
                        data-aos="fade-left" 
                        data-aos-duration="3000" 
                        className="hidden md:flex items-center gap-4"
                    >
                        <a 
                            href="https://www.instagram.com/vk_design_moda/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-700 hover:text-accent-600 transition-colors duration-300 hover:scale-110 transform"
                        >
                            <img className="h-5 md:h-6" src={insta} alt="Instagram" />
                        </a>
                        <a 
                            href="https://www.facebook.com/Granjaelsolarman" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-700 hover:text-accent-600 transition-colors duration-300 hover:scale-110 transform"
                        >
                            <img className="h-5 md:h-6" src={facebook} alt="Facebook" />
                        </a>
                    </div>
                )}

                {/* Botón Menú Móvil */}
                <button 
                    className="md:hidden text-primary-700 hover:text-accent-600 transition-colors duration-300 focus:outline-none" 
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        )}
                    </svg>
                </button>
            </div>

            {/* Menú Móvil */}
            {menuOpen && (
                <div className="md:hidden px-6 py-6 space-y-6 border-t border-neutral-200">
                    <Link 
                        to="carrousel" 
                        spy={true} 
                        smooth={true} 
                        onClick={closeMenu} 
                        offset={-100} 
                        duration={500} 
                        className="block text-primary-700 text-lg font-medium hover:text-accent-600 transition-colors duration-300 cursor-pointer"
                    >
                        Inicio
                    </Link>
                    <Link 
                        to="productos" 
                        spy={true} 
                        smooth={true} 
                        onClick={closeMenu} 
                        offset={-100} 
                        duration={500} 
                        className="block text-primary-700 text-lg font-medium hover:text-accent-600 transition-colors duration-300 cursor-pointer"
                    >
                        Productos
                    </Link>
                    <Link 
                        to="coleccion" 
                        spy={true} 
                        smooth={true} 
                        onClick={closeMenu} 
                        offset={-100} 
                        duration={500} 
                        className="block text-primary-700 text-lg font-medium hover:text-accent-600 transition-colors duration-300 cursor-pointer"
                    >
                        Colección
                    </Link>
                    <Link 
                        to="Quienes-somos" 
                        spy={true} 
                        smooth={true} 
                        onClick={closeMenu} 
                        offset={-350} 
                        duration={500} 
                        className="block text-primary-700 text-lg font-medium hover:text-accent-600 transition-colors duration-300 cursor-pointer"
                    >
                        Quiénes Somos
                    </Link>
                    <Link 
                        to="contactos" 
                        spy={true} 
                        smooth={true} 
                        onClick={closeMenu} 
                        offset={-150} 
                        duration={500} 
                        className="block text-primary-700 text-lg font-medium hover:text-accent-600 transition-colors duration-300 cursor-pointer"
                    >
                        Contáctanos
                    </Link>
                    
                    {/* Redes Sociales Móvil */}
                    <div className="flex items-center gap-6 pt-4 border-t border-neutral-200">
                        <a 
                            href="https://www.instagram.com/vk_design_moda/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-700 hover:text-accent-600 transition-colors duration-300"
                        >
                            <img className="h-6" src={insta} alt="Instagram" />
                        </a>
                        <a 
                            href="https://www.facebook.com/Granjaelsolarman" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-700 hover:text-accent-600 transition-colors duration-300"
                        >
                            <img className="h-6" src={facebook} alt="Facebook" />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
