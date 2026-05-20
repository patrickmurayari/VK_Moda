import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getPedidoById, cambiarEstadoItem as cambiarEstadoItemApi } from '@/services/api';

const ESTADO_COLORS = {
    recibido: 'bg-blue-100 text-blue-800',
    en_proceso: 'bg-amber-100 text-amber-800',
    en_prueba: 'bg-purple-100 text-purple-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-stone-100 text-stone-800',
    cancelado: 'bg-red-100 text-red-800',
};

const ITEM_ESTADO_COLORS = {
    pendiente: 'bg-stone-100 text-stone-700',
    cortado: 'bg-sky-100 text-sky-800',
    en_confeccion: 'bg-amber-100 text-amber-800',
    en_prueba: 'bg-purple-100 text-purple-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-stone-200 text-stone-800',
};

export default function PedidoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cambiandoEstado, setCambiandoEstado] = useState(null);

    useEffect(() => {
        fetchPedido();
    }, [id]);

    const fetchPedido = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await getPedidoById(id, session.access_token);
            setPedido(data);
        } catch {
            toast.error('Error al cargar pedido');
            navigate('/admin/pedidos');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstadoItem = async (itemId, estado_nuevo) => {
        setCambiandoEstado(itemId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await cambiarEstadoItemApi(itemId, { estado_nuevo, comentario: `Cambio a ${estado_nuevo}` }, session.access_token);
            toast.success(`Estado actualizado a ${estado_nuevo.replace('_', ' ')}`);
            fetchPedido();
        } catch (err) {
            toast.error(err.message || 'Error al cambiar estado');
        } finally {
            setCambiandoEstado(null);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!pedido) return null;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/pedidos')} className="p-2 rounded-lg hover:bg-stone-200 transition-colors">
                        <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Pedido #{pedido.id}</h2>
                        <p className="text-sm text-stone-500">{pedido.cliente_nombre}</p>
                    </div>
                </div>
                <span className={`self-start px-3 py-1.5 rounded-full text-xs font-medium ${ESTADO_COLORS[pedido.estado_global] || 'bg-stone-100 text-stone-600'}`}>
                    {pedido.estado_global?.replace('_', ' ')}
                </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <p className="text-xs text-stone-500 mb-1">Fecha ingreso</p>
                    <p className="text-sm font-medium text-stone-800">{formatDate(pedido.fecha_ingreso)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <p className="text-xs text-stone-500 mb-1">Entrega prometida</p>
                    <p className="text-sm font-medium text-stone-800">{formatDate(pedido.fecha_entrega_prometida)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <p className="text-xs text-stone-500 mb-1">Total</p>
                    <p className="text-sm font-bold text-stone-800">{formatCurrency(pedido.total_presupuestado)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <p className="text-xs text-stone-500 mb-1">Seña pagada</p>
                    <p className="text-sm font-medium text-amber-700">{formatCurrency(pedido.senia_pagada)}</p>
                </div>
            </div>

            {pedido.observaciones_generales && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-600 font-medium mb-1">Observaciones</p>
                    <p className="text-sm text-amber-900">{pedido.observaciones_generales}</p>
                </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-200 bg-stone-50">
                    <h3 className="text-sm font-heading text-stone-700">Prendas ({pedido.items?.length || 0})</h3>
                </div>
                <div className="divide-y divide-stone-100">
                    {pedido.items?.map((item) => (
                        <div key={item.id} className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-stone-800 truncate">{item.descripcion_prenda}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ITEM_ESTADO_COLORS[item.estado_item] || 'bg-stone-100 text-stone-600'}`}>
                                            {item.estado_item?.replace('_', ' ')}
                                        </span>
                                        {item.tipo_trabajo && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-600">
                                                {item.tipo_trabajo}
                                            </span>
                                        )}
                                        {item.trae_tela && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700">Trae tela</span>
                                        )}
                                    </div>
                                    {item.notas_especificas && (
                                        <p className="text-xs text-stone-500 mt-1">{item.notas_especificas}</p>
                                    )}
                                    {(() => {
                                        const mj = item.medidas_json ? (typeof item.medidas_json === 'string' ? JSON.parse(item.medidas_json) : item.medidas_json) : null;
                                        if (!mj || Object.keys(mj).length === 0) return null;
                                        return (
                                            <div className="mt-2 pt-2 border-t border-stone-200">
                                                <p className="text-xs text-stone-500 mb-1 font-medium">Medidas</p>
                                                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                                    {Object.entries(mj).filter(([, v]) => v).map(([key, val]) => (
                                                        <span key={key} className="text-xs text-stone-700">
                                                            {key.replace(/_/g, ' ')}: <strong>{val}cm</strong>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-stone-800">{formatCurrency(item.precio_item)}</span>
                                    {cambiandoEstado === item.id ? (
                                        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <select
                                            value={item.estado_item}
                                            onChange={(e) => cambiarEstadoItem(item.id, e.target.value)}
                                            className="text-xs border border-stone-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-amber-500 outline-none"
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="cortado">Cortado</option>
                                            <option value="en_confeccion">En Confección</option>
                                            <option value="en_prueba">En Prueba</option>
                                            <option value="terminado">Terminado</option>
                                            <option value="entregado">Entregado</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sesiones de Prueba */}
            {pedido.sesiones_prueba?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-200 bg-stone-50">
                        <h3 className="text-sm font-heading text-stone-700">Sesiones de Prueba</h3>
                    </div>
                    <div className="divide-y divide-stone-100">
                        {pedido.sesiones_prueba.map((s) => (
                            <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <p className="text-sm text-stone-800">{s.descripcion_prenda || `Ítem #${s.item_id}`}</p>
                                    <p className="text-xs text-stone-500">
                                        {new Date(s.fecha_planificada).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {s.notas_resultado && <p className="text-xs text-stone-600 mt-1">{s.notas_resultado}</p>}
                                </div>
                                <span className={`self-start px-2 py-1 rounded-full text-xs font-medium ${
                                    s.estado_sesion === 'realizada' ? 'bg-green-100 text-green-800' :
                                    s.estado_sesion === 'cancelada' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {s.estado_sesion}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
