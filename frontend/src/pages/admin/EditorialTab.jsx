import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getHomeEditorialAdmin, updateHomeEditorialTextos, updateHomeEditorialImagen } from '@/services/api';

// ── Shared primitives ────────────────────────────────────────────────────────

const Spinner = ({ className = 'w-4 h-4 border-2 border-current border-t-transparent' }) => (
    <div className={`${className} rounded-full animate-spin`} />
);

function ImgPlaceholder() {
    return (
        <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    );
}

// ── Replacable Editorial Image ────────────────────────────────────────────────

function ReplacableEditorialImage({ url, bloqueId, onReplaced }) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const fd = new FormData();
            fd.append('imagen', file);
            await updateHomeEditorialImagen(bloqueId, fd, session.access_token);
            await onReplaced();
            toast.success('Imagen actualizada correctamente');
        } catch (err) {
            toast.error(err.message || 'Error al reemplazar imagen');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 group shrink-0 w-full">
            {url
                ? <img src={url} className="w-full h-full object-cover object-center" alt="" loading="lazy" />
                : <ImgPlaceholder />
            }

            {!uploading && (
                <label className="absolute inset-0 flex items-end justify-center pb-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/55 to-transparent">
                    <span className="text-[11px] text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        Reemplazar imagen
                    </span>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleChange}
                    />
                </label>
            )}

            {uploading && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2">
                    <Spinner className="w-5 h-5 border-2 border-white border-t-transparent" />
                    <p className="text-[11px] text-white font-medium">Subiendo...</p>
                </div>
            )}
        </div>
    );
}

// ── Editorial card ────────────────────────────────────────────────────────────

function EditorialCard({ bloque, onRefresh }) {
    const [titulo, setTitulo] = useState(bloque.titulo ?? '');
    const [subtitulo, setSubtitulo] = useState(bloque.subtitulo ?? '');
    const [descripcion, setDescripcion] = useState(bloque.descripcion ?? '');
    const [saving, setSaving] = useState(false);
    const dirty = titulo !== (bloque.titulo ?? '') || subtitulo !== (bloque.subtitulo ?? '') || descripcion !== (bloque.descripcion ?? '');

    const handleSave = async () => {
        if (!titulo.trim()) { toast.error('El título no puede estar vacío'); return; }
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await updateHomeEditorialTextos(bloque.id, { titulo, subtitulo, descripcion }, session.access_token);
            await onRefresh();
            toast.success(`Bloque #${bloque.orden} actualizado`);
        } catch (err) {
            toast.error(err.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-600 tracking-wide uppercase">
                    Bloque #{bloque.orden}
                </span>
                {dirty && (
                    <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Sin guardar
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5">
                {/* Image */}
                <ReplacableEditorialImage
                    url={bloque.imagen_url}
                    bloqueId={bloque.id}
                    onReplaced={onRefresh}
                />

                {/* Text fields */}
                <div className="flex flex-col gap-3 min-w-0">
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={e => setTitulo(e.target.value)}
                            className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-600 text-stone-800"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">Subtítulo</label>
                        <input
                            type="text"
                            value={subtitulo}
                            onChange={e => setSubtitulo(e.target.value)}
                            className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-600 text-stone-800"
                        />
                    </div>
                    <div className="space-y-1 flex-1">
                        <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            rows={4}
                            className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-600 text-stone-800 resize-none leading-relaxed"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || !dirty}
                        className="self-end flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-xs font-medium rounded-lg hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving && <Spinner className="w-3.5 h-3.5 border-2 border-white border-t-transparent" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── EditorialTab ──────────────────────────────────────────────────────────────

export default function EditorialTab() {
    const [bloques, setBloques] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const data = await getHomeEditorialAdmin(session.access_token);
        setBloques(data);
    };

    useEffect(() => {
        fetchData()
            .catch(() => toast.error('Error al cargar el editorial'))
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
        <div className="space-y-4 max-w-4xl mx-auto">
            {bloques.map(bloque => (
                <EditorialCard
                    key={bloque.id}
                    bloque={bloque}
                    onRefresh={fetchData}
                />
            ))}
        </div>
    );
}
