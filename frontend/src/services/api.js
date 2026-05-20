const API_BASE = import.meta.env.VITE_API_URL || 'https://vk-moda-backend.vercel.app/api';

// ── Helpers ──

async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error.error || `Error ${res.status}`);
    }
    return res.json();
}

async function authFetchJSON(url, token, options = {}) {
    const headers = { ...options.headers, Authorization: `Bearer ${token}` };
    return fetchJSON(url, { ...options, headers });
}

function adminURL(path) {
    return `${API_BASE}/admin${path}`;
}

// ── Públicas: Categorías ──

export async function getCategorias() {
    return fetchJSON(`${API_BASE}/categorias`);
}

// ── Públicas: Productos por categoría ──

export async function getProductosByCategoria(slug) {
    return fetchJSON(`${API_BASE}/productos/${slug}`);
}

// ── Públicas: Contenido web por sección ──
// Secciones válidas: hero, coleccion, editorial, inspiracion, quienes_somos

export async function getContenido(seccion) {
    return fetchJSON(`${API_BASE}/contenido/${seccion}`);
}

// ── Admin: Pedidos ──

export async function getPedidos(token) {
    return authFetchJSON(adminURL('/pedidos'), token);
}

export async function getPedidoById(id, token) {
    return authFetchJSON(adminURL(`/pedidos/${id}`), token);
}

export async function createPedido(data, token) {
    return authFetchJSON(adminURL('/pedidos'), token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function updatePedido(id, data, token) {
    return authFetchJSON(adminURL(`/pedidos/${id}`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function deletePedido(id, token) {
    return authFetchJSON(adminURL(`/pedidos/${id}`), token, { method: 'DELETE' });
}

// ── Admin: Items de Pedido ──

export async function updateItem(pedidoId, itemId, data, token) {
    return authFetchJSON(adminURL(`/pedidos/${pedidoId}/items/${itemId}`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function cambiarEstadoItem(itemId, data, token) {
    return authFetchJSON(adminURL(`/items/${itemId}/estado`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function getWorkflowItem(itemId, token) {
    return authFetchJSON(adminURL(`/items/${itemId}/workflow`), token);
}

// ── Admin: Sesiones de Prueba ──

export async function getSesionesPrueba(pedidoId, token) {
    return authFetchJSON(adminURL(`/pedidos/${pedidoId}/sesiones`), token);
}

export async function createSesionPrueba(pedidoId, data, token) {
    return authFetchJSON(adminURL(`/pedidos/${pedidoId}/sesiones`), token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function updateSesionPrueba(sesionId, data, token) {
    return authFetchJSON(adminURL(`/sesiones/${sesionId}`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function realizarSesionPrueba(sesionId, data, token) {
    return authFetchJSON(adminURL(`/sesiones/${sesionId}/realizar`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// ── Admin: Clientes ──

export async function getClientes(token) {
    return authFetchJSON(adminURL('/clientes'), token);
}

export async function getClienteById(id, token) {
    return authFetchJSON(adminURL(`/clientes/${id}`), token);
}

export async function createCliente(data, token) {
    return authFetchJSON(adminURL('/clientes'), token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function updateCliente(id, data, token) {
    return authFetchJSON(adminURL(`/clientes/${id}`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function deleteCliente(id, token) {
    return authFetchJSON(adminURL(`/clientes/${id}`), token, { method: 'DELETE' });
}

export async function buscarClientes(query, token) {
    return authFetchJSON(adminURL(`/clientes/buscar?q=${encodeURIComponent(query)}`), token);
}

export async function getHistorialMedidas(clienteId, token) {
    return authFetchJSON(adminURL(`/clientes/${clienteId}/medidas`), token);
}

export async function addMedidas(clienteId, data, token) {
    return authFetchJSON(adminURL(`/clientes/${clienteId}/medidas`), token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// ── Admin: Productos ──

export async function getProductos(token) {
    return authFetchJSON(adminURL('/productos'), token);
}

export async function getProductoById(id, token) {
    return authFetchJSON(adminURL(`/productos/${id}`), token);
}

export async function createProducto(data, token) {
    return authFetchJSON(adminURL('/productos'), token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function updateProducto(id, data, token) {
    return authFetchJSON(adminURL(`/productos/${id}`), token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export async function deleteProducto(id, token) {
    return authFetchJSON(adminURL(`/productos/${id}`), token, { method: 'DELETE' });
}
