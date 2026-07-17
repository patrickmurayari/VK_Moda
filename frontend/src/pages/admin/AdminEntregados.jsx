import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getPedidosEntregados } from '@/services/api';
import { Search } from 'lucide-react';

const TIPO_TRABAJO_LABEL = {
    confeccion: 'Confección',
    arreglo:    'Arreglo',
    retrabajo:  'Re-trabajo',
    otro:       'Otro',
};

function buildDescripcion(items) {
    if (!items || items.length === 0) return '—';
    return items
        .map((i) => `${i.descripcion_prenda} (${TIPO_TRABAJO_LABEL[i.tipo_trabajo?.toLowerCase()] || i.tipo_trabajo})`)
        .join(' / ');
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(val) {
    if (!val) return '$0';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
}

export default function AdminEntregados() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    const pedidosFiltrados = useMemo(() => {
        const term = busqueda.replace('#', '').trim().toLowerCase();
        if (!term) return pedidos;
        return pedidos.filter((p) =>
            String(p.id).includes(term) ||
            p.cliente_nombre?.toLowerCase().includes(term)
        );
    }, [pedidos, busqueda]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const data = await getPedidosEntregados(session.access_token);
                setPedidos(data);
            } catch (err) {
                toast.error(err.message || 'Error al cargar historial de entregas');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Historial de Entregados</h2>
                    <p className="text-sm text-stone-500 mt-0.5">
                        {loading ? 'Cargando…' : `${pedidosFiltrados.length}${busqueda ? ` de ${pedidos.length}` : ''} pedido${pedidos.length !== 1 ? 's' : ''} entregado${pedidos.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                {!loading && pedidos.length > 0 && (
                    <div className="bg-stone-100 border border-stone-200 rounded-xl px-4 py-2 text-center">
                        <p className="text-xl font-bold text-stone-600">{pedidos.length}</p>
                        <p className="text-xs text-stone-500">Total</p>
                    </div>
                )}
            </div>

            {!loading && pedidos.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por cliente o #pedido..."
                        className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 placeholder:text-stone-400 bg-white focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors"
                    />
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {!loading && pedidos.length > 0 && pedidosFiltrados.length === 0 && (
                <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
                    <Search className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-400 text-sm">No se encontraron pedidos para esta búsqueda.</p>
                </div>
            )}

            {!loading && pedidos.length === 0 && (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                    <svg className="w-10 h-10 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <p className="text-stone-400 text-sm">Sin pedidos entregados aún</p>
                </div>
            )}

            {!loading && pedidosFiltrados.length > 0 && (
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                    <div className="hidden sm:grid grid-cols-[3rem_1fr_2.5fr_9rem_8rem] gap-4 px-4 py-2 border-b border-stone-200 bg-stone-50">
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">#</span>
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Cliente</span>
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Prendas</span>
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Fecha entrega</span>
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total</span>
                    </div>
                    <div className="divide-y divide-stone-100">
                        {pedidosFiltrados.map((p) => (
                            <Link
                                key={p.id}
                                to={`/admin/pedidos/${p.id}`}
                                className="flex flex-col sm:grid sm:grid-cols-[3rem_1fr_2.5fr_9rem_8rem] sm:items-center gap-1 sm:gap-4 px-4 py-3 hover:bg-stone-50 transition-colors"
                            >
                                <span className="text-xs font-mono font-semibold text-stone-400">#{p.id}</span>
                                <span className="text-sm font-medium text-stone-700 truncate">{p.cliente_nombre.trim() || '—'}</span>
                                <span className="text-xs text-stone-500 line-clamp-2">{buildDescripcion(p.items)}</span>
                                <span className="text-xs text-stone-500">{formatDate(p.fecha_entrega_prometida)}</span>
                                <span className="text-xs font-semibold text-stone-700">{formatCurrency(p.total_presupuestado)}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
