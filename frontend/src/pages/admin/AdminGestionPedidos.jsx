import { useState } from 'react';
import AdminCronograma from './AdminCronograma';
import AdminFinalizados from './AdminFinalizados';
import AdminEntregados from './AdminEntregados';

const TABS = [
    { key: 'cronograma', label: 'En Taller' },
    { key: 'finalizados', label: 'Listos para Retirar' },
    { key: 'entregados', label: 'Historial de Entregados' },
];

export default function AdminGestionPedidos() {
    const [tabActiva, setTabActiva] = useState('cronograma');

    return (
        <div className="space-y-5">
            {/* Tab bar */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row bg-white rounded-xl shadow-sm border border-stone-200 p-1">
                {TABS.map((tab, i) => (
                    <button
                        key={tab.key}
                        onClick={() => setTabActiva(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
                            i === 2 ? 'col-span-2 sm:flex-1' : 'col-span-1 sm:flex-1'
                        } ${
                            tabActiva === tab.key
                                ? 'bg-stone-800 text-white shadow-sm'
                                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tabActiva === 'cronograma'   && <AdminCronograma />}
            {tabActiva === 'finalizados'  && <AdminFinalizados />}
            {tabActiva === 'entregados'   && <AdminEntregados />}
        </div>
    );
}
