import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Faltan variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para obtener la sesión actual
export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// Helper para obtener el usuario actual
export const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Helper para cerrar sesión
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};
