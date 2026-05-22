import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Search, Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isCategoryPage = location.pathname.startsWith('/categoria');

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

    const textColor = menuOpen || isScrolled || isCategoryPage ? 'text-black' : 'text-white';

    const BrandName = () => (
        <span className={`font-display text-4xl md:text-2xl lg:text-7xl tracking-[0.4em] font-light ${textColor} transition-colors duration-300 select-none`}>
            V&A
        </span>
    );

    return (
        <>
            <nav className={`fixed top-0 left-0 w-screen z-50 transition-all duration-500 ${
                menuOpen
                    ? 'bg-white h-16 md:h-20'
                    : isScrolled || isCategoryPage
                    ? 'bg-white h-16 md:h-20 border-b-[0.5px] border-neutral-100'
                    : 'bg-transparent h-16 md:h-20'
            }`}>
                <div className="relative flex items-center justify-between md:justify-center h-full px-6 md:px-8 lg:px-12">
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

                    {/* Right: Search + Menu (both mobile & desktop) */}
                    <div className="flex items-center space-x-6 md:absolute md:right-6 lg:right-80">
                        {!menuOpen && (
                            <button
                                className={`${textColor} hover:opacity-60 transition-colors duration-300`}
                                onClick={toggleSearch}
                                aria-label="Search"
                            >
                                <Search className="w-6 h-6" strokeWidth={1.5} />
                            </button>
                        )}
                        <button
                            className={`${textColor} hover:opacity-60 transition-all duration-300 focus:outline-none`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
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

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
        </>
    );
}

export default Navbar;
