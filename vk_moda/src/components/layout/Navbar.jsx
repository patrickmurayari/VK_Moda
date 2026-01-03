import { useState, useEffect } from 'react';
import { Link } from "react-scroll"
import { Search, Menu, X } from 'lucide-react';
import logoVK from "../../img/logoVK.png";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > window.innerHeight * 0.8);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) {
            document.body.style.overflow = '';
            return;
        }

        document.body.style.overflow = 'hidden';
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
    const closeMenu = () => {
        setMenuOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-screen z-50 transition-all duration-300 ${
                menuOpen 
                    ? 'bg-white shadow-elegant h-16 md:h-20' 
                    : isScrolled
                    ? 'bg-white shadow-elegant h-16 md:h-20'
                    : 'bg-transparent h-16 md:h-20'
            }`}>
                <div className="flex items-center justify-between px-6 md:px-12 py-3 md:py-5">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <Link to="hero" spy={true} smooth={true} offset={-100} duration={500}>
                            <div className="relative">
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                    isScrolled || menuOpen ? 'bg-white shadow-elegant' : 'bg-white/90'
                                }`}>
                                    <img
                                        src={logoVK}
                                        alt="Logo VK Moda"
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-contain"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            to="hero" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className={`relative text-base font-normal transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-orange-400 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-accent-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`}
                        >
                            Inicio
                        </Link>
                        <Link 
                            to="categorias" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className={`relative text-base font-normal transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-orange-400 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-accent-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`}
                        >
                            Categorías
                        </Link>
                        <Link 
                            to="coleccion" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className={`relative text-base font-normal transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-orange-400 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-accent-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`}
                        >
                            Colección
                        </Link>
                        <Link 
                            to="ofertas" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className={`relative text-base font-normal transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-orange-400 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-accent-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`}
                        >
                            Ofertas
                        </Link>
                        <Link 
                            to="quienes-somos" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className={`relative text-base font-normal transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-orange-400 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-accent-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`}
                        >
                            Quiénes Somos
                        </Link>
                        <Link 
                            to="contactos" 
                            spy={true} 
                            smooth={true} 
                            offset={-100} 
                            duration={500} 
                            className={`relative text-base font-normal transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-orange-400 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-accent-600 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`}
                        >
                            Contáctanos
                        </Link>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon - Desktop */}
                        {!menuOpen && (
                            <button 
                                className={`hidden md:block transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'} hover:text-gray-200`} 
                                onClick={toggleSearch}
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        )}
                        
                        {/* Search Icon - Mobile */}
                        {!menuOpen && (
                            <button 
                                className={`md:hidden transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'} hover:text-gray-200`} 
                                onClick={toggleSearch}
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        )}
                        
                        {/* Menu Toggle - Mobile Only */}
                        <button 
                            className={`md:hidden ${menuOpen || isScrolled ? 'text-gray-900' : 'text-white'} hover:text-gray-200 transition-colors duration-300 focus:outline-none`} 
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar - Overlay */}
                {searchOpen && !menuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200">
                        <div className="px-6 md:px-12 py-4">
                            <div className="max-w-2xl mx-auto relative">
                                <input 
                                    type="text" 
                                    placeholder="Buscar..."
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                                    autoFocus
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeMenu}
                ></div>

                <div
                    className={`absolute top-16 right-0 h-[calc(100%-4rem)] w-[86%] max-w-sm bg-white/82 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.28)] border-l border-white/40 transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="h-full flex flex-col">

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="flex flex-col">
                                <Link 
                                    to="hero" 
                                    spy={true} 
                                    smooth={true} 
                                    onClick={closeMenu} 
                                    offset={-100} 
                                    duration={500} 
                                    className="group flex items-center justify-between py-4 border-b border-black/10"
                                >
                                    <span className="font-heading text-[15px] font-semibold tracking-[0.22em] uppercase text-neutral-900/90 transition-colors duration-300">Inicio</span>
                                    <span className="h-1.5 w-1.5 rounded-full transition-colors duration-300"></span>
                                </Link>
                                <Link 
                                    to="categorias" 
                                    spy={true} 
                                    smooth={true} 
                                    onClick={closeMenu} 
                                    offset={-100} 
                                    duration={500} 
                                    className="group flex items-center justify-between py-4 border-b border-black/10"
                                >
                                    <span className="font-heading text-[15px] font-semibold tracking-[0.22em] uppercase text-neutral-900/90 transition-colors duration-300">Categorías</span>
                                    <span className="h-1.5 w-1.5 rounded-full transition-colors duration-300"></span>
                                </Link>
                                <Link 
                                    to="coleccion" 
                                    spy={true} 
                                    smooth={true} 
                                    onClick={closeMenu} 
                                    offset={-100} 
                                    duration={500} 
                                    className="group flex items-center justify-between py-4 border-b border-black/10"
                                >
                                    <span className="font-heading text-[15px] font-semibold tracking-[0.22em] uppercase text-neutral-900/90 transition-colors duration-300">Colección</span>
                                    <span className="h-1.5 w-1.5 rounded-full transition-colors duration-300"></span>
                                </Link>
                                <Link 
                                    to="ofertas" 
                                    spy={true} 
                                    smooth={true} 
                                    onClick={closeMenu} 
                                    offset={-100} 
                                    duration={500} 
                                    className="group flex items-center justify-between py-4 border-b border-black/10"
                                >
                                    <span className="font-heading text-[15px] font-semibold tracking-[0.22em] uppercase text-neutral-900/90 transition-colors duration-300">Ofertas</span>
                                    <span className="h-1.5 w-1.5 rounded-full transition-colors duration-300"></span>
                                </Link>
                                <Link 
                                    to="quienes-somos" 
                                    spy={true} 
                                    smooth={true} 
                                    onClick={closeMenu} 
                                    offset={-100} 
                                    duration={500} 
                                    className="group flex items-center justify-between py-4 border-b border-black/10"
                                >
                                    <span className="font-heading text-[15px] font-semibold tracking-[0.22em] uppercase text-neutral-900/90 transition-colors duration-300">Quiénes Somos</span>
                                    <span className="h-1.5 w-1.5 rounded-full  transition-colors duration-300"></span>
                                </Link>
                                <Link 
                                    to="contactos" 
                                    spy={true} 
                                    smooth={true} 
                                    onClick={closeMenu} 
                                    offset={-100} 
                                    duration={500} 
                                    className="group flex items-center justify-between py-4"
                                >
                                    <span className="font-heading text-[15px] font-semibold tracking-[0.22em] uppercase text-neutral-900/90 transition-colors duration-300">Contáctanos</span>
                                    <span className="h-1.5 w-1.5 rounded-full  transition-colors duration-300"></span>
                                </Link>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3">
                                <Link
                                    to="categorias"
                                    spy={true}
                                    smooth={true}
                                    onClick={closeMenu}
                                    offset={-100}
                                    duration={500}
                                    className="w-full rounded-xl bg-orange-600 text-white px-4 py-3 text-center font-heading text-[12px] font-semibold tracking-[0.24em] uppercase hover:bg-orange-600 transition-colors"
                                >
                                    Ver productos
                                </Link>
                                <Link
                                    to="contactos"
                                    spy={true}
                                    smooth={true}
                                    onClick={closeMenu}
                                    offset={-100}
                                    duration={500}
                                    className="w-full rounded-xl border border-black/15 bg-white/60 px-4 py-3 text-center font-heading text-[12px] font-semibold tracking-[0.24em] uppercase text-neutral-900 hover:bg-white transition-colors"
                                >
                                    Escribinos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
