import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getClienteById, getPedidos } from '@/services/api';

export default function ClienteHistoria() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCliente();
    }, [id]);

    const fetchCliente = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session.access_token;

            const [clienteData, pedidosData] = await Promise.all([
                getClienteById(id, token),
                getPedidos(token),
            ]);

            setCliente(clienteData);
            setPedidos(pedidosData.filter((p) => p.cliente_id === parseInt(id)));
        } catch {
            toast.error('Error al cargar datos del cliente');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatCurrency = (val) => {
        if (!val) return '$0';
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
    };

    const ESTADO_COLORS = {
        recibido: 'bg-blue-100 text-blue-800',
        en_proceso: 'bg-stone-100 text-stone-700',
        en_prueba: 'bg-purple-100 text-purple-800',
        terminado: 'bg-green-100 text-green-800',
        entregado: 'bg-stone-100 text-stone-800',
        cancelado: 'bg-red-100 text-red-800',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!cliente) return null;

    return (
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/admin/clientes')} className="p-2 rounded-lg hover:bg-stone-200 transition-colors">
                    <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-stone-800">{cliente.apellido}, {cliente.nombre}</h2>
                    <p className="text-sm text-stone-500">Historia Clínica</p>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-stone-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {cliente.telefono && (
                        <div>
                            <p className="text-stone-500 text-xs">Teléfono</p>
                            <p className="font-medium text-stone-800">{cliente.telefono}</p>
                        </div>
                    )}
                    {cliente.email && (
                        <div>
                            <p className="text-stone-500 text-xs">Email</p>
                            <p className="font-medium text-stone-800">{cliente.email}</p>
                        </div>
                    )}
                    {cliente.preferencias_estilo && (
                        <div className="col-span-2">
                            <p className="text-stone-500 text-xs">Preferencias de estilo</p>
                            <p className="text-stone-700">{cliente.preferencias_estilo}</p>
                        </div>
                    )}
                    {cliente.notas_fisonomia && (
                        <div className="col-span-2">
                            <p className="text-stone-500 text-xs">Notas de fisonomía</p>
                            <p className="text-stone-700">{cliente.notas_fisonomia}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pedidos del cliente */}
            {pedidos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-200 bg-stone-50">
                        <h3 className="text-sm font-heading text-stone-700">Pedidos ({pedidos.length})</h3>
                    </div>
                    <div className="divide-y divide-stone-100">
                        {pedidos.map((p) => (
                            <Link
                                key={p.id}
                                to={`/admin/pedidos/${p.id}`}
                                className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium text-stone-700">#{p.id}</p>
                                    <p className="text-xs text-stone-500">{formatDate(p.created_at)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLORS[p.estado_global] || 'bg-stone-100 text-stone-600'}`}>
                                        {p.estado_global?.replace('_', ' ')}
                                    </span>
                                    <span className="text-sm font-medium text-stone-800">{formatCurrency(p.total_presupuestado)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
