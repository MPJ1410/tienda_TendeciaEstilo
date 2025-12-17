// ===== CONFIGURACIÓN DE SUPABASE =====
// Credenciales del proyecto Tendencia y Estilo

(function () {
    const SUPABASE_URL = 'https://uqndkioegzurynhijqnb.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbmRraW9lZ3p1cnluaGlqcW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjA4NjgsImV4cCI6MjA4MDk5Njg2OH0.GAaUS323kK7gvf5jSOadUux7rzSoI7d9GbeBHDZ-TbU';

    // Verificar que el SDK de Supabase está cargado
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Error: El SDK de Supabase no está cargado');
        return;
    }

    // Inicializar cliente de Supabase
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Exportar para uso global
    window.supabaseClient = client;

    console.log('✅ Supabase configurado correctamente');
    console.log('🔗 URL:', SUPABASE_URL);
})();

