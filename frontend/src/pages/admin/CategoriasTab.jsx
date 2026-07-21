import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getHomeCategoriasSlotsAdmin, updateHomeCategoriaSlot, uploadCategoriaImagen, getAdminCategorias } from '@/services/api';

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

// ── Categoria slot card ──────────────────────────────────────────────────────

function CategoriaSlotCard({ slot, allCategorias, onUpdated }) {
    const [showSelector, setShowSelector] = useState(false);
    const [query, setQuery] = useState('');
    const [pendingCat, setPendingCat] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);

    const filtered = allCategorias.filter(c =>
        !query.trim() ||
        c.nombre.toLowerCase().includes(query.toLowerCase()) ||
        c.slug.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelectCat = async (cat) => {
        setShowSelector(false);
        setQuery('');
        if (!cat.imagen_url) { setPendingCat(cat); return; }
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await updateHomeCategoriaSlot(slot.id, cat.slug, session.access_token);
            await onUpdated();
            toast.success(`Slot actualizado → ${cat.nombre}`);
        } catch (err) { toast.error(err.message || 'Error al actualizar slot'); }
        finally { setSaving(false); }
    };

    const handleUploadAndSave = async () => {
        if (!uploadFile || !pendingCat) return;
        setUploadingImg(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const fd = new FormData();
            fd.append('imagen', uploadFile);
            await uploadCategoriaImagen(pendingCat.id, fd, session.access_token);
            await updateHomeCategoriaSlot(slot.id, pendingCat.slug, session.access_token);
            await onUpdated();
            toast.success(`Slot activado → ${pendingCat.nombre}`);
            setPendingCat(null); setUploadFile(null);
        } catch (err) { toast.error(err.message || 'Error al procesar imagen'); }
        finally { setUploadingImg(false); }
    };

    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-500">Slot #{slot.orden}</span>
                {saving && <Spinner className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent" />}
            </div>
            <div className="p-3 space-y-2.5">
                <div className="aspect-square rounded-lg overflow-hidden bg-stone-100">
                    {slot.imagen_url
                        ? <img src={slot.imagen_url} className="w-full h-full object-cover object-center" alt={slot.nombre || ''} loading="lazy" />
                        : <ImgPlaceholder />
                    }
                </div>
                {slot.nombre
                    ? <p className="text-xs font-semibold text-stone-800 truncate">{slot.nombre}</p>
                    : <p className="text-xs text-stone-400 italic">Sin categoría</p>
                }
                {slot.slug && <p className="text-[10px] text-stone-400 -mt-1.5 truncate">{slot.slug}</p>}

                {showSelector ? (
                    <div className="space-y-1.5">
                        <input type="text" placeholder="Buscar categoría..." value={query}
                            onChange={e => setQuery(e.target.value)} autoFocus
                            className="w-full text-base sm:text-sm px-2.5 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-600"
                        />
                        <div className="max-h-40 overflow-y-auto rounded-lg border border-stone-200 divide-y divide-stone-100">
                            {filtered.length === 0
                                ? <p className="py-3 text-center text-[11px] text-stone-400">Sin resultados</p>
                                : filtered.map(cat => (
                                    <button key={cat.id} onClick={() => handleSelectCat(cat)}
                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-stone-50 transition-colors"
                                    >
                                        {cat.imagen_url
                                            ? <img src={cat.imagen_url} className="w-6 h-6 rounded object-cover shrink-0" alt="" />
                                            : <div className="w-6 h-6 rounded bg-stone-200 shrink-0 flex items-center justify-center">
                                                  <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" /></svg>
                                              </div>
                                        }
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] text-stone-800 truncate">{cat.nombre}</p>
                                            {cat.padre_nombre && <p className="text-[10px] text-stone-400 truncate">{cat.padre_nombre}</p>}
                                        </div>
                                        {!cat.imagen_url && <span className="shrink-0 text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded font-medium">Sin foto</span>}
                                    </button>
                                ))
                            }
                        </div>
                        <button onClick={() => { setShowSelector(false); setQuery(''); }} className="text-[11px] text-stone-400 hover:text-stone-600">Cancelar</button>
                    </div>
                ) : !pendingCat && (
                    <button onClick={() => setShowSelector(true)} disabled={saving}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-stone-300 rounded-lg text-[11px] text-stone-600 hover:border-stone-500 hover:text-stone-800 disabled:opacity-40 transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Cambiar Categoría
                    </button>
                )}

                {pendingCat && (
                    <div className="space-y-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-[11px] text-amber-800 font-medium leading-snug">
                            "{pendingCat.nombre}" no tiene imagen. Subí una foto para activar el slot.
                        </p>
                        <label className={`flex items-center gap-1.5 text-[11px] cursor-pointer ${uploadFile ? 'text-stone-700' : 'text-stone-500 hover:text-stone-700'}`}>
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{uploadFile ? uploadFile.name : 'Seleccionar imagen...'}</span>
                            <input type="file" accept="image/*" className="sr-only" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                        </label>
                        {uploadFile && (
                            <button onClick={handleUploadAndSave} disabled={uploadingImg}
                                className="w-full py-1.5 bg-amber-600 text-white text-[11px] font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors"
                            >
                                {uploadingImg && <Spinner className="w-3 h-3 border-2 border-white border-t-transparent" />}
                                {uploadingImg ? 'Procesando...' : 'Subir y activar slot'}
                            </button>
                        )}
                        <button onClick={() => { setPendingCat(null); setUploadFile(null); }} className="text-[10px] text-stone-400 hover:text-stone-600">Cancelar</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── CategoriasTab ────────────────────────────────────────────────────────────

export default function CategoriasTab() {
    const [slots, setSlots] = useState([]);
    const [allCategorias, setAllCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const [slotsData, catsData] = await Promise.all([
            getHomeCategoriasSlotsAdmin(session.access_token),
            getAdminCategorias(session.access_token),
        ]);
        setSlots(slotsData);
        setAllCategorias(catsData);
    };

    useEffect(() => {
        fetchData()
            .catch(() => toast.error('Error al cargar categorías'))
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
            {slots.length === 0 ? (
                <p className="py-12 text-center text-sm text-stone-400">
                    No se encontraron slots (home_categorias) en la base de datos.
                </p>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
                    {slots.map(slot => (
                        <CategoriaSlotCard
                            key={slot.id}
                            slot={slot}
                            allCategorias={allCategorias}
                            onUpdated={fetchData}
                        />
                    ))}
                </div>
            )}
            <p className="text-xs text-stone-400">
                Los 4 slots aparecen en ese orden en la portada. El slug seleccionado enlaza a la página de esa categoría.
            </p>
        </div>
    );
}
