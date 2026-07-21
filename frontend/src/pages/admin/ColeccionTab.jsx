import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getHomeColeccionAdmin, updateHomeColeccionSlot, getProductos } from '@/services/api';
import { formatPrecio } from '@/utils/format';

// ── Shared primitives ────────────────────────────────────────────────────────

const Spinner = ({ className = 'w-4 h-4 border-2 border-current border-t-transparent' }) => (
    <div className={`${className} rounded-full animate-spin`} />
);

function ImgPlaceholder() {
    return (
        <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    );
}

// ── Product Selector Modal ───────────────────────────────────────────────────

function SelectorModal({ slot, allProductos, onSelect, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const filtered = allProductos.filter(p => {
        if (!query.trim()) return true;
        return p.nombre?.toLowerCase().includes(query.toLowerCase());
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[82vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 shrink-0">
                    <div>
                        <h3 className="font-semibold text-stone-800">Seleccionar Producto</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Slot #{slot.orden}</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pt-3 pb-2 shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full text-base sm:text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-600"
                    />
                    <p className="text-[11px] text-stone-400 mt-1.5 pl-0.5">
                        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Product list */}
                <div className="overflow-y-auto flex-1 divide-y divide-stone-100 px-2 pb-2">
                    {filtered.length === 0 ? (
                        <p className="py-10 text-center text-sm text-stone-400">Sin resultados</p>
                    ) : filtered.map(prod => (
                        <button
                            key={prod.id}
                            onClick={() => onSelect(prod)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-stone-50 transition-colors rounded-lg"
                        >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                {prod.imagen_url
                                    ? <img src={prod.imagen_url} className="w-full h-full object-contain" alt="" loading="lazy" />
                                    : <ImgPlaceholder />
                                }
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-stone-800 truncate">{prod.nombre}</p>
                                {prod.precio && (
                                    <p className="text-[11px] text-stone-500 mt-0.5">{formatPrecio(prod.precio)}</p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Slot card ────────────────────────────────────────────────────────────────

function SlotCard({ slot, allProductos, onUpdated }) {
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSelect = async (producto) => {
        setShowModal(false);
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await updateHomeColeccionSlot(slot.id, producto.id, session.access_token);
            await onUpdated();
            toast.success(`Slot #${slot.orden} → ${producto.nombre}`);
        } catch (err) {
            toast.error(err.message || 'Error al actualizar slot');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border-b border-stone-100">
                    <span className="text-xs font-medium text-stone-500">Slot #{slot.orden}</span>
                    {saving && <Spinner className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent" />}
                </div>
                <div className="p-3 space-y-2">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100">
                        {slot.imagen_url
                            ? <img src={slot.imagen_url} className="w-full h-full object-contain" alt={slot.nombre || ''} loading="lazy" />
                            : <ImgPlaceholder />
                        }
                    </div>
                    {slot.nombre
                        ? <p className="text-xs font-semibold text-stone-800 line-clamp-2 leading-tight">{slot.nombre}</p>
                        : <p className="text-xs text-stone-400 italic">Sin producto</p>
                    }
                    {slot.precio && (
                        <p className="text-[11px] text-stone-500">{formatPrecio(slot.precio)}</p>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-stone-300 rounded-lg text-[11px] text-stone-600 hover:border-stone-500 hover:text-stone-800 disabled:opacity-40 transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Cambiar Producto
                    </button>
                </div>
            </div>

            {showModal && (
                <SelectorModal
                    slot={slot}
                    allProductos={allProductos}
                    onSelect={handleSelect}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

// ── ColeccionTab ──────────────────────────────────────────────────────────────

export default function ColeccionTab() {
    const [slots, setSlots] = useState([]);
    const [allProductos, setAllProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const [slotsData, prodsData] = await Promise.all([
            getHomeColeccionAdmin(session.access_token),
            getProductos(session.access_token),
        ]);
        setSlots(slotsData);
        setAllProductos(prodsData);
    };

    useEffect(() => {
        fetchData()
            .catch(() => toast.error('Error al cargar la colección'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner className="w-6 h-6 border-2 border-stone-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {slots.map(slot => (
                    <SlotCard
                        key={slot.id}
                        slot={slot}
                        allProductos={allProductos}
                        onUpdated={fetchData}
                    />
                ))}
            </div>
            <p className="text-xs text-stone-400">
                Los 8 slots se muestran en la portada en ese orden exacto (2 filas × 4 columnas). Al guardar, el cambio se refleja de inmediato en la home.
            </p>
        </div>
    );
}
