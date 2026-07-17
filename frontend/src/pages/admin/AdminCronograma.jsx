import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getCronogramaEntregas, cambiarEstadoItem as apiCambiarEstadoItem, updateItem as apiUpdateItem } from '@/services/api';
import { USUARIOS_TALLER, usuarioById } from '@/constants/taller';

const ESTADO_BADGE = {
    recibido:   'bg-blue-100 text-blue-800',
    en_proceso: 'bg-amber-100 text-amber-800',
    en_prueba:  'bg-purple-100 text-purple-800',
    terminado:  'bg-green-100 text-green-800',
    entregado:  'bg-stone-200 text-stone-700',
    cancelado:  'bg-red-100 text-red-700',
};

const ESTADO_LABEL = {
    recibido:   'Recibido',
    en_proceso: 'En Proceso',
    en_prueba:  'En Prueba',
    terminado:  'Listo',
    entregado:  'Entregado',
    cancelado:  'Cancelado',
};

const TIPO_TRABAJO_LABEL = {
    confeccion: 'Confección',
    arreglo:    'Arreglo',
    retrabajo:  'Re-trabajo',
    otro:       'Otro',
};

const ESTADO_ITEM_BADGE = {
    pendiente:      'bg-stone-100 text-stone-600',
    en_proceso:     'bg-amber-100 text-amber-700',
    en_confeccion:  'bg-amber-100 text-amber-700',
    terminado:      'bg-green-100 text-green-700',
    entregado:      'bg-stone-200 text-stone-500',
};

const ESTADO_ITEM_LABEL = {
    pendiente:      'Pendiente',
    en_proceso:     'En Proceso',
    en_confeccion:  'En Confección',
    terminado:      'Terminado',
    entregado:      'Entregado',
};

const ITEM_ESTADOS = ['pendiente', 'en_proceso', 'terminado'];

function getLocalToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekRange() {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
}

function formatDateHeader(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const today = getLocalToday();
    const isToday = dateStr === today;
    const label = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
    return { label: capitalized, isToday };
}

function isPast(dateStr) {
    return dateStr < getLocalToday();
}

