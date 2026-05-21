import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Search, Menu, X } from 'lucide-react';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isCategoryPage = ['/vestidos', '/bolsos', '/indumentaria', '/joyeria', '/hombre'].includes(location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
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

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const closeMenu = () => setMenuOpen(false);
    const toggleSearch = () => setSearchOpen(!searchOpen);

    const textColor = menuOpen || isScrolled ? 'text-black' : 'text-white';

    const BrandName = () => (
        <span className={`font-display text-4xl md:text-2xl lg:text-7xl tracking-[0.4em] font-extralight ${textColor} transition-colors duration-300 select-none`}>
            V&A
        </span>
    );

    return (
        <>
            <nav className={`fixed top-0 left-0 w-screen z-50 transition-all duration-500 ${
                menuOpen
                    ? 'bg-white h-16 md:h-20'
                    : isScrolled
                    ? 'bg-stone-50/80 backdrop-blur-md h-16 md:h-20 border-b-[0.5px] border-black/10'
                    : 'bg-transparent h-16 md:h-20'
            }`}>
                <div className="relative flex items-center justify-between md:justify-center h-full px-6 md:px-12">
                    {/* Desktop: Hamburger Left (absolute) */}
                    <button
                        className={`hidden md:flex absolute left-6 lg:left-12 ${textColor} hover:opacity-60 transition-all duration-300 focus:outline-none`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" strokeWidth={1} /> : <Menu className="w-5 h-5" strokeWidth={1} />}
                    </button>

                    {/* Brand Name: left on mobile, centered on desktop */}
                    {isCategoryPage ? (
                        <RouterLink to="/" className="cursor-pointer md:absolute md:left-1/2 md:-translate-x-1/2">
                            <BrandName />
                        </RouterLink>
                    ) : (
                        <button onClick={() => scrollTo('hero')} className="cursor-pointer md:absolute md:left-1/2 md:-translate-x-1/2">
                            <BrandName />
                        </button>
                    )}

                    {/* Right: Search + Mobile Hamburger */}
                    <div className="flex items-center space-x-4 md:absolute md:right-6 lg:right-12">
                        {!menuOpen && (
                            <button
                                className={`${textColor} hover:opacity-60 transition-colors duration-300`}
                                onClick={toggleSearch}
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" strokeWidth={1} />
                            </button>
                        )}
                        <button
                            className={`md:hidden ${textColor} hover:opacity-60 transition-all duration-300 focus:outline-none`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-5 h-5" strokeWidth={1} /> : <Menu className="w-5 h-5" strokeWidth={1} />}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {searchOpen && !menuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b-[0.5px] border-black/10">
                        <div className="px-6 md:px-12 py-4">
                            <div className="max-w-2xl mx-auto relative">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full px-4 py-3 pr-12 border-b-[0.5px] border-black/15 bg-transparent focus:outline-none focus:border-black/40 font-body text-sm tracking-wide placeholder:text-black/30"
                                    autoFocus
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 w-4 h-4" strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Full-screen Menu Overlay */}
            <div className={`fixed inset-0 z-40 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeMenu}
                />

                <div className={`absolute inset-0 bg-white flex flex-col items-center justify-center transition-all duration-500 ease-out ${menuOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Close button */}
                    <button
                        className="absolute top-5 right-6 md:right-12 text-neutral-900 hover:opacity-60 transition-opacity duration-300"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6" strokeWidth={1} />
                    </button>

                    {/* Navigation Links */}
                    <nav className="flex flex-col items-center gap-8 md:gap-10">
                        <button
                            onClick={() => { closeMenu(); scrollTo('hero'); }}
                            className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light text-neutral-900 hover:text-neutral-500 transition-colors duration-300"
                        >
                            Inicio
                        </button>
                        <button
                            onClick={() => { closeMenu(); scrollTo('categorias'); }}
                            className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light text-neutral-900 hover:text-neutral-500 transition-colors duration-300"
                        >
                            Categorías
                        </button>
                        <button
                            onClick={() => { closeMenu(); scrollTo('coleccion'); }}
                            className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light text-neutral-900 hover:text-neutral-500 transition-colors duration-300"
                        >
                            Colección
                        </button>
                        <button
                            onClick={() => { closeMenu(); scrollTo('quienes-somos'); }}
                            className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light text-neutral-900 hover:text-neutral-500 transition-colors duration-300"
                        >
                            Quiénes Somos
                        </button>
                        <button
                            onClick={() => { closeMenu(); scrollTo('contactos'); }}
                            className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light text-neutral-900 hover:text-neutral-500 transition-colors duration-300"
                        >
                            Contáctanos
                        </button>
                    </nav>

                    {/* Bottom accent */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-4">
                        <span className="font-display text-xs tracking-[0.4em] uppercase text-black/30">Indumentaria & Confecciones</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
