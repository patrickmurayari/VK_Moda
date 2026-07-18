import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { buscarClientes, createCliente, createPedido, getCargaTrabajo } from '@/services/api';

const MEDIDAS_FIELDS = [
    { key: 'busto', label: 'Busto' },
    { key: 'cintura', label: 'Cintura' },
    { key: 'cadera', label: 'Cadera' },
    { key: 'talle_espalda', label: 'Talle Espalda' },
    { key: 'talle_delantero', label: 'Talle Delantero' },
    { key: 'largo_manga', label: 'Largo Manga' },
    { key: 'largo_pantalon', label: 'Largo Pantalón' },
    { key: 'contorno_brazo', label: 'Contorno Brazo' },
    { key: 'contorno_muneca', label: 'Contorno Muñeca' },
    { key: 'ancho_espalda', label: 'Ancho Espalda' },
    { key: 'largo_falda', label: 'Largo Falda' },
    { key: 'largo_total', label: 'Largo Total' },
];

const emptyItem = () => ({
    descripcion_prenda: '',
    tipo_trabajo: '',
    precio_item: '',
    tela_id: '',
    trae_tela: false,
    notas_especificas: '',
    medidas_json: {},
});

export default function OrderWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Pedido y Prendas, 2: Confirmar
    const [saving, setSaving] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clienteSearch, setClienteSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [clienteId, setClienteId] = useState('');
    const [clienteNombre, setClienteNombre] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);

    // Nuevo cliente inline
    const [showNuevoCliente, setShowNuevoCliente] = useState(false);
    const [creatingCliente, setCreatingCliente] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', apellido: '', telefono: '', email: '' });

    const [fechaEntrega, setFechaEntrega] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [seniaPagada, setSeniaPagada] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [items, setItems] = useState([emptyItem()]);

    // Errores fase 1
    const [clienteError, setClienteError] = useState(false);
    const [itemsListError, setItemsListError] = useState('');
    const [itemErrors, setItemErrors] = useState([{ desc: false, precio: false }]);
    const [nuevoClienteErrors, setNuevoClienteErrors] = useState({ nombre: false, telefono: false });

    // Buscar clientes
    useEffect(() => {
        if (clienteSearch.trim().length < 2) {
            setClientes([]);
            setSearchPerformed(false);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const data = await buscarClientes(clienteSearch, session.access_token);
                setClientes(data.resultados || []);
                setSearchPerformed(true);
            } catch { /* ignore */ }
            setSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [clienteSearch]);

    const selectCliente = (c) => {
        setClienteId(c.id);
        setClienteNombre(`${c.apellido}, ${c.nombre}`);
        setClienteSearch('');
        setClientes([]);
        setClienteError(false);
    };

    const clearCliente = () => {
        setClienteId('');
        setClienteNombre('');
    };

    const handleCrearCliente = async () => {
        const { nombre, telefono } = nuevoCliente;
        const errs = { nombre: !nombre.trim(), telefono: !telefono.trim() };
        if (errs.nombre || errs.telefono) {
            setNuevoClienteErrors(errs);
            return;
        }
        setCreatingCliente(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const data = await createCliente({
                nombre: nuevoCliente.nombre.trim(),
                apellido: nuevoCliente.apellido.trim() || null,
                telefono: nuevoCliente.telefono.trim(),
                email: nuevoCliente.email.trim() || null,
            }, session.access_token);

            // Auto-seleccionar el cliente recién creado
            setClienteId(data.id);
            setClienteNombre(`${data.apellido}, ${data.nombre}`);
            setClienteSearch('');
            setClientes([]);
            setShowNuevoCliente(false);
            setNuevoCliente({ nombre: '', apellido: '', telefono: '', email: '' });
            setNuevoClienteErrors({ nombre: false, telefono: false });
            setClienteError(false);
            toast.success(`Cliente ${data.nombre} ${data.apellido} registrado`);
        } catch (err) {
            toast.error(err.message || 'Error al registrar cliente');
        } finally {
            setCreatingCliente(false);
        }
    };

    // Items management
    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'tipo_trabajo' && value !== 'confeccion') {
            updated[index] = { ...updated[index], medidas_json: {} };
        }
        setItems(updated);
        if (field === 'descripcion_prenda' || field === 'precio_item') {
            const errs = [...itemErrors];
            if (errs[index]) {
                errs[index] = {
                    desc: field === 'descripcion_prenda' ? false : errs[index].desc,
                    precio: field === 'precio_item' ? false : errs[index].precio,
                };
                setItemErrors(errs);
            }
            setItemsListError('');
        }
    };

    const updateMedida = (index, key, value) => {
        const updated = [...items];
        updated[index] = {
            ...updated[index],
            medidas_json: { ...updated[index].medidas_json, [key]: value },
        };
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, emptyItem()]);
        setItemErrors([...itemErrors, { desc: false, precio: false }]);
    };
    const removeItem = (index) => {
        if (items.length <= 1) return toast.error('El pedido necesita al menos una prenda');
        setItems(items.filter((_, i) => i !== index));
        setItemErrors(itemErrors.filter((_, i) => i !== index));
    };

    const total = items.reduce((sum, item) => sum + (parseFloat(item.precio_item) || 0), 0);

    const handleNextStep1 = () => {
        let hasError = false;
        if (!clienteId) { setClienteError(true); hasError = true; }
        const newItemErrors = items.map((item) => ({
            desc: !item.descripcion_prenda.trim(),
            precio: !(parseFloat(item.precio_item) > 0),
        }));
        const hasItemFieldErrors = newItemErrors.some((e) => e.desc || e.precio);
        if (hasItemFieldErrors) { setItemErrors(newItemErrors); setItemsListError(''); hasError = true; }
        else if (items.every((item) => !item.descripcion_prenda.trim() && !parseFloat(item.precio_item))) {
            setItemsListError('Debes agregar al menos una prenda.'); hasError = true;
        }
        if (!hasError) {
            setItemErrors(items.map(() => ({ desc: false, precio: false })));
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!fechaEntrega) {
            setFechaError(true);
            return;
        }
        setSaving(true);
        try {
            const payload = {
                cliente_id: parseInt(clienteId),
                fecha_entrega_prometida: fechaEntrega || null,
                metodo_pago: metodoPago || null,
                senia_pagada: parseFloat(seniaPagada) || 0,
                observaciones_generales: observaciones || null,
                items: items.map((item) => ({
                    descripcion_prenda: item.descripcion_prenda.trim(),
                    tipo_trabajo: item.tipo_trabajo,
                    precio_item: parseFloat(item.precio_item),
                    trae_tela: item.trae_tela,
                    notas_especificas: item.notas_especificas || null,
                    medidas_json: item.tipo_trabajo === 'confeccion' && Object.keys(item.medidas_json).length > 0
                        ? item.medidas_json
                        : null,
                })),
            };

            const { data: { session } } = await supabase.auth.getSession();
            const data = await createPedido(payload, session.access_token);

            toast.success(`Pedido #${data.id} creado correctamente`);
            navigate(`/admin/pedidos/${data.id}`);
        } catch (err) {
            toast.error(err.message || 'Error al crear pedido');
        } finally {
            setSaving(false);
        }
    };

    const [fechaError, setFechaError] = useState(false);
    const [cargaTrabajo, setCargaTrabajo] = useState([]);
    const [loadingCarga, setLoadingCarga] = useState(false);

    useEffect(() => {
        if (step !== 2) return;
        const fetchCarga = async () => {
            setLoadingCarga(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const data = await getCargaTrabajo(session.access_token);
                setCargaTrabajo(data);
            } catch { /* ignore */ }
            setLoadingCarga(false);
        };
        fetchCarga();
    }, [step]);

    const proximosDias = (() => {
        const dias = [];
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() + 1);
        while (dias.length < 8) {
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                dias.push(`${y}-${m}-${day}`);
            }
            d.setDate(d.getDate() + 1);
        }
        return dias;
    })();

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val || 0);

    return (
        <div className="space-y-4 sm:space-y-6 w-full px-0 sm:px-0 md:max-w-2xl md:mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/admin/pedidos')} className="p-2 rounded-lg hover:bg-stone-200 transition-colors">
                    <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Nuevo Pedido</h2>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
                {[
                    { n: 1, label: 'Pedido y Prendas' },
                    { n: 2, label: 'Confirmar' },
                ].map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2 flex-1">
                        <button
                            onClick={() => s.n < step && setStep(s.n)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                step >= s.n ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-500'
                            }`}
                        >
                            {s.n}
                        </button>
                        <span className={`text-xs sm:text-sm hidden sm:inline ${step >= s.n ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>
                            {s.label}
                        </span>
                        {i < 1 && <div className={`flex-1 h-0.5 ${step > s.n ? 'bg-stone-600' : 'bg-stone-200'}`}></div>}
                    </div>
                ))}
            </div>

            {/* FASE 1: Cliente + Prendas */}
            {step === 1 && (
                <div className="space-y-4">
                <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-stone-200 space-y-4">
                    <h3 className="font-heading text-stone-800">Cliente <span className="text-red-500">*</span></h3>

                    {clienteId ? (
                        <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 font-heading font-bold text-sm">
                                    {clienteNombre.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-stone-800">{clienteNombre}</p>
                                    <p className="text-xs text-stone-500">ID: {clienteId}</p>
                                </div>
                            </div>
                            <button onClick={clearCliente} className="text-sm text-red-600 hover:text-red-700 font-medium">Cambiar</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Buscador */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, apellido o teléfono..."
                                    value={clienteSearch}
                                    onChange={(e) => { setClienteSearch(e.target.value); setShowNuevoCliente(false); setClienteError(false); }}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 outline-none ${clienteError ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400 focus:border-stone-400'}`}
                                />
                                {searching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {/* Dropdown resultados */}
                                {clientes.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {clientes.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => selectCliente(c)}
                                                className="w-full text-left px-4 py-3 hover:bg-stone-50 border-b border-stone-100 last:border-0 transition-colors"
                                            >
                                                <p className="text-sm font-medium text-stone-800">{c.apellido}, {c.nombre}</p>
                                                <p className="text-xs text-stone-500">{c.telefono || c.email || ''}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sin resultados → Botón registrar */}
                            {searchPerformed && clientes.length === 0 && !searching && !showNuevoCliente && (
                                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-center">
                                    <p className="text-sm text-stone-500 mb-3">No se encontró “{clienteSearch}”</p>
                                    <button
                                        onClick={() => {
                                            setShowNuevoCliente(true);
                                            // Pre-llenar con lo que escribió
                                            const parts = clienteSearch.trim().split(/\s+/);
                                            setNuevoCliente(prev => ({
                                                ...prev,
                                                nombre: parts[0] || '',
                                                apellido: parts.slice(1).join(' ') || '',
                                            }));
                                        }}
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors active:scale-[0.98] text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Registrar nuevo cliente
                                    </button>
                                </div>
                            )}

                            {/* Formulario inline nuevo cliente */}
                            {showNuevoCliente && (
                                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-heading text-stone-800">Nuevo Cliente</h4>
                                        <button
                                            onClick={() => setShowNuevoCliente(false)}
                                            className="text-xs text-stone-500 hover:text-stone-700"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-stone-500 mb-1">Nombre *</label>
                                            <input
                                                type="text"
                                                placeholder="Nombre"
                                                value={nuevoCliente.nombre}
                                                onChange={(e) => { setNuevoCliente({ ...nuevoCliente, nombre: e.target.value }); setNuevoClienteErrors(prev => ({ ...prev, nombre: false })); }}
                                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none bg-white ${nuevoClienteErrors.nombre ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                                            />
                                            {nuevoClienteErrors.nombre && <p className="text-xs text-red-500 mt-0.5">El nombre es obligatorio.</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs text-stone-500 mb-1">Apellido</label>
                                            <input
                                                type="text"
                                                placeholder="Apellido"
                                                value={nuevoCliente.apellido}
                                                onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
                                                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-stone-500 mb-1">Teléfono *</label>
                                            <input
                                                type="tel"
                                                placeholder="11-1234-5678"
                                                value={nuevoCliente.telefono}
                                                onChange={(e) => { setNuevoCliente({ ...nuevoCliente, telefono: e.target.value }); setNuevoClienteErrors(prev => ({ ...prev, telefono: false })); }}
                                                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none bg-white ${nuevoClienteErrors.telefono ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                                            />
                                            {nuevoClienteErrors.telefono && <p className="text-xs text-red-500 mt-0.5">El teléfono es obligatorio.</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs text-stone-500 mb-1">Email</label>
                                            <input
                                                type="email"
                                                placeholder="correo@ejemplo.com"
                                                value={nuevoCliente.email}
                                                onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                                                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none bg-white"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCrearCliente}
                                        disabled={creatingCliente}
                                        className="w-full py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {creatingCliente ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Registrando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Registrar y continuar
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {clienteError && !clienteId && (
                        <p className="text-xs text-red-500">El cliente es obligatorio.</p>
                    )}
                </div>

                {/* Prendas */}
                <div className="space-y-3">
                    <h3 className="font-heading text-stone-800 px-1">Prendas</h3>
                    {itemsListError && <p className="text-xs text-red-500 px-1">{itemsListError}</p>}
                    {items.map((item, idx) => {
                        const err = itemErrors[idx] || { desc: false, precio: false };
                        return (
                        <div key={idx} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-stone-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-heading text-stone-800 text-sm">Prenda {idx + 1}</h4>
                                {items.length > 1 && (
                                    <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 text-xs">Quitar</button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-stone-500 mb-1">Descripción de la prenda *</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Vestido largo de seda"
                                        value={item.descripcion_prenda}
                                        onChange={(e) => updateItem(idx, 'descripcion_prenda', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none ${err.desc ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                                    />
                                    {err.desc && <p className="text-xs text-red-500 mt-0.5">La descripción es obligatoria.</p>}
                                </div>
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1">Tipo de trabajo</label>
                                    <select
                                        value={item.tipo_trabajo}
                                        onChange={(e) => updateItem(idx, 'tipo_trabajo', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-stone-400 outline-none"
                                    >
                                        <option value="" disabled>Seleccionar tipo de trabajo</option>
                                        <option value="confeccion">Confección</option>
                                        <option value="retrabajo">Re-trabajo</option>
                                        <option value="arreglo">Arreglo</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1">Precio *</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={item.precio_item}
                                        onChange={(e) => updateItem(idx, 'precio_item', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${err.precio ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                                    />
                                    {err.precio && <p className="text-xs text-red-500 mt-0.5">El precio es obligatorio.</p>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.trae_tela}
                                            onChange={(e) => updateItem(idx, 'trae_tela', e.target.checked)}
                                            className="w-4 h-4 text-stone-700 rounded border-stone-300 focus:ring-stone-400"
                                        />
                                        <span className="text-sm text-stone-700">Trae tela</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-2">
                                <label className="block text-xs text-stone-500 mb-1">Notas específicas</label>
                                <input
                                    type="text"
                                    placeholder="Detalle adicional..."
                                    value={item.notas_especificas}
                                    onChange={(e) => updateItem(idx, 'notas_especificas', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none"
                                />
                            </div>

                            {/* Medidas para Confección */}
                            {item.tipo_trabajo === 'confeccion' && (
                                <div className="mt-4 border border-stone-200 rounded-lg p-3 bg-stone-50">
                                    <div className="mb-3">
                                        <h5 className="text-xs font-medium text-stone-700 uppercase">Medidas</h5>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {MEDIDAS_FIELDS.map((m) => (
                                            <div key={m.key}>
                                                <label className="block text-xs text-stone-500 mb-0.5">{m.label}</label>
                                                <input
                                                    type="text"
                                                    placeholder="cm"
                                                    value={item.medidas_json[m.key] || ''}
                                                    onChange={(e) => updateMedida(idx, m.key, e.target.value)}
                                                    className="w-full px-2 py-1.5 border border-stone-300 rounded text-sm focus:ring-1 focus:ring-stone-400 outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        );
                    })}

                    <button
                        onClick={addItem}
                        className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-sm text-stone-600 hover:border-stone-400 hover:text-stone-700 transition-colors"
                    >
                        + Agregar otra prenda
                    </button>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Total del pedido</span>
                        <span className="text-xl font-bold text-stone-800">{formatCurrency(total)}</span>
                    </div>

                    <button
                        onClick={handleNextStep1}
                        className="w-full py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors"
                    >
                        Siguiente: Confirmar
                    </button>
                </div>
                </div>
            )}

            {/* FASE 2: Confirmar */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-stone-200 space-y-4">
                        <h3 className="font-heading text-stone-800">Resumen del Pedido</h3>

                        {/* Cliente (solo lectura) */}
                        <div className="bg-stone-50 rounded-lg px-4 py-3">
                            <p className="text-xs text-stone-500">Cliente</p>
                            <p className="text-sm font-medium text-stone-800 mt-0.5">{clienteNombre}</p>
                        </div>

                        {/* Fecha de entrega + disponibilidad */}
                        <div>
                            <label className="block text-xs text-stone-500 mb-1">Fecha de entrega <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={fechaEntrega}
                                onChange={(e) => { setFechaEntrega(e.target.value); setFechaError(false); }}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full box-border px-3 py-2.5 border rounded-lg text-sm focus:ring-2 outline-none ${fechaError ? 'border-red-400 focus:ring-red-300' : 'border-stone-300 focus:ring-stone-400'}`}
                            />
                            {fechaError && (
                                <p className="text-xs text-red-500 mt-1">La fecha de entrega es obligatoria.</p>
                            )}
                            <div className="mt-2.5">
                                <p className="text-xs font-medium text-stone-500 mb-1.5">Disponibilidad del taller</p>
                                {loadingCarga ? (
                                    <div className="flex items-center gap-2 text-xs text-stone-400 py-1">
                                        <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                                        Cargando disponibilidad...
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {proximosDias.map((fecha) => {
                                            const entrada = cargaTrabajo.find(e => (e.fecha || '').toString().slice(0, 10) === fecha);
                                            const cantidad = entrada ? parseInt(entrada.cantidad_prendas) : 0;
                                            const isSelected = fechaEntrega === fecha;
                                            let color, icon, label;
                                            if (cantidad === 0) { color = 'bg-green-50 border-green-200 text-green-700'; icon = '🟢'; label = 'Libre'; }
                                            else if (cantidad <= 3) { color = 'bg-yellow-50 border-yellow-200 text-yellow-700'; icon = '🟡'; label = 'Carga moderada'; }
                                            else { color = 'bg-red-50 border-red-200 text-red-700'; icon = '🔴'; label = 'Muy ocupado'; }
                                            return (
                                                <div
                                                    key={fecha}
                                                    onClick={() => { setFechaEntrega(fecha); setFechaError(false); }}
                                                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs cursor-pointer hover:opacity-80 transition-opacity ${color} ${isSelected ? 'ring-2 ring-stone-500' : ''}`}
                                                >
                                                    <span className="font-medium">
                                                        {new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                                    </span>
                                                    <span>{icon} {label} ({cantidad} prenda{cantidad !== 1 ? 's' : ''})</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Método de pago + Seña */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-stone-500 mb-1">Método de pago</label>
                                <select
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-stone-400 outline-none"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="mixto">Mixto</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-stone-500 mb-1">Seña pagada</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={seniaPagada}
                                    onChange={(e) => setSeniaPagada(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div>
                            <label className="block text-xs text-stone-500 mb-1">Observaciones generales</label>
                            <textarea
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                rows={3}
                                placeholder="Notas adicionales sobre el pedido..."
                                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-stone-400 outline-none resize-none"
                            />
                        </div>

                        <div className="border-t border-stone-200 pt-4">
                            <h4 className="text-sm font-medium text-stone-700 mb-3">Prendas ({items.length})</h4>
                            <div className="space-y-2">
                                {items.map((item, idx) => {
                                    const medidasEntries = Object.entries(item.medidas_json || {}).filter(([, v]) => v);
                                    return (
                                        <div key={idx} className="bg-stone-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-stone-800 truncate">{item.descripcion_prenda}</p>
                                                    <p className="text-xs text-stone-500">{item.tipo_trabajo} {item.trae_tela ? '· Trae tela' : ''}</p>
                                                </div>
                                                <span className="text-sm font-bold text-stone-800 ml-2">{formatCurrency(parseFloat(item.precio_item) || 0)}</span>
                                            </div>
                                            {medidasEntries.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-stone-200">
                                                    <p className="text-xs text-stone-500 mb-1 font-medium">Medidas</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                                        {medidasEntries.map(([key, val]) => {
                                                            const label = MEDIDAS_FIELDS.find(m => m.key === key)?.label || key;
                                                            return (
                                                                <span key={key} className="text-xs text-stone-700">
                                                                    {label}: <strong>{val}cm</strong>
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                            <span className="font-heading text-stone-800">Total</span>
                            <span className="text-2xl font-bold text-stone-800">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 py-3 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50 transition-colors"
                        >
                            Atrás
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                'Confirmar Pedido'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
