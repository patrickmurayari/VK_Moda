import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getPedidos } from '@/services/api';

const ESTADOS = [
    { value: '', label: 'Todos' },
    { value: 'recibido', label: 'Recibido' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'en_prueba', label: 'En Prueba' },
    { value: 'terminado', label: 'Terminado' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'cancelado', label: 'Cancelado' },
];

const ESTADO_COLORS = {
    recibido: 'bg-blue-100 text-blue-800',
    en_proceso: 'bg-stone-100 text-stone-700',
    en_prueba: 'bg-purple-100 text-purple-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-stone-100 text-stone-800',
    cancelado: 'bg-red-100 text-red-800',
};

export default function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await getPedidos(session.access_token);
            setPedidos(data);
        } catch (err) {
            toast.error('Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const pedidosFiltrados = pedidos.filter((p) => {
        const matchEstado = !filtroEstado || p.estado_global === filtroEstado;
        const matchBusqueda = !busqueda ||
            (p.cliente_nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
            String(p.id).includes(busqueda);
        return matchEstado && matchBusqueda;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatCurrency = (val) => {
        if (!val) return '$0';
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Gestión de Pedidos</h2>
                <Link
                    to="/admin/pedidos/nuevo"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium active:scale-[0.98]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Pedido
                </Link>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por cliente o #pedido..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none"
                    />
                </div>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2.5 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none"
                >
                    {ESTADOS.map((e) => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                </select>
            </div>

            {/* Lista de pedidos - Cards en mobile, tabla en desktop */}
            <div className="space-y-3 sm:hidden">
                {pedidosFiltrados.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm">No se encontraron pedidos</p>
                    </div>
                ) : (
                    pedidosFiltrados.map((p) => (
                        <Link
                            key={p.id}
                            to={`/admin/pedidos/${p.id}`}
                            className="block bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md transition-shadow active:scale-[0.99]"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-medium text-stone-800">#{p.id}</p>
                                    <p className="text-sm text-stone-600">{p.cliente_nombre || 'Sin cliente'}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLORS[p.estado_global] || 'bg-stone-100 text-stone-600'}`}>
                                    {p.estado_global?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-stone-500">
                                <span>{formatDate(p.fecha_entrega_prometida)}</span>
                                <span className="font-medium text-stone-800">{formatCurrency(p.total_presupuestado)}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Tabla en desktop */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">#</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Cliente</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Estado</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Entrega</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-stone-500 uppercase">Total</th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-stone-500 uppercase">Seña</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {pedidosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-stone-400">
                                        No se encontraron pedidos
                                    </td>
                                </tr>
                            ) : (
                                pedidosFiltrados.map((p) => (
                                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link to={`/admin/pedidos/${p.id}`} className="text-stone-700 hover:text-stone-900 font-medium">
                                                #{p.id}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-stone-700">{p.cliente_nombre || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLORS[p.estado_global] || 'bg-stone-100 text-stone-600'}`}>
                                                {p.estado_global?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-stone-600">{formatDate(p.fecha_entrega_prometida)}</td>
                                        <td className="px-4 py-3 text-sm text-stone-800 font-medium text-right">{formatCurrency(p.total_presupuestado)}</td>
                                        <td className="px-4 py-3 text-sm text-stone-600 text-right">{formatCurrency(p.senia_pagada)}</td>
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
