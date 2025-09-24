const API_BASE_URL = 'http://localhost:4000/api';

class AyudantesService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener todos los ayudantes
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

    // Obtener un ayudante por ID
    async getAyudanteById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/ayudantes/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo ayudante:', error);
            throw error;
        }
    }

    // Crear nuevo ayudante
    async createAyudante(ayudanteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/ayudantes`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(ayudanteData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creando ayudante:', error);
            throw error;
        }
    }

    // Actualizar ayudante
    async updateAyudante(id, ayudanteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/ayudantes/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(ayudanteData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando ayudante:', error);
            throw error;
        }
    }

    // Eliminar ayudante
    async deleteAyudante(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/ayudantes/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error eliminando ayudante:', error);
            throw error;
        }
    }
}

export default new AyudantesService();
