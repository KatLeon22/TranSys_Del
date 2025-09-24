const API_BASE_URL = 'http://localhost:4000/api';

class ChoferesService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener todos los choferes
    async getChoferes() {
        try {
            console.log('Obteniendo choferes desde:', `${API_BASE_URL}/choferes`);
            console.log('Headers:', this.getAuthHeaders());
            
            const response = await fetch(`${API_BASE_URL}/choferes`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Datos recibidos del servidor:', data);
            return data;
        } catch (error) {
            console.error('Error obteniendo choferes:', error);
            throw error;
        }
    }

    // Obtener un chofer por ID
    async getChoferById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/choferes/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo chofer:', error);
            throw error;
        }
    }

    // Crear nuevo chofer
    async createChofer(choferData) {
        try {
            const response = await fetch(`${API_BASE_URL}/choferes`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(choferData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creando chofer:', error);
            throw error;
        }
    }

    // Actualizar chofer
    async updateChofer(id, choferData) {
        try {
            const response = await fetch(`${API_BASE_URL}/choferes/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(choferData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando chofer:', error);
            throw error;
        }
    }

    // Eliminar chofer
    async deleteChofer(id) {
        try {
            console.log('Eliminando chofer con ID:', id);
            const response = await fetch(`${API_BASE_URL}/choferes/${id}`, {
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
            console.error('Error eliminando chofer:', error);
            throw error;
        }
    }
}

export default new ChoferesService();
