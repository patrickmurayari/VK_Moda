import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getHeroContenidoAdmin, addHeroSlide, reorderHeroSlide, deleteHeroSlide, updateHeroImagen } from '@/services/api';

// ── Icons ────────────────────────────────────────────────────────────────────

const IconChevronUp = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);
const IconChevronDown = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const IconTrash = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const IconPlus = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
const IconClose = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const Spinner = ({ className = 'w-4 h-4 border-2 border-current border-t-transparent' }) => (
    <div className={`${className} rounded-full animate-spin`} />
);

// ── Thumbnail placeholder ────────────────────────────────────────────────────

function ImgPlaceholder() {
    return (
        <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    );
}

// ── File input with preview ──────────────────────────────────────────────────

function FilePickerPreview({ label, hint, aspectClass, value, onChange }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-medium text-stone-600">
                {label} <span className="text-red-500">*</span>
            </p>
            <label className="block cursor-pointer">
                <div className={`${aspectClass} rounded-lg overflow-hidden border-2 border-dashed transition-colors ${value ? 'border-stone-200' : 'border-stone-300 hover:border-stone-500'} bg-stone-50`}>
                    {value
                        ? <img src={URL.createObjectURL(value)} className="w-full h-full object-cover object-center" alt="" />
                        : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">Seleccionar</div>
                    }
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={e => onChange(e.target.files?.[0] || null)} />
            </label>
            <p className="text-[11px] text-stone-400">{hint}</p>
        </div>
    );
}

// ── Modal: Agregar nuevo slide ───────────────────────────────────────────────

