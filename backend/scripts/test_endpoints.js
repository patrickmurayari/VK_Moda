const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

async function testEndpoint(endpoint, description) {
    try {
        console.log(`\n=== ${description} ===`);
        const res = await fetch(`${API_BASE}${endpoint}`);
        const data = await res.json();
        console.log(`Status: ${res.status}`);
        console.log(`Items: ${Array.isArray(data) ? data.length : (data.productos ? data.productos.length : 'N/A')}`);
        
        if (Array.isArray(data) && data.length > 0) {
            console.log(`Ejemplo: ${data[0].imagen_url ? 'URL OK' : 'Sin URL'}`);
        } else if (data.productos && data.productos.length > 0) {
            console.log(`Ejemplo: ${data.productos[0].imagen_url ? 'URL OK' : 'Sin URL'}`);
        }
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
    }
}

async function runTests() {
    console.log('🧪 Testeando endpoints del backend con datos migrados...\n');
    
    await testEndpoint('/categorias', 'CATEGORÍAS');
    await testEndpoint('/productos/bolsos', 'PRODUCTOS BOLSOS');
    await testEndpoint('/contenido/hero', 'CONTENIDO HERO');
    await testEndpoint('/contenido/coleccion', 'CONTENIDO COLECCIÓN');
    await testEndpoint('/contenido/editorial', 'CONTENIDO EDITORIAL');
    await testEndpoint('/contenido/inspiracion', 'CONTENIDO INSPIRACIÓN');
    await testEndpoint('/contenido/quienes_somos', 'CONTENIDO QUIÉNES SOMOS');
    
    console.log('\n✅ Tests completados');
}

runTests();
