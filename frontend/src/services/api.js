const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error.error || `Error ${res.status}`);
    }
    return res.json();
}

// ── Categorías ──
export async function getCategorias() {
    return fetchJSON(`${API_BASE}/categorias`);
}

// ── Productos por categoría ──
export async function getProductosByCategoria(slug) {
    return fetchJSON(`${API_BASE}/productos/${slug}`);
}

// ── Contenido web por sección ──
// Secciones válidas: hero, coleccion, editorial, inspiracion, quienes_somos
export async function getContenido(seccion) {
    return fetchJSON(`${API_BASE}/contenido/${seccion}`);
}
