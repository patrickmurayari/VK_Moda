export const navigationConfig = [
    {
        id: 'mujer',
        label: 'Mujer',
        children: [
            { id: 'buzos-mujer', label: 'Buzos', slug: '/categoria/buzos-mujer' },
        ],
    },
    {
        id: 'hombre',
        label: 'Hombre',
        children: [
            { id: 'camperas-hombre', label: 'Camperas', slug: '/categoria/camperas-hombre' },
        ],
    },
    {
        id: 'colecciones',
        label: 'Colecciones',
        slug: '/coleccion',
    },
    {
        id: 'contacto',
        label: 'Contacto',
        action: 'scroll',
        target: 'contactos',
    },
];
