import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading text-stone-800">
                    Bienvenido al Panel de Administración
                </h2>
                <p className="text-sm sm:text-base text-stone-500">
                    Gestiona productos, categorías y contenido del sitio
                </p>
            </div>

            {/* Quick Stats */}
            {/* Se ajusta la grilla: 1 col en mobile, 2 en sm, 3 en lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Link
                    to="/admin/productos"
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold text-stone-800">42</p>
                            <p className="text-stone-500 text-xs sm:text-sm">Productos</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/admin/categorias"
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a4 4 0 014 4v6a4 4 0 01-4 4H4a4 4 0 01-4-4V7a4 4 0 014-4h3m0 4a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold text-stone-800">5</p>
                            <p className="text-stone-500 text-xs sm:text-sm">Categorías</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/admin/contenido"
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold text-stone-800">16</p>
                            <p className="text-stone-500 text-xs sm:text-sm">Contenido</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-stone-200">
                <h3 className="text-base sm:text-lg font-heading text-stone-800 mb-4 sm:mb-6">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Link
                        to="/admin/productos/nuevo"
                        className="flex items-center gap-3 p-3 sm:p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors active:scale-[0.98]"
                    >
                        <div className="p-2 bg-white rounded shadow-sm">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm sm:text-base text-stone-700 font-medium">Agregar nuevo producto</span>
                    </Link>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 sm:p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors active:scale-[0.98]"
                    >
                        <div className="p-2 bg-white rounded shadow-sm">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <span className="text-sm sm:text-base text-stone-700 font-medium">Ver sitio público</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
