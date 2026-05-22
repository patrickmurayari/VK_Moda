import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { navigationConfig } from '../../data/navigationConfig';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function MobileMenu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [viewStack, setViewStack] = useState([{ items: navigationConfig, title: null }]);

    const currentView = viewStack[viewStack.length - 1];
    const isRoot = viewStack.length === 1;

    const resetStack = () => setViewStack([{ items: navigationConfig, title: null }]);

    const pushView = (item) => {
        if (item.children) {
            setViewStack([...viewStack, { items: item.children, title: item.label }]);
        }
    };

    const popView = () => {
        if (viewStack.length > 1) {
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
                resetStack();
            }, 300);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetStack, 500);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[99] bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={handleClose}
            />

            {/* Panel: full-screen mobile | right drawer desktop */}
            <div className={`fixed inset-y-0 right-0 z-[100] flex flex-col bg-white transition-transform duration-500 ease-in-out w-full md:max-w-md md:w-[450px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 md:px-8 h-16 border-b-[0.5px] border-neutral-100">
                    <div className="flex items-center">
                        {!isRoot && (
                            <button
                                onClick={popView}
                                className="flex items-center gap-1.5 hover:opacity-60 transition-opacity duration-300"
                                aria-label="Go back"
                            >
                                <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1} />
                                <span className="font-body text-[10px] font-light tracking-[0.2em] uppercase text-neutral-400">Detrás</span>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleClose}
                        className="hover:opacity-60 transition-opacity duration-300"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" strokeWidth={1} />
                    </button>
                </div>

                {/* Dynamic Title */}
                {currentView.title && (
                    <div className="px-6 md:px-8 pt-8 pb-4">
                        <h2 className="font-display text-2xl tracking-[0.3em] font-light uppercase text-black">
                            {currentView.title}
                        </h2>
                    </div>
                )}

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto px-6 md:px-8">
                    <div className="py-4">
                        {currentView.items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className="w-full group flex items-center justify-between py-5 border-b-[0.5px] border-neutral-100 text-left"
                            >
                                <span className={`tracking-wide uppercase ${
                                    item.children
                                        ? 'font-display text-lg md:text-xl tracking-[0.15em] font-light text-black group-hover:text-neutral-500'
                                        : 'font-body text-sm md:text-base tracking-[0.2em] font-light text-black/80 group-hover:text-black'
                                } transition-colors duration-300`}>
                                    {item.label}
                                </span>
                                {item.children && (
                                    <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-black/50 transition-colors duration-300" strokeWidth={1} />
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Bottom accent */}
                <div className="px-6 md:px-8 py-8 border-t-[0.5px] border-neutral-100">
                    <span className="font-display text-xs tracking-[0.4em] uppercase text-black/25">Indumentaria & Confecciones</span>
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
