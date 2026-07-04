import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'vya_cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const agregarAlCarrito = (producto, talle = null, cantidad = 1) => {
        const idUnique = talle ? `${producto.id}-${talle}` : String(producto.id);
        setItems((prev) => {
            const existing = prev.find((i) => i.idUnique === idUnique);
            if (existing) {
                return prev.map((i) =>
                    i.idUnique === idUnique ? { ...i, cantidad: i.cantidad + cantidad } : i
                );
            }
            return [
                ...prev,
                {
                    idUnique,
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen_url: producto.imagen_url,
                    talle: talle || null,
                    cantidad,
                },
            ];
        });
    };

    const eliminarDelCarrito = (idUnique) => {
        setItems((prev) => prev.filter((i) => i.idUnique !== idUnique));
    };

    const actualizarCantidad = (idUnique, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        setItems((prev) =>
            prev.map((i) => (i.idUnique === idUnique ? { ...i, cantidad: nuevaCantidad } : i))
        );
    };

    const vaciarCarrito = () => {
        setItems([]);
    };

    const totalPrecio = useMemo(
        () => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
        [items]
    );

    const totalItems = useMemo(
        () => items.reduce((sum, i) => sum + i.cantidad, 0),
        [items]
    );

    return (
        <CartContext.Provider
            value={{
                items,
                drawerOpen,
                setDrawerOpen,
                agregarAlCarrito,
                eliminarDelCarrito,
                actualizarCantidad,
                vaciarCarrito,
                totalPrecio,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
    return ctx;
}
