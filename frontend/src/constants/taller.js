export const USUARIOS_TALLER = [
    {
        id: 'bd69b56a-10a0-4841-8d66-1174fd04b30e',
        nombre: 'Joel Murayari',
        iniciales: 'JM',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
        id: '5b4420f4-b02c-4f85-bc91-d9407c647ed4',
        nombre: 'Virginia Murayari',
        iniciales: 'VM',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
];

export function usuarioById(id) {
    return USUARIOS_TALLER.find((u) => u.id === id) ?? null;
}
