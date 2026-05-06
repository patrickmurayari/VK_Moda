const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const fetch = require('node-fetch');

const OUT = 'd:\\Escritorio\\ProyectosDesarrolloWeb\\VyATaylorShop\\backend\\test_result.txt';

async function test() {
    const lines = [];
    lines.push('SUPABASE_URL: ' + (process.env.SUPABASE_URL || 'MISSING'));
    lines.push('SUPABASE_SERVICE_KEY: ' + (process.env.SUPABASE_SERVICE_KEY ? 'present' : 'MISSING'));

    try {
        const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
            auth: { persistSession: false },
            global: { fetch: (...args) => fetch(...args) },
            realtime: { transport: WebSocket },
        });

        const { data, error } = await sb.storage.from('imagenes_vya').list('', { limit: 5 });
        if (error) {
            lines.push('Storage error: ' + error.message);
        } else {
            lines.push('Storage list OK: ' + JSON.stringify(data));
        }
    } catch (e) {
        lines.push('Exception: ' + e.message);
    }

    fs.writeFileSync(OUT, lines.join('\n'));
}

test();
