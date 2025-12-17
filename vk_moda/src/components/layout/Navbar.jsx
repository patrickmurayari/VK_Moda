import logo from "../../img/logoVK.png"
import { useState } from 'react';
import { Link } from "react-scroll"
import SocialIcons from "../common/SocialIcons"

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 w-screen z-50 transition-all duration-300 ${
            menuOpen 
                ? 'bg-white h-screen shadow-elegant-lg' 
                : 'bg-white/95 backdrop-blur-md h-16 md:h-18 shadow-elegant'
        }`}>
            <div className="flex items-center justify-between px-6 md:px-12 py-3 md:py-4">
                {/* Logo y Marca */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <Link to="carrousel" spy={true} smooth={true} offset={-100} duration={500}>
                        <img 
                            src={logo} 
                            alt="Logo VK Moda" 
                            className={`rounded-full transition-transform duration-300 group-hover:scale-110 ${
                                menuOpen ? 'h-14 w-14' : 'h-10 w-10 md:h-12 md:w-12'
                            }`}  
                        />
                    </Link>
                    {!menuOpen && (
                        <span 
                            className="hidden md:block text-primary-900 font-elegant text-lg font-semibold tracking-wide"
                        >
                            VK
                        </span>
                    )}
                </div>

                {/* Menú Desktop */}
                <ul className="hidden md:flex items-center gap-6">
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

                {/* Redes Sociales y Menú Mobile */}
                <div className="flex items-center gap-3">
                    {/* Redes Sociales Desktop */}
                    {!menuOpen && (
                        <div className="hidden md:block">
                            <SocialIcons variant="default" size="sm" />
                        </div>
                    )}
                    
                    {/* Redes Sociales Mobile */}
                    {!menuOpen && (
                        <div className="md:hidden">
                            <SocialIcons variant="default" size="sm" />
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
                        <SocialIcons variant="default" size="md" />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
