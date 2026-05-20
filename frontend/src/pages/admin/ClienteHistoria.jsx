import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getClienteById, getHistorialMedidas, getPedidos, addMedidas } from '@/services/api';

const MEDIDAS_LABELS = {
    busto: 'Busto',
    cintura: 'Cintura',
    cadera: 'Cadera',
    talle_espalda: 'Talle Espalda',
    talle_delantero: 'Talle Delantero',
    largo_manga: 'Largo Manga',
    largo_pantalon: 'Largo Pantalón',
    contorno_brazo: 'Contorno Brazo',
    contorno_muneca: 'Contorno Muñeca',
    ancho_espalda: 'Ancho Espalda',
    largo_falda: 'Largo Falda',
    largo_total: 'Largo Total',
};

export default function ClienteHistoria() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [historial, setHistorial] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddMedidas, setShowAddMedidas] = useState(false);
    const [saving, setSaving] = useState(false);
    const [nuevasMedidas, setNuevasMedidas] = useState({});
    const [notasMedida, setNotasMedida] = useState('');
    const [tomadaPor, setTomadaPor] = useState('');

    useEffect(() => {
        fetchCliente();
    }, [id]);

    const fetchCliente = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session.access_token;

            const [clienteData, medidasData, pedidosData] = await Promise.all([
                getClienteById(id, token),
                getHistorialMedidas(id, token).catch(() => null),
                getPedidos(token),
            ]);

            setCliente(clienteData);
            setHistorial(medidasData);
            setPedidos(pedidosData.filter((p) => p.cliente_id === parseInt(id)));
        } catch {
            toast.error('Error al cargar datos del cliente');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMedidas = async () => {
        const medidasLimpias = {};
        for (const [k, v] of Object.entries(nuevasMedidas)) {
            if (v) medidasLimpias[k] = v;
        }
        if (Object.keys(medidasLimpias).length === 0) {
            toast.error('Ingrese al menos una medida');
            return;
        }
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await addMedidas(id, {
                medidas: medidasLimpias,
                notas_medida: notasMedida || null,
                tomada_por: tomadaPor || null,
            }, session.access_token);
            toast.success('Medidas guardadas correctamente');
            setShowAddMedidas(false);
            setNuevasMedidas({});
            setNotasMedida('');
            setTomadaPor('');
            fetchCliente();
        } catch {
            toast.error('Error al guardar medidas');
        } finally {
            setSaving(false);
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
        en_proceso: 'bg-amber-100 text-amber-800',
        en_prueba: 'bg-purple-100 text-purple-800',
        terminado: 'bg-green-100 text-green-800',
        entregado: 'bg-stone-100 text-stone-800',
        cancelado: 'bg-red-100 text-red-800',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
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

            {/* Historial de Medidas */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
                    <h3 className="text-sm font-heading text-stone-700">Evolución de Medidas</h3>
                    <button
                        onClick={() => setShowAddMedidas(!showAddMedidas)}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                        {showAddMedidas ? 'Cancelar' : '+ Nueva toma'}
                    </button>
                </div>

                {/* Formulario nueva toma */}
                {showAddMedidas && (
                    <div className="p-4 border-b border-stone-200 bg-amber-50/50">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                            {Object.entries(MEDIDAS_LABELS).map(([key, label]) => (
                                <div key={key}>
                                    <label className="block text-xs text-stone-500 mb-0.5">{label}</label>
                                    <input
                                        type="text"
                                        placeholder="cm"
                                        value={nuevasMedidas[key] || ''}
                                        onChange={(e) => setNuevasMedidas({ ...nuevasMedidas, [key]: e.target.value })}
                                        className="w-full px-2 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            <div>
                                <label className="block text-xs text-stone-500 mb-0.5">Notas</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Ajuste post prueba"
                                    value={notasMedida}
                                    onChange={(e) => setNotasMedida(e.target.value)}
                                    className="w-full px-2 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-stone-500 mb-0.5">Tomada por</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={tomadaPor}
                                    onChange={(e) => setTomadaPor(e.target.value)}
                                    className="w-full px-2 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAddMedidas}
                            disabled={saving}
                            className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {saving ? 'Guardando...' : 'Guardar Medidas'}
                        </button>
                    </div>
                )}

                {/* Lista de historial */}
                <div className="divide-y divide-stone-100">
                    {historial ? (
                        historial.historial_completo.map((registro, idx) => {
                            const medidas = registro.medidas_json || {};
                            return (
                                <div key={registro.id} className={`p-4 ${idx === 0 ? 'bg-amber-50/30' : ''}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-stone-800">
                                                {formatDate(registro.fecha_toma || registro.created_at)}
                                            </span>
                                            {idx === 0 && (
                                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">Más reciente</span>
                                            )}
                                        </div>
                                        {registro.tomada_por && (
                                            <span className="text-xs text-stone-500">Por: {registro.tomada_por}</span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                                        {Object.entries(medidas).map(([key, val]) => (
                                            <div key={key} className="flex justify-between text-xs">
                                                <span className="text-stone-500">{MEDIDAS_LABELS[key] || key}</span>
                                                <span className="font-medium text-stone-800">{val} cm</span>
                                            </div>
                                        ))}
                                    </div>
                                    {registro.notas_medida && (
                                        <p className="text-xs text-stone-500 mt-2 italic">{registro.notas_medida}</p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-stone-400 text-sm">
                            Sin registros de medidas
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
                                    <p className="text-sm font-medium text-amber-600">#{p.id}</p>
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
