import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout() {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Estado para el menú en mobile
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                if (!session) {
                    navigate('/login');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Error al cerrar sesión');
        } else {
            toast.success('Sesión cerrada correctamente');
            navigate('/login');
        }
    };

    // Cerrar menú mobile al cambiar de ruta
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [navigate]);

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: 'home' },
        { to: '/admin/pedidos', label: 'Pedidos', icon: 'clipboard' },
        { to: '/admin/clientes', label: 'Clientes', icon: 'users' },
        { to: '/admin/productos', label: 'Productos', icon: 'box' },
    ];

    const getIcon = (icon) => {
        switch (icon) {
            case 'home':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                );
            case 'box':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            case 'clipboard':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                );
            case 'users':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex">
            
            {/* Overlay para mobile cuando el sidebar está abierto */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar (Responsivo: Oculto en mobile por defecto, visible en desktop) */}
            <aside 
                className={`fixed top-0 left-0 z-40 h-full bg-stone-800 transition-transform duration-300 ease-in-out transform 
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:relative 
                ${sidebarOpen ? 'w-64' : 'w-20'} shrink-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-stone-700">
                    {(sidebarOpen || mobileMenuOpen) && (
                        <span className="text-xl font-display text-white">V&A Admin</span>
                    )}
                    
                    {/* Botón para colapsar en Desktop */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden md:block p-2 rounded-lg text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Botón para cerrar en Mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden p-2 rounded-lg text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-2 overflow-y-auto h-[calc(100vh-140px)]">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                                    isActive
                                        ? 'bg-amber-600 text-white'
                                        : 'text-stone-400 hover:bg-stone-700 hover:text-white'
                                }`
                            }
                        >
                            {getIcon(item.icon)}
                            {(sidebarOpen || mobileMenuOpen) && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-700 bg-stone-800">
                    {(sidebarOpen || mobileMenuOpen) && user && (
                        <div className="mb-3">
                            <p className="text-sm text-stone-400">Conectado como:</p>
                            <p className="text-white text-sm truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-stone-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {(sidebarOpen || mobileMenuOpen) && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 transition-all duration-300 w-full flex flex-col">
                {/* Top Bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
                    
                    <div className="flex items-center gap-3">
                        {/* Botón Hamburguesa para Mobile */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg sm:text-xl font-heading text-stone-800 truncate">Panel de Administración</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-stone-600 hover:text-amber-600 transition-colors hidden sm:inline-block"
                        >
                            Ver sitio →
                        </a>
                        {/* Versión icono para mobile del botón 'Ver sitio' */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 hover:text-amber-600 transition-colors sm:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 sm:p-6 overflow-x-hidden flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}