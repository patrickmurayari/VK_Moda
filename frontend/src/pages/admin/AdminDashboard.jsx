import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading text-stone-800">
                    Panel de Administración
                </h2>
                <p className="text-sm sm:text-base text-stone-500">
                    Gestiona pedidos, clientes y productos
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link
                    to="/admin/pedidos"
                    className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-stone-100 rounded-lg group-hover:bg-stone-200 transition-colors">
                            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-stone-500">Pedidos</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/admin/clientes"
                    className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-stone-500">Clientes</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/admin/productos"
                    className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-stone-500">Productos</p>
                        </div>
                    </div>
                </Link>

                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-stone-200 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-stone-500">Ver Sitio</p>
                        </div>
                    </div>
                </a>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-stone-200">
                <h3 className="text-base sm:text-lg font-heading text-stone-800 mb-4 sm:mb-6">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Link
                        to="/admin/pedidos/nuevo"
                        className="flex items-center gap-3 p-3 sm:p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors active:scale-[0.98]"
                    >
                        <div className="p-2 bg-white rounded shadow-sm">
                            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm sm:text-base text-stone-700 font-medium">Nuevo pedido</span>
                    </Link>
                    <Link
                        to="/admin/productos/nuevo"
                        className="flex items-center gap-3 p-3 sm:p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors active:scale-[0.98]"
                    >
                        <div className="p-2 bg-white rounded shadow-sm">
                            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-sm sm:text-base text-stone-700 font-medium">Agregar producto</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
