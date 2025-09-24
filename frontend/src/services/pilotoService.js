const API_BASE_URL = 'http://localhost:4000/api';

class PilotoService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener rutas del piloto logueado
    async getMisRutas() {
        try {
            const response = await fetch(`${API_BASE_URL}/piloto/mis-rutas`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo rutas del piloto:', error);
            throw error;
        }
    }

    // Actualizar estado de una ruta
    async updateEstadoRuta(rutaId, nuevoEstado, comentario = '') {
        try {
            const response = await fetch(`${API_BASE_URL}/piloto/ruta/${rutaId}/estado`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    nuevoEstado,
                    comentario
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando estado de ruta:', error);
            throw error;
        }
    }

    // Obtener historial de una ruta
    async getHistorialRuta(rutaId) {
        try {
            const response = await fetch(`${API_BASE_URL}/piloto/ruta/${rutaId}/historial`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo historial de ruta:', error);
            throw error;
        }
    }
}

export default new PilotoService();




