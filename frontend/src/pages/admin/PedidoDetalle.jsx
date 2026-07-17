import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { USUARIOS_TALLER, usuarioById } from '@/constants/taller';
import {
    getPedidoById,
    cambiarEstadoItem as cambiarEstadoItemApi,
    updatePedido as updatePedidoApi,
    updateItem as updateItemApi,
    deletePedido as deletePedidoApi,
    deleteItem as deleteItemApi,
} from '@/services/api';

const ESTADO_COLORS = {
    recibido:  'bg-blue-100 text-blue-800',
    terminado: 'bg-green-100 text-green-800',
    entregado: 'bg-stone-100 text-stone-700',
    cancelado: 'bg-red-100 text-red-800',
};

const ESTADO_LABEL = {
    recibido: 'Recibido', terminado: 'Terminado', entregado: 'Entregado', cancelado: 'Cancelado',
};

const MEDIDAS_LABELS = {
    busto: 'Busto', cintura: 'Cintura', cadera: 'Cadera',
    talle_espalda: 'Talle Esp.', talle_delantero: 'Talle Del.',
    largo_manga: 'L. Manga', largo_pantalon: 'L. Pantalón',
    contorno_brazo: 'C. Brazo', contorno_muneca: 'C. Muñeca',
    ancho_espalda: 'A. Espalda', largo_falda: 'L. Falda', largo_total: 'L. Total',
};

const MEDIDAS_FIELDS = Object.entries(MEDIDAS_LABELS).map(([key, label]) => ({ key, label }));

const ITEM_ESTADO_COLORS = {
    pendiente:  'bg-stone-100 text-stone-700',
    en_proceso: 'bg-amber-100 text-amber-700',
    terminado:  'bg-green-100 text-green-800',
    entregado:  'bg-stone-200 text-stone-500',
};

const ITEM_ESTADO_LABEL = { pendiente: 'Pendiente', en_proceso: 'En Proceso', terminado: 'Terminado', entregado: 'Entregado' };

const TIPO_TRABAJO_OPTS = [
    { value: 'confeccion', label: 'Confección' },
    { value: 'arreglo', label: 'Arreglo' },
    { value: 'retrabajo', label: 'Re-trabajo' },
    { value: 'otro', label: 'Otro' },
];

