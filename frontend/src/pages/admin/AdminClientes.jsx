import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getClientes, buscarClientes, createCliente } from '@/services/api';

export default function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [searching, setSearching] = useState(false);

    // Modal nuevo cliente
    const [modalAbierto, setModalAbierto] = useState(false);
    const [saving, setSaving] = useState(false);
    const emptyForm = { nombre: '', apellido: '', telefono: '', email: '' };
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({ nombre: false, telefono: false });

    const abrirModal = () => { setForm(emptyForm); setFormErrors({ nombre: false, telefono: false }); setModalAbierto(true); };
    const cerrarModal = () => { setModalAbierto(false); setForm(emptyForm); setFormErrors({ nombre: false, telefono: false }); };

    const handleGuardar = async () => {
        const errs = { nombre: !form.nombre.trim(), telefono: !form.telefono.trim() };
        if (errs.nombre || errs.telefono) { setFormErrors(errs); return; }
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await createCliente({
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim() || null,
                telefono: form.telefono.trim(),
                email: form.email.trim() || null,
            }, session.access_token);
            toast.success('Cliente registrado correctamente');
            cerrarModal();
            fetchClientes();
        } catch (err) {
            toast.error(err.message || 'Error al registrar cliente');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await getClientes(session.access_token);
            setClientes(data);
        } catch {
            toast.error('Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda rápida con debounce
    useEffect(() => {
        if (busqueda.trim().length < 2) {
            if (busqueda.trim().length === 0) fetchClientes();
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const data = await buscarClientes(busqueda, session.access_token);
                setClientes(data.resultados || []);
            } catch { /* ignore */ }
            setSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [busqueda]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Clientes</h2>
                <button
                    onClick={abrirModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors active:scale-[0.98]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Cliente
                </button>
            </div>

            {/* Buscador */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 focus:border-stone-400 outline-none"
                />
                {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Cards mobile */}
            <div className="space-y-3 sm:hidden">
                {clientes.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                        <p className="text-sm">No se encontraron clientes</p>
                    </div>
                ) : (
                    clientes.map((c) => (
                        <Link
                            key={c.id}
                            to={`/admin/clientes/${c.id}`}
                            className="block bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md transition-shadow active:scale-[0.99]"
                        >
                            <p className="font-medium text-stone-800">{c.apellido}, {c.nombre}</p>
                            <div className="flex gap-3 mt-1 text-xs text-stone-500">
                                {c.telefono && <span>{c.telefono}</span>}
                                {c.email && <span>{c.email}</span>}
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Tabla desktop */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Nombre</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Teléfono</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-12 text-stone-400">No se encontraron clientes</td>
                                </tr>
                            ) : (
                                clientes.map((c) => (
                                    <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link to={`/admin/clientes/${c.id}`} className="text-stone-700 hover:text-stone-900 font-medium text-sm">
                                                {c.apellido}, {c.nombre}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-stone-600">{c.telefono || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-stone-600">{c.email || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

            {/* Modal nuevo cliente */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-heading text-stone-800 text-lg">Nuevo Cliente</h3>
                            <button onClick={cerrarModal} className="p-1 rounded-lg hover:bg-stone-100 transition-colors">
                                <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-stone-500 mb-1">Nombre <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={form.nombre}
                                    onChange={(e) => { setForm(f => ({ ...f, nombre: e.target.value })); setFormErrors(prev => ({ ...prev, nombre: false })); }}
                                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none ${formErrors.nombre ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                                />
                                {formErrors.nombre && <p className="text-xs text-red-500 mt-0.5">El nombre es obligatorio.</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-stone-500 mb-1">Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Apellido"
                                    value={form.apellido}
                                    onChange={(e) => setForm(f => ({ ...f, apellido: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-stone-500 mb-1">Teléfono <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    placeholder="11-1234-5678"
                                    value={form.telefono}
                                    onChange={(e) => { setForm(f => ({ ...f, telefono: e.target.value })); setFormErrors(prev => ({ ...prev, telefono: false })); }}
                                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none ${formErrors.telefono ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                                />
                                {formErrors.telefono && <p className="text-xs text-red-500 mt-0.5">El teléfono es obligatorio.</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-stone-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={form.email}
                                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={cerrarModal}
                                className="flex-1 py-2.5 border border-stone-300 rounded-lg text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={saving}
                                className="flex-1 py-2.5 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</>
                                ) : 'Guardar Cliente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
