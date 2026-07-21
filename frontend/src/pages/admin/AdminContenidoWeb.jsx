import { useState } from 'react';
import HeroTab from './HeroTab';
import CategoriasTab from './CategoriasTab';
import ColeccionTab from './ColeccionTab';
import EditorialTab from './EditorialTab';

const TABS = [
    { key: 'hero',       label: 'Banners Hero' },
    { key: 'categorias', label: 'Categorías Portada' },
    { key: 'coleccion',  label: 'Colección Portada' },
    { key: 'editorial',  label: 'Editorial Lookbook' },
];

export default function AdminContenidoWeb() {
    const [tabActiva, setTabActiva] = useState('hero');

    return (
        <div className="space-y-5 w-full">
            {/* Header */}
            <div>
                <h2 className="text-xl sm:text-2xl font-heading text-stone-800">Gestión Web</h2>
                <p className="text-sm text-stone-500 mt-1">Contenido dinámico de la portada</p>
            </div>

            {/* Tab bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:flex sm:flex-row bg-white rounded-xl shadow-sm border border-stone-200 p-1">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setTabActiva(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors col-span-1 sm:flex-1 text-center ${
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
            {tabActiva === 'hero'       && <HeroTab />}
            {tabActiva === 'categorias' && <CategoriasTab />}
            {tabActiva === 'coleccion'  && <ColeccionTab />}
            {tabActiva === 'editorial'  && <EditorialTab />}
        </div>
    );
}
