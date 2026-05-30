'use strict';

const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: { persistSession: false },
        global: { fetch: (...args) => fetch(...args) },
        realtime: { worker: false, transport: ws },
    }
);

module.exports = supabaseAdmin;
