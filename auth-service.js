// ===== SERVICIO DE AUTENTICACIÓN SUPABASE =====

const AuthService = {
    // Iniciar sesión con email y contraseña
    async login(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ Login exitoso:', data.user.email);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Error en login:', error.message);
            return { success: false, error: error.message };
        }
    },

    // Cerrar sesión
    async logout() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;

            console.log('✅ Logout exitoso');
            return { success: true };
        } catch (error) {
            console.error('❌ Error en logout:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener usuario actual
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            return user;
        } catch (error) {
            console.error('❌ Error al obtener usuario:', error);
            return null;
        }
    },

    // Verificar si hay sesión activa
    async isAuthenticated() {
        const user = await this.getCurrentUser();
        return user !== null;
    },

    // Registrar nuevo usuario (solo para crear el admin inicial)
    async register(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ Usuario registrado:', data.user.email);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Error en registro:', error.message);
            return { success: false, error: error.message };
        }
    },

    // Escuchar cambios en la autenticación
    onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};

// Exportar para uso global
window.AuthService = AuthService;

console.log('✅ Auth Service inicializado');