function parseMedidas(raw) {
    if (!raw) return {};
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export default function PedidoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cambiandoEstado, setCambiandoEstado] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmDeletePedido, setConfirmDeletePedido] = useState(false);
    const [deletingPedido, setDeletingPedido] = useState(false);
    const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);
    const [deletingItemId, setDeletingItemId] = useState(null);

    useEffect(() => { fetchPedido(); }, [id]);

    const fetchPedido = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await getPedidoById(id, session.access_token);
            setPedido(data);
        } catch {
            toast.error('Error al cargar pedido');
            navigate('/admin/cronograma');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstadoItem = async (itemId, estado_nuevo) => {
        setCambiandoEstado(itemId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await cambiarEstadoItemApi(itemId, { estado_nuevo, comentario: `Cambio a ${estado_nuevo}` }, session.access_token);
            toast.success('Estado actualizado');
            fetchPedido();
        } catch (err) {
            toast.error(err.message || 'Error al cambiar estado');
        } finally {
            setCambiandoEstado(null);
        }
    };

    const handleStartEdit = () => {
        setEditData({
            fecha_entrega_prometida: pedido.fecha_entrega_prometida?.split('T')[0] ?? '',
            senia_pagada: pedido.senia_pagada ?? '',
            observaciones_generales: pedido.observaciones_generales ?? '',
            items: (pedido.items || []).map((item) => ({
                id: item.id,
                descripcion_prenda: item.descripcion_prenda,
                tipo_trabajo: item.tipo_trabajo ?? '',
                precio_item: item.precio_item ?? '',
                medidas_json: parseMedidas(item.medidas_json),
                asignado_a: item.asignado_a ?? null,
            })),
        });
        setEditMode(true);
    };

    const handleCancelEdit = () => { setEditMode(false); setEditData(null); };

    const updateEditItem = (idx, field, value) =>
        setEditData((prev) => {
            const items = [...prev.items];
            items[idx] = { ...items[idx], [field]: value };
            return { ...prev, items };
        });

    const updateEditMedida = (idx, key, value) =>
        setEditData((prev) => {
            const items = [...prev.items];
            items[idx] = { ...items[idx], medidas_json: { ...items[idx].medidas_json, [key]: value } };
            return { ...prev, items };
        });

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await updatePedidoApi(id, {
                fecha_entrega_prometida: editData.fecha_entrega_prometida || null,
                senia_pagada: parseFloat(editData.senia_pagada) || 0,
                observaciones_generales: editData.observaciones_generales || null,
            }, session.access_token);

            let latestTotal = null;
            for (const item of editData.items) {
                const orig = pedido.items.find((i) => i.id === item.id);
                const origMj = parseMedidas(orig?.medidas_json);
                const changed =
                    item.descripcion_prenda !== orig?.descripcion_prenda ||
                    item.tipo_trabajo !== (orig?.tipo_trabajo ?? '') ||
                    String(item.precio_item) !== String(orig?.precio_item ?? '') ||
                    JSON.stringify(item.medidas_json) !== JSON.stringify(origMj) ||
                    item.asignado_a !== (orig?.asignado_a ?? null);
                if (changed) {
                    const res = await updateItemApi(id, item.id, {
                        descripcion_prenda: item.descripcion_prenda,
                        tipo_trabajo: item.tipo_trabajo || null,
                        precio_item: parseFloat(item.precio_item) || 0,
                        medidas_json: item.tipo_trabajo === 'confeccion' ? item.medidas_json : null,
                        asignado_a: item.asignado_a,
                    }, session.access_token);
                    if (res?.nuevo_total !== undefined) latestTotal = res.nuevo_total;
                }
            }
            toast.success('Pedido actualizado');
            setEditMode(false);
            setEditData(null);
            if (latestTotal !== null) {
                setPedido((prev) => ({ ...prev, total_presupuestado: latestTotal }));
            }
            fetchPedido();
        } catch (err) {
            toast.error(err.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePedido = async () => {
        setDeletingPedido(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await deletePedidoApi(id, session.access_token);
            toast.success(`Pedido #${id} eliminado`);
            navigate('/admin/cronograma');
        } catch (err) {
            toast.error(err.message || 'Error al eliminar pedido');
            setDeletingPedido(false);
            setConfirmDeletePedido(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        setDeletingItemId(itemId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const result = await deleteItemApi(id, itemId, session.access_token);
            if (result.pedido_eliminado) {
                toast.success('Última prenda eliminada — pedido eliminado automáticamente.');
                navigate('/admin/cronograma');
            } else {
                toast.success('Prenda eliminada');
                setConfirmDeleteItemId(null);
                fetchPedido();
            }
        } catch (err) {
            toast.error(err.message || 'Error al eliminar prenda');
            setDeletingItemId(null);
        }
    };

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatCurrency = (v) => {
        if (!v) return '$0';
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!pedido) return null;

    const estadoKey = pedido.estado_global?.toLowerCase();

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => location.key !== 'default' ? navigate(-1) : navigate('/admin/cronograma')} className="p-2 rounded-lg hover:bg-stone-200 transition-colors shrink-0">
                        <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Pedido #{pedido.id}</h2>
                        <p className="text-sm text-stone-500">{pedido.cliente_nombre}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-11 sm:pl-0">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${ESTADO_COLORS[estadoKey] || 'bg-stone-100 text-stone-600'}`}>
                        {ESTADO_LABEL[estadoKey] || pedido.estado_global}
                    </span>

                    {!editMode && (
                        <>
                            <button
                                onClick={handleStartEdit}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                            {confirmDeletePedido ? (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-stone-500">¿Eliminar pedido?</span>
                                    <button onClick={handleDeletePedido} disabled={deletingPedido} className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                                        {deletingPedido ? '…' : 'Sí, eliminar'}
                                    </button>
                                    <button onClick={() => setConfirmDeletePedido(false)} className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium transition-colors">
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmDeletePedido(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors border border-red-200"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            )}
                        </>
                    )}

                    {editMode && (
                        <>
                            <button onClick={handleSaveEdit} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                                {saving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {saving ? 'Guardando…' : 'Guardar cambios'}
                            </button>
                            <button onClick={handleCancelEdit} disabled={saving} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium transition-colors">
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Info Grid — view mode */}
            {!editMode && (
                <>
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
                            <p className="text-sm font-medium text-stone-700">{formatCurrency(pedido.senia_pagada)}</p>
                        </div>
                    </div>
                    {pedido.observaciones_generales && (
                        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                            <p className="text-xs text-stone-500 font-medium mb-1">Observaciones</p>
                            <p className="text-sm text-stone-700">{pedido.observaciones_generales}</p>
                        </div>
                    )}
                </>
            )}

            {/* Edit panel */}
            {editMode && editData && (
                <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
                    <h3 className="text-sm font-heading text-stone-700">Datos del pedido</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-stone-500 mb-1">Entrega prometida</label>
                            <input
                                type="date"
                                value={editData.fecha_entrega_prometida}
                                onChange={(e) => setEditData((p) => ({ ...p, fecha_entrega_prometida: e.target.value }))}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-stone-500 mb-1">Seña pagada ($)</label>
                            <input
                                type="number"
                                value={editData.senia_pagada}
                                onChange={(e) => setEditData((p) => ({ ...p, senia_pagada: e.target.value }))}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-stone-500 mb-1">Observaciones generales</label>
                        <textarea
                            rows={2}
                            value={editData.observaciones_generales}
                            onChange={(e) => setEditData((p) => ({ ...p, observaciones_generales: e.target.value }))}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none resize-none"
                        />
                    </div>
                </div>
            )}

            {/* Items section */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-200 bg-stone-50">
                    <h3 className="text-sm font-heading text-stone-700">
                        Prendas ({editMode ? editData?.items?.length : pedido.items?.length || 0})
                    </h3>
                </div>

                {/* VIEW MODE */}
                {!editMode && (
                    <div className="divide-y divide-stone-100">
                        {pedido.items?.map((item) => {
                            const eKey = item.estado_item?.toLowerCase() || 'pendiente';
                            const isConfirm = confirmDeleteItemId === item.id;
                            const isDeletingThis = deletingItemId === item.id;
                            return (
                                <div key={item.id} className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-800 truncate">{item.descripcion_prenda}</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ITEM_ESTADO_COLORS[eKey] || 'bg-stone-100 text-stone-600'}`}>
                                                    {ITEM_ESTADO_LABEL[eKey] || item.estado_item}
                                                </span>
                                                {item.tipo_trabajo && <span className="px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-600">{item.tipo_trabajo}</span>}
                                                {item.trae_tela && <span className="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700">Trae tela</span>}
                                                {(() => { const u = usuarioById(item.asignado_a); return u ? <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${u.color}`}>{u.iniciales}</span> : null; })()}
                                            </div>
                                            {item.notas_especificas && <p className="text-xs text-stone-500 mt-1">{item.notas_especificas}</p>}
                                            {(() => {
                                                const mj = parseMedidas(item.medidas_json);
                                                if (!mj || Object.keys(mj).length === 0) return null;
                                                return (
                                                    <div className="mt-2 pt-2 border-t border-stone-100">
                                                        <p className="text-xs text-stone-500 mb-1 font-medium">Medidas</p>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                                            {Object.entries(mj).filter(([, v]) => v).map(([key, val]) => (
                                                                <span key={key} className="text-xs text-stone-700">
                                                                    {MEDIDAS_LABELS[key] || key}: <strong>{val}cm</strong>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-sm font-bold text-stone-800">{formatCurrency(item.precio_item)}</span>
                                            {cambiandoEstado === item.id ? (
                                                <div className="w-5 h-5 border-2 border-stone-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <select
                                                    value={item.estado_item || 'pendiente'}
                                                    onChange={(e) => cambiarEstadoItem(item.id, e.target.value)}
                                                    className="text-xs border border-stone-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-stone-400 outline-none"
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="en_proceso">En Proceso</option>
                                                    <option value="terminado">Terminado</option>
                                                </select>
                                            )}
                                            {isConfirm ? (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleDeleteItem(item.id)} disabled={isDeletingThis} className="px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold disabled:opacity-50">
                                                        {isDeletingThis ? '…' : 'Sí'}
                                                    </button>
                                                    <button onClick={() => setConfirmDeleteItemId(null)} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">No</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmDeleteItemId(item.id)}
                                                    disabled={!!cambiandoEstado || !!deletingItemId}
                                                    title="Eliminar prenda"
                                                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* EDIT MODE */}
                {editMode && editData && (
                    <div className="divide-y divide-stone-100">
                        {editData.items.map((item, idx) => (
                            <div key={item.id} className="p-4 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_9rem_8rem_10rem] gap-3">
                                    <div>
                                        <label className="block text-xs text-stone-500 mb-1">Descripción</label>
                                        <input
                                            type="text"
                                            value={item.descripcion_prenda}
                                            onChange={(e) => updateEditItem(idx, 'descripcion_prenda', e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-stone-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-stone-500 mb-1">Tipo</label>
                                        <select
                                            value={item.tipo_trabajo}
                                            onChange={(e) => updateEditItem(idx, 'tipo_trabajo', e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-1 focus:ring-stone-400 outline-none"
                                        >
                                            <option value="">—</option>
                                            {TIPO_TRABAJO_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-stone-500 mb-1">Precio ($)</label>
                                        <input
                                            type="number"
                                            value={item.precio_item}
                                            onChange={(e) => updateEditItem(idx, 'precio_item', e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-1 focus:ring-stone-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-stone-500 mb-1">Asignado a</label>
                                        <select
                                            value={item.asignado_a ?? ''}
                                            onChange={(e) => updateEditItem(idx, 'asignado_a', e.target.value || null)}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-1 focus:ring-stone-400 outline-none"
                                        >
                                            <option value="">Sin asignar</option>
                                            {USUARIOS_TALLER.map((u) => (
                                                <option key={u.id} value={u.id}>{u.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {item.tipo_trabajo === 'confeccion' && (
                                    <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
                                        <p className="text-xs font-medium text-stone-500 uppercase mb-2">Medidas</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {MEDIDAS_FIELDS.map((f) => (
                                                <div key={f.key}>
                                                    <label className="block text-xs text-stone-400 mb-0.5">{f.label}</label>
                                                    <input
                                                        type="text"
                                                        placeholder="cm"
                                                        value={item.medidas_json[f.key] || ''}
                                                        onChange={(e) => updateEditMedida(idx, f.key, e.target.value)}
                                                        className="w-full px-2 py-1.5 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-stone-400 outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sesiones de Prueba — view mode only */}
            {!editMode && pedido.sesiones_prueba?.length > 0 && (
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