function NuevoSlideModal({ onClose, onSuccess }) {
    const [mobileFile, setMobileFile] = useState(null);
    const [desktopFile, setDesktopFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const canSubmit = mobileFile && desktopFile && !uploading;

    const handleSubmit = async () => {
        if (!canSubmit) { toast.error('Seleccioná ambas imágenes antes de guardar'); return; }
        setUploading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const fd = new FormData();
            fd.append('imagen_mobile', mobileFile);
            fd.append('imagen_desktop', desktopFile);
            const result = await addHeroSlide(fd, session.access_token);
            onSuccess(result);
            toast.success('Slide agregado correctamente');
            onClose();
        } catch (err) {
            toast.error(err.message || 'Error al agregar slide');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget && !uploading) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                    <h3 className="font-semibold text-stone-800">Nuevo Slide</h3>
                    <button onClick={onClose} disabled={uploading} className="text-stone-400 hover:text-stone-700 disabled:opacity-40 transition-colors">
                        <IconClose />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <FilePickerPreview
                            label="Banner Celular"
                            hint="Recomendado: 4:5 o 9:16"
                            aspectClass="aspect-[9/16] max-h-52"
                            value={mobileFile}
                            onChange={setMobileFile}
                        />
                        <FilePickerPreview
                            label="Banner Escritorio"
                            hint="Recomendado: 16:9"
                            aspectClass="aspect-video"
                            value={desktopFile}
                            onChange={setDesktopFile}
                        />
                    </div>

                    <p className="text-xs text-stone-400">
                        Ambas imágenes se convierten a WebP optimizado. La orientación se corrige automáticamente.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="flex-1 py-2.5 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                        >
                            {uploading && <Spinner className="w-4 h-4 border-2 border-white border-t-transparent" />}
                            {uploading ? 'Procesando...' : 'Guardar Slide'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Replacable thumbnail ─────────────────────────────────────────────────────

function ReplacableThumbnail({ url, aspectClass, campo, slideId, onReplaced }) {
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
            fd.append('campo', campo);
            await updateHeroImagen(slideId, fd, session.access_token);
            await onReplaced();
            toast.success('Imagen reemplazada correctamente');
        } catch (err) {
            toast.error(err.message || 'Error al reemplazar imagen');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className={`relative ${aspectClass} rounded-lg overflow-hidden bg-stone-100 group`}>
            {url
                ? <img src={url} className="w-full h-full object-cover object-center" alt="" loading="lazy" />
                : <ImgPlaceholder />
            }

            {/* Hover overlay: reemplazar */}
            {!uploading && (
                <label className="absolute inset-0 flex items-end justify-center pb-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent">
                    <span className="text-[10px] text-white font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                        Reemplazar
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

            {/* Upload overlay */}
            {uploading && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5">
                    <Spinner className="w-5 h-5 border-2 border-white border-t-transparent" />
                    <p className="text-[10px] text-white font-medium">Subiendo...</p>
                </div>
            )}
        </div>
    );
}

// ── Slide card ───────────────────────────────────────────────────────────────

function SlideCard({ slide, index, total, onReorder, onDelete, onReplace }) {
    const [busy, setBusy] = useState(null); // null | 'arriba' | 'abajo' | 'delete'

    const handleReorder = async (dir) => {
        setBusy(dir);
        try {
            await onReorder(slide.id, dir);
        } catch {
            toast.error('Error al reordenar');
        } finally {
            setBusy(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Eliminar este slide del carrusel?')) return;
        setBusy('delete');
        try {
            await onDelete(slide.id);
        } catch {
            toast.error('Error al eliminar');
            setBusy(null);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-500 tabular-nums">
                    Slide #{slide.orden}
                </span>
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => handleReorder('arriba')}
                        disabled={index === 0 || busy !== null}
                        title="Subir"
                        className="p-1.5 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                        {busy === 'arriba' ? <Spinner /> : <IconChevronUp />}
                    </button>
                    <button
                        onClick={() => handleReorder('abajo')}
                        disabled={index === total - 1 || busy !== null}
                        title="Bajar"
                        className="p-1.5 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                        {busy === 'abajo' ? <Spinner /> : <IconChevronDown />}
                    </button>
                    <div className="w-px h-4 bg-stone-200 mx-1" />
                    <button
                        onClick={handleDelete}
                        disabled={busy !== null}
                        title="Eliminar slide"
                        className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                        {busy === 'delete' ? <Spinner className="w-4 h-4 border-2 border-red-400 border-t-transparent" /> : <IconTrash />}
                    </button>
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-4">
                <div className="space-y-1">
                    <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wide">Celular</p>
                    <div className="max-h-[350px] mx-auto w-fit">
                        <ReplacableThumbnail
                            url={slide.imagen_url}
                            aspectClass="aspect-[9/16] max-h-[350px]"
                            campo="imagen_url"
                            slideId={slide.id}
                            onReplaced={onReplace}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wide">Escritorio</p>
                    <ReplacableThumbnail
                        url={slide.imagen_desktop_url}
                        aspectClass="aspect-video"
                        campo="imagen_desktop_url"
                        slideId={slide.id}
                        onReplaced={onReplace}
                    />
                </div>
            </div>

            {slide.titulo && (
                <p className="px-4 pb-3 text-xs text-stone-500 truncate">{slide.titulo}</p>
            )}
        </div>
    );
}

// ── HeroTab ──────────────────────────────────────────────────────────────────

export default function HeroTab() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchSlides = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const data = await getHeroContenidoAdmin(session.access_token);
        setSlides(data);
    };

    useEffect(() => {
        fetchSlides()
            .catch(() => toast.error('Error al cargar los slides del Hero'))
            .finally(() => setLoading(false));
    }, []);

    const handleReorder = async (id, direccion) => {
        const { data: { session } } = await supabase.auth.getSession();
        await reorderHeroSlide(id, direccion, session.access_token);
        await fetchSlides();
        toast.success('Orden actualizado');
    };

    const handleDelete = async (id) => {
        const { data: { session } } = await supabase.auth.getSession();
        await deleteHeroSlide(id, session.access_token);
        setSlides(prev => prev.filter(s => s.id !== id));
        toast.success('Slide eliminado');
    };

    const handleNewSlide = () => fetchSlides();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner className="w-6 h-6 border-2 border-stone-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {/* Subheader */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-stone-500">
                    {slides.length} slide{slides.length !== 1 ? 's' : ''} en el carrusel
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors shrink-0"
                >
                    <IconPlus />
                    Agregar Slide
                </button>
            </div>

            {/* Slide list */}
            {slides.length === 0 ? (
                <div className="py-20 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
                    <p className="text-sm">No hay slides en el Hero.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-3 text-sm text-stone-600 underline underline-offset-2 hover:text-stone-900"
                    >
                        Agregar el primero
                    </button>
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                    {slides.map((slide, index) => (
                        <SlideCard
                            key={slide.id}
                            slide={slide}
                            index={index}
                            total={slides.length}
                            onReorder={handleReorder}
                            onDelete={handleDelete}
                            onReplace={fetchSlides}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <NuevoSlideModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleNewSlide}
                />
            )}
        </div>
    );
}
