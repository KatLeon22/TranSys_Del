const API_BASE_URL = '/api';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Login de usuario
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Guardar token y datos del usuario
                this.token = data.data.token;
                this.user = data.data.user;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('permissions', JSON.stringify(data.data.permissions));

                return {
                    success: true,
                    user: this.user,
                    permissions: data.data.permissions
                };
            } else {
                return {
                    success: false,
                    message: data.message
                };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                message: 'Error de conexión con el servidor'
            };
        }
    }

    // Logout
    async logout() {
        try {
            if (this.token) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar datos locales
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('permissions');
            console.log('🧹 Sesión limpiada completamente');
        }
    }


    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Obtener token
    getToken() {
        return this.token;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.user;
    }

    // Obtener permisos del usuario
    getPermissions() {
        return JSON.parse(localStorage.getItem('permissions') || '[]');
    }

    // Verificar si el usuario tiene un permiso específico
    hasPermission(permission) {
        const permissions = this.getPermissions();
        // Si permissions es un array de objetos, buscar por nombre_permiso
        if (permissions.length > 0 && typeof permissions[0] === 'object') {
            return permissions.some(p => p.nombre_permiso === permission);
        }
        // Si permissions es un array de strings, buscar directamente
        return permissions.includes(permission);
    }

    // Verificar si el usuario es admin
    isAdmin() {
        return this.user?.rol_nombre === 'administrador';
    }

    // Verificar si el usuario es piloto
    isPilot() {
        return this.user?.rol_nombre === 'piloto';
    }

    // Verificar token con el servidor
    async verifyToken() {
        try {
            if (!this.token) {
                return { success: false, message: 'No hay token' };
            }

            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Actualizar datos del usuario
                this.user = data.data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('permissions', JSON.stringify(data.data.permissions));
                
                return {
                    success: true,
                    user: this.user,
                    permissions: data.data.permissions
                };
            } else {
                // Token inválido, hacer logout
                this.logout();
                return {
                    success: false,
                    message: data.message
                };
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            this.logout();
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }

    // Hacer peticiones autenticadas
    async authenticatedFetch(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        return fetch(url, { ...defaultOptions, ...options });
    }

}

// Crear instancia singleton
const authService = new AuthService();
export default authService;

