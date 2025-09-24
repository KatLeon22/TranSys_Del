const API_BASE_URL = 'http://localhost:4000/api';

class CamionesService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener todos los camiones
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

    // Obtener un camión por ID
    async getCamionById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/camiones/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo camión:', error);
            throw error;
        }
    }

    // Crear nuevo camión
    async createCamion(camionData) {
        try {
            console.log('Enviando datos del camión:', camionData);
            const response = await fetch(`${API_BASE_URL}/camiones`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(camionData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos del servidor:', data);
            return data;
        } catch (error) {
            console.error('Error creando camión:', error);
            throw error;
        }
    }

    // Actualizar camión
    async updateCamion(id, camionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/camiones/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(camionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando camión:', error);
            throw error;
        }
    }

    // Eliminar camión
    async deleteCamion(id) {
        try {
            console.log('Eliminando camión con ID:', id);
            const response = await fetch(`${API_BASE_URL}/camiones/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos del servidor:', data);
            return data;
        } catch (error) {
            console.error('Error eliminando camión:', error);
            throw error;
        }
    }
}

export default new CamionesService();
