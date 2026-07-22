import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { buscarProductos } from '@/services/api';
import { formatPrecio } from '@/utils/format';

export default function SearchModal({ onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await buscarProductos(query);
                setResults(data);
                setSearched(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (id) => {
        navigate(`/producto/${id}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-16 md:pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Input row */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" strokeWidth={1.5} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="flex-1 font-body text-sm text-stone-800 placeholder:text-neutral-400 focus:outline-none bg-transparent"
                    />
                    {query ? (
                        <button
                            onClick={() => setQuery('')}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    ) : null}
                    <button
                        onClick={onClose}
                        className="ml-1 text-[11px] font-body text-neutral-400 hover:text-neutral-700 border border-neutral-200 rounded px-1.5 py-0.5 transition-colors hidden sm:block"
                        aria-label="Cerrar buscador"
                    >
                        Esc
                    </button>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors sm:hidden"
                        aria-label="Cerrar buscador"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="px-5 py-8 text-center">
                        <p className="text-xs font-body text-neutral-400">Buscando...</p>
                    </div>
                )}

                {/* Empty state after search */}
                {!loading && searched && results.length === 0 && (
                    <div className="px-5 py-10 text-center">
                        <p className="text-sm font-body text-neutral-500">
                            No encontramos productos con esa búsqueda.
                        </p>
                        <p className="text-xs font-body text-neutral-400 mt-1">
                            Intentá con otro nombre o categoría.
                        </p>
                    </div>
                )}

                {/* Results */}
                {!loading && results.length > 0 && (
                    <ul className="divide-y divide-neutral-50 max-h-[400px] overflow-y-auto">
                        {results.map((p) => (
                            <li key={p.id}>
                                <button
                                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-colors text-left"
                                    onClick={() => handleSelect(p.id)}
                                >
                                    <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-neutral-100">
                                        {p.imagen_url ? (
                                            <img
                                                src={p.imagen_url}
                                                alt={p.nombre}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-body text-sm font-medium text-stone-800 truncate">
                                            {p.nombre}
                                        </p>
                                        {p.categoria_nombre && (
                                            <p className="font-body text-[11px] text-neutral-400 mt-0.5 truncate">
                                                {p.categoria_nombre}
                                            </p>
                                        )}
                                    </div>
                                    <span className="font-body text-sm text-stone-700 shrink-0 ml-2">
                                        {formatPrecio(p.precio)}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Initial hint */}
                {!loading && !searched && !query && (
                    <div className="px-5 py-6 text-center">
                        <p className="text-[11px] font-body text-neutral-400">
                            Empezá a escribir para buscar prendas...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
