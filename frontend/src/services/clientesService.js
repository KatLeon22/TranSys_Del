const API_BASE_URL = '/api';

class ClientesService {
    // Obtener token del localStorage
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Obtener todos los clientes
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

    // Obtener un cliente por ID
    async getClienteById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo cliente:', error);
            throw error;
        }
    }

    // Crear nuevo cliente
    async createCliente(clienteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(clienteData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creando cliente:', error);
            throw error;
        }
    }

    // Actualizar cliente
    async updateCliente(id, clienteData) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(clienteData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error actualizando cliente:', error);
            throw error;
        }
    }

    // Eliminar cliente
    async deleteCliente(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error eliminando cliente:', error);
            throw error;
        }
    }
}

export default new ClientesService();
