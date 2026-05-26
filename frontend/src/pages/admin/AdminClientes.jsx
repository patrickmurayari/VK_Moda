import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getClientes, buscarClientes } from '@/services/api';

export default function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await getClientes(session.access_token);
            setClientes(data);
        } catch {
            toast.error('Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda rápida con debounce
    useEffect(() => {
        if (busqueda.trim().length < 2) {
            if (busqueda.trim().length === 0) fetchClientes();
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const data = await buscarClientes(busqueda, session.access_token);
                setClientes(data.resultados || []);
            } catch { /* ignore */ }
            setSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [busqueda]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Clientes</h2>
            </div>

            {/* Buscador */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none"
                />
                {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Cards mobile */}
            <div className="space-y-3 sm:hidden">
                {clientes.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                        <p className="text-sm">No se encontraron clientes</p>
                    </div>
                ) : (
                    clientes.map((c) => (
                        <Link
                            key={c.id}
                            to={`/admin/clientes/${c.id}`}
                            className="block bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md transition-shadow active:scale-[0.99]"
                        >
                            <p className="font-medium text-stone-800">{c.apellido}, {c.nombre}</p>
                            <div className="flex gap-3 mt-1 text-xs text-stone-500">
                                {c.telefono && <span>{c.telefono}</span>}
                                {c.email && <span>{c.email}</span>}
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Tabla desktop */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Nombre</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Teléfono</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-12 text-stone-400">No se encontraron clientes</td>
                                </tr>
                            ) : (
                                clientes.map((c) => (
                                    <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link to={`/admin/clientes/${c.id}`} className="text-stone-700 hover:text-stone-900 font-medium text-sm">
                                                {c.apellido}, {c.nombre}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-stone-600">{c.telefono || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-stone-600">{c.email || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
