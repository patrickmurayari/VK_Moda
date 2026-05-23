export const navigationConfig = [
    {
        id: 'mujer',
        label: 'Mujer',
        children: [
            { id: 'buzos-mujer', label: 'Buzos', slug: '/categoria/buzos-mujer' },
            { id: 'blusas-mujer', label: 'Blusas', slug: '/categoria/blusas-mujer' },
            {
                id: 'pantalones-mujer',
                label: 'Pantalones',
                children: [
                    { id: 'joggings-mujer', label: 'Joggings', slug: '/categoria/joggings-mujer' },
                    { id: 'pantalones-de-vestir-mujer', label: 'Pantalones de Vestir', slug: '/categoria/pantalones-de-vestir-mujer' },
                    { id: 'jeans-mujer', label: 'Jeans', slug: '/categoria/jeans-mujer' },
                ],
            },
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
