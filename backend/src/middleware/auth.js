const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Faltan variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket }
});

/**
 * Middleware para validar el token JWT de Supabase
 * Protege las rutas de escritura (POST, PUT, DELETE)
 */
const authMiddleware = async (req, res, next) => {
    // Solo aplicar a métodos de escritura
    const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    
    if (!protectedMethods.includes(req.method)) {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'No autorizado',
                message: 'Token de autenticación requerido' 
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar el token con Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ 
                error: 'No autorizado',
                message: 'Token inválido o expirado' 
            });
        }

        // Adjuntar el usuario al request para uso posterior
        req.user = user;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(500).json({ 
            error: 'Error de autenticación',
            message: 'Error al verificar el token' 
        });
    }
};

/**
 * Middleware opcional para rutas que necesitan el usuario pero no obligan autenticación
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user } } = await supabase.auth.getUser(token);
            req.user = user;
        }
        
        next();
    } catch (error) {
        // Si hay error, simplemente continuamos sin usuario
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };
