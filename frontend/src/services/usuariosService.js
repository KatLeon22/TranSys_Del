import api from './api';

export const usuariosService = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario
  create: async (userData) => {
    try {
      const response = await api.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  delete: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  // Cambiar estado del usuario
  changeStatus: async (id, estado) => {
    try {
      const response = await api.patch(`/usuarios/${id}/status`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      throw error;
    }
  }
};
