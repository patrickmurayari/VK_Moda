import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryTree } from '../../services/api';

const NAV_EXTRAS = [
    { id: 'quienes-somos', label: 'Quiénes Somos', slug: '/quienes-somos' },
    { id: 'colecciones', label: 'Colecciones', slug: '/coleccion' },
    { id: 'contacto', label: 'Contacto', action: 'scroll', target: 'contactos' },
];

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function MobileMenu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [rootItems, setRootItems] = useState([]);
    const [viewStack, setViewStack] = useState(null);

    useEffect(() => {
        getCategoryTree()
            .then((tree) => {
                const items = [...tree, ...NAV_EXTRAS];
                setRootItems(items);
                setViewStack([{ items, title: null }]);
            })
            .catch((err) => {
                console.error('Error cargando árbol de navegación:', err);
                setViewStack([{ items: NAV_EXTRAS, title: null }]);
            });
    }, []);

    const isRoot = !viewStack || viewStack.length === 1;

    const resetStack = () => setViewStack([{ items: rootItems, title: null }]);

    const pushView = (item) => {
        if (item.children && viewStack) {
            setViewStack([...viewStack, { items: item.children, title: item.label }]);
        }
    };

    const popView = () => {
        if (viewStack && viewStack.length > 1) {
            setViewStack(viewStack.slice(0, -1));
        }
    };

    const handleItemClick = (item) => {
        if (item.children) {
            pushView(item);
            return;
        }

        onClose();

        if (item.action === 'scroll') {
            setTimeout(() => scrollTo(item.target), 300);
            setTimeout(resetStack, 500);
        } else if (item.slug) {
            setTimeout(() => {
                navigate(item.slug);
                window.scrollTo(0, 0);
                resetStack();
            }, 300);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetStack, 500);
    };

    const depth = viewStack ? viewStack.length - 1 : 0;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[99] bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={handleClose}
            />

            {/* Panel: full-screen mobile | right drawer desktop */}
            <div className={`fixed inset-y-0 right-0 z-[100] flex flex-col bg-white transition-transform duration-500 ease-in-out w-full md:max-w-md md:w-[450px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header — fixed, never slides */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 md:px-8 h-16 border-b-[0.5px] border-neutral-100">
                    <button
                        onClick={popView}
                        className={`flex items-center gap-1.5 transition-opacity duration-300 ${isRoot ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:opacity-60'}`}
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 text-black" strokeWidth={1} />
                        <span className="font-serif text-[10px] font-light tracking-[0.2em] underline underline-offset-4 uppercase text-black">Detrás</span>
                    </button>

                    <button
                        onClick={handleClose}
                        className="hover:opacity-60 transition-opacity duration-300"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" strokeWidth={1} />
                    </button>
                </div>

                {/* Sliding strip */}
                <div className="flex-1 overflow-hidden">
                    {!viewStack ? (
                        <div className="px-6 md:px-8 py-8 space-y-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-[1px] bg-neutral-100 w-full" />
                            ))}
                        </div>
                    ) : (
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${depth * 100}%)` }}
                    >
                        {viewStack.map((view, stackIdx) => (
                            <div key={stackIdx} className="min-w-full h-full flex flex-col overflow-y-auto">
                                {/* Panel title */}
                                {view.title && (
                                    <div className="px-6 md:px-8 pt-8 pb-4 flex-shrink-0">
                                        <h2 className="font-serif text-2xl tracking-[0.3em] font-light uppercase text-black">
                                            {view.title}
                                        </h2>
                                    </div>
                                )}

                                {/* Panel items */}
                                <nav className="px-6 md:px-8">
                                    <div className="py-4">
                                        {view.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleItemClick(item)}
                                                className="w-full group flex items-center justify-between py-5 border-b-[0.5px] border-neutral-100 text-left"
                                            >
                                                <span className={`tracking-wide uppercase font-serif font-light transition-colors duration-300 ${
                                                    item.children
                                                        ? 'text-sm md:text-xl tracking-[0.2em] text-black group-hover:text-black/60'
                                                        : 'text-sm tracking-[0.2em] text-black group-hover:text-black/60'
                                                }`}>
                                                    {item.label}
                                                </span>
                                                {item.children && (
                                                    <ChevronRight className="w-4 h-4 text-black group-hover:text-black/60 transition-colors duration-300" strokeWidth={1} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Bottom accent — fixed */}
                <div className="flex-shrink-0 px-6 md:px-8 py-8 border-t-[0.5px] border-neutral-100">
                    <span className="font-serif text-xs tracking-[0.4em] uppercase text-black">Indumentaria & Confecciones</span>
                </div>
            </div>
        </>
    );
}

MobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MobileMenu;