function PedidoCard({ p, updatingItem, asignandoItemId, updatingAsignacion, setAsignandoItemId, handleCambiarEstadoItem, handleAsignar }) {
    const [mostrarTodo, setMostrarTodo] = useState(false);
    const items = p.items || [];
    const visible = mostrarTodo || items.length <= 2 ? items : items.slice(0, 2);
    const ocultas = items.length - 2;

    return (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            {/* Cabecera del pedido */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 bg-stone-50/80">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-semibold text-stone-400 shrink-0">#{p.id}</span>
                    <span className="text-sm font-medium text-stone-800 truncate">{p.cliente_nombre.trim() || '—'}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[p.estado_global?.toLowerCase()] || 'bg-stone-100 text-stone-600'}`}>
                        {ESTADO_LABEL[p.estado_global?.toLowerCase()] || p.estado_global}
                    </span>
                    <Link to={`/admin/pedidos/${p.id}`} className="text-xs text-stone-500 hover:text-stone-800 transition-colors font-medium">
                        Ver →
                    </Link>
                </div>
            </div>

            {/* Prendas */}
            <div className="divide-y divide-stone-50">
                {visible.map((item) => {
                    const estadoKey = item.estado_item?.toLowerCase() || 'pendiente';
                    const isUpdating = updatingItem === item.id;
                    const isDone = estadoKey === 'terminado' || estadoKey === 'entregado';
                    const asignado = usuarioById(item.asignado_a);
                    const isAssigning = asignandoItemId === item.id;
                    const isUpdatingAsig = updatingAsignacion === item.id;
                    return (
                        <div key={item.id} className="flex items-start justify-between gap-3 px-4 py-2.5">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-stone-700 break-words">{item.descripcion_prenda}</p>
                                <p className="text-xs text-stone-400">{TIPO_TRABAJO_LABEL[item.tipo_trabajo?.toLowerCase()] || item.tipo_trabajo}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2 shrink-0">
                                {/* Estado controls */}
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_ITEM_BADGE[estadoKey] || 'bg-stone-100 text-stone-600'}`}>
                                        {ESTADO_ITEM_LABEL[estadoKey] || item.estado_item}
                                    </span>
                                    <select
                                        value={estadoKey}
                                        disabled={isUpdating || isDone}
                                        onChange={(e) => handleCambiarEstadoItem(p.id, item.id, e.target.value)}
                                        className="text-xs border border-stone-300 rounded-md px-2 py-1 bg-white text-stone-700 focus:ring-1 focus:ring-stone-400 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {ITEM_ESTADOS.map((s) => (
                                            <option key={s} value={s}>{ESTADO_ITEM_LABEL[s]}</option>
                                        ))}
                                    </select>
                                    {isUpdating && <div className="w-3.5 h-3.5 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />}
                                </div>

                                {/* Assignment widget */}
                                {isUpdatingAsig ? (
                                    <div className="w-7 h-7 flex items-center justify-center">
                                        <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : isAssigning ? (
                                    <div className="flex items-center gap-1">
                                        {USUARIOS_TALLER.map((u) => (
                                            <button
                                                key={u.id}
                                                onClick={() => handleAsignar(p.id, item.id, u.id)}
                                                title={u.nombre}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-opacity hover:opacity-80 ${u.color}`}
                                            >
                                                {u.iniciales}
                                            </button>
                                        ))}
                                        {asignado && (
                                            <button
                                                onClick={() => handleAsignar(p.id, item.id, null)}
                                                title="Quitar asignación"
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs border border-stone-300 bg-stone-50 text-stone-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setAsignandoItemId(null)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs border border-stone-200 bg-stone-100 text-stone-400 hover:bg-stone-200 transition-colors"
                                        >
                                            ‹
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAsignandoItemId(item.id)}
                                        title={asignado ? `Asignado: ${asignado.nombre}` : 'Asignar responsable'}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                            asignado
                                                ? `${asignado.color} hover:opacity-80`
                                                : 'bg-stone-50 border-stone-200 text-stone-300 hover:border-stone-400 hover:text-stone-500'
                                        }`}
                                    >
                                        {asignado ? asignado.iniciales : '+'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Toggle collapse */}
            {items.length > 2 && (
                <button
                    onClick={() => setMostrarTodo((v) => !v)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-stone-100 text-xs font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
                >
                    {mostrarTodo ? (
                        <><ChevronUp className="w-3.5 h-3.5" /> Ver menos</>
                    ) : (
                        <><ChevronDown className="w-3.5 h-3.5" /> Ver las demás prendas (+{ocultas})</>
                    )}
                </button>
            )}
        </div>
    );
}

export default function AdminCronograma() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('semana');
    const [filtroResponsable, setFiltroResponsable] = useState('todos');
    const [updatingItem, setUpdatingItem] = useState(null);
    const [asignandoItemId, setAsignandoItemId] = useState(null);
    const [updatingAsignacion, setUpdatingAsignacion] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await getCronogramaEntregas(session.access_token);
            setPedidos(data);
        } catch (err) {
            toast.error(err.message || 'Error al cargar el cronograma');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCambiarEstadoItem = async (pedidoId, itemId, nuevoEstado) => {
        if (updatingItem) return;
        setUpdatingItem(itemId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const result = await apiCambiarEstadoItem(itemId, { estado_nuevo: nuevoEstado }, session.access_token);
            if (result.pedido_transicionado) {
                setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
                toast.success('¡Todas las prendas listas! El pedido pasó a "Terminado".');
            } else {
                setPedidos((prev) => prev.map((p) => {
                    if (p.id !== pedidoId) return p;
                    return { ...p, items: p.items.map((it) => it.id === itemId ? { ...it, estado_item: nuevoEstado } : it) };
                }));
                toast.success('Estado actualizado');
            }
        } catch (err) {
            toast.error(err.message || 'Error al actualizar estado');
        } finally {
            setUpdatingItem(null);
        }
    };

    const handleAsignar = async (pedidoId, itemId, userId) => {
        setAsignandoItemId(null);
        setUpdatingAsignacion(itemId);
        setPedidos((prev) => prev.map((p) => {
            if (p.id !== pedidoId) return p;
            return { ...p, items: p.items.map((it) => it.id === itemId ? { ...it, asignado_a: userId } : it) };
        }));
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await apiUpdateItem(pedidoId, itemId, { asignado_a: userId }, session.access_token);
        } catch (err) {
            toast.error(err.message || 'Error al asignar');
            setPedidos((prev) => prev.map((p) => {
                if (p.id !== pedidoId) return p;
                return { ...p, items: p.items.map((it) => it.id === itemId ? { ...it, asignado_a: it._asignado_a_prev } : it) };
            }));
        } finally {
            setUpdatingAsignacion(null);
        }
    };

    const filtered = useMemo(() => {
        const today = getLocalToday();
        let result = pedidos;

        if (filtro === 'hoy') {
            result = result.filter((p) => p.fecha_entrega_prometida?.startsWith(today));
        } else if (filtro === 'semana') {
            const { monday, sunday } = getWeekRange();
            result = result.filter((p) => {
                if (!p.fecha_entrega_prometida) return false;
                const [y, m, d] = p.fecha_entrega_prometida.split('T')[0].split('-').map(Number);
                const date = new Date(y, m - 1, d);
                return date >= monday && date <= sunday;
            });
        }

        if (filtroResponsable !== 'todos') {
            result = result.filter((p) =>
                (p.items || []).some((it) => it.asignado_a === filtroResponsable)
            );
        }

        return result;
    }, [pedidos, filtro, filtroResponsable]);

    const grouped = useMemo(() => {
        const map = {};
        for (const p of filtered) {
            const key = p.fecha_entrega_prometida?.split('T')[0];
            if (!key) continue;
            if (!map[key]) map[key] = [];
            map[key].push(p);
        }
        return map;
    }, [filtered]);

    const sortedDates = Object.keys(grouped).sort();

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Cronograma de Entregas</h2>
                    <p className="text-sm text-stone-500 mt-0.5">
                        {loading ? 'Cargando…' : `${filtered.length} pedido${filtered.length !== 1 ? 's' : ''} activo${filtered.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    {/* Filtro de fecha */}
                    <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                        {[
                            { key: 'hoy', label: 'Para Hoy' },
                            { key: 'semana', label: 'Esta Semana' },
                            { key: 'todo', label: 'Ver Todo' },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFiltro(f.key)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    filtro === f.key
                                        ? 'bg-white text-stone-800 shadow-sm'
                                        : 'text-stone-500 hover:text-stone-700'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Filtro por responsable */}
                    <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                        <button
                            onClick={() => setFiltroResponsable('todos')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                filtroResponsable === 'todos'
                                    ? 'bg-white text-stone-800 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            Todos
                        </button>
                        {USUARIOS_TALLER.map((u) => (
                            <button
                                key={u.id}
                                onClick={() => setFiltroResponsable(filtroResponsable === u.id ? 'todos' : u.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
                                    filtroResponsable === u.id
                                        ? `${u.color} shadow-sm`
                                        : 'text-stone-500 border-transparent hover:text-stone-700'
                                }`}
                            >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${u.color}`}>
                                    {u.iniciales.charAt(0)}
                                </span>
                                {u.nombre.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty */}
            {!loading && sortedDates.length === 0 && (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                    <svg className="w-10 h-10 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-stone-400 text-sm">Sin entregas para este período</p>
                </div>
            )}

            {/* Cronograma vertical */}
            {!loading && sortedDates.map((dateKey) => {
                const { label, isToday } = formatDateHeader(dateKey);
                const overdue = isPast(dateKey) && !isToday;
                const rows = grouped[dateKey];

                return (
                    <div key={dateKey} className="space-y-2">
                        {/* Encabezado de fecha */}
                        <div className={`flex items-center gap-3 px-1`}>
                            <div className={`h-px flex-1 ${overdue ? 'bg-red-200' : isToday ? 'bg-amber-300' : 'bg-stone-200'}`} />
                            <span className={`text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full ${
                                isToday
                                    ? 'bg-amber-100 text-amber-800'
                                    : overdue
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-stone-100 text-stone-600'
                            }`}>
                                {isToday ? `Hoy · ${label}` : label}
                            </span>
                            <div className={`h-px flex-1 ${overdue ? 'bg-red-200' : isToday ? 'bg-amber-300' : 'bg-stone-200'}`} />
                        </div>

                        {/* Cards de pedidos con controles por prenda */}
                        <div className="space-y-2">
                            {rows.map((p) => (
                                <PedidoCard
                                    key={p.id}
                                    p={p}
                                    updatingItem={updatingItem}
                                    asignandoItemId={asignandoItemId}
                                    updatingAsignacion={updatingAsignacion}
                                    setAsignandoItemId={setAsignandoItemId}
                                    handleCambiarEstadoItem={handleCambiarEstadoItem}
                                    handleAsignar={handleAsignar}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
