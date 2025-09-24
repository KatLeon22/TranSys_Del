const API_BASE_URL = 'http://localhost:4000/api';

class RutaService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener todas las rutas
    async getAllRutas() {
        try {
            const response = await fetch(`${API_BASE_URL}/rutas`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo rutas:', error);
            throw error;
        }
    }

    // Obtener el siguiente número de ruta
    async getNextRutaNumber() {
        try {
            const response = await fetch(`${API_BASE_URL}/rutas/next-number`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo siguiente número de ruta:', error);
            throw error;
        }
    }

    // Obtener una ruta por ID
    async getRutaById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo ruta:', error);
            throw error;
        }
    }

    // Crear nueva ruta
    async createRuta(rutaData) {
        try {
            const response = await fetch(`${API_BASE_URL}/rutas`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(rutaData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creando ruta:', error);
            throw error;
        }
    }

    // Actualizar ruta
    async updateRuta(id, rutaData) {
        try {
            const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(rutaData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando ruta:', error);
            throw error;
        }
    }

    // Eliminar ruta
    async deleteRuta(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error eliminando ruta:', error);
            throw error;
        }
    }

    // Obtener choferes disponibles
    async getChoferes() {
        try {
            const response = await fetch(`${API_BASE_URL}/choferes`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo choferes:', error);
            throw error;
        }
    }

    // Obtener camiones disponibles
    async getCamiones() {
        try {
            const response = await fetch(`${API_BASE_URL}/camiones`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo camiones:', error);
            throw error;
        }
    }

    // Obtener clientes disponibles
    async getClientes() {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo clientes:', error);
            throw error;
        }
    }

    // Obtener ayudantes disponibles
    async getAyudantes() {
        try {
            const response = await fetch(`${API_BASE_URL}/ayudantes`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo ayudantes:', error);
            throw error;
        }
    }
}

export default new RutaService();
