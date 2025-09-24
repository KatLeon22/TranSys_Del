import { ClientesModel } from '../models/ClientesModel.js';

// Obtener todos los clientes
export const getAllClientes = async (req, res) => {
    try {
        const clientes = await ClientesModel.getAll();
        
        res.json({
            success: true,
            data: clientes,
            count: clientes.length
        });
        
    } catch (error) {
        console.error('Error obteniendo clientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cliente = await ClientesModel.getById(id);
        
        if (cliente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: cliente[0]
        });
        
    } catch (error) {
        console.error('Error obteniendo cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo cliente
export const createCliente = async (req, res) => {
    try {
        const { nombre, apellido, telefono } = req.body;
        
        // Validar datos requeridos
        if (!nombre || !apellido) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y apellido son requeridos'
            });
        }
        
        const result = await ClientesModel.create(nombre, apellido, telefono);
        
        // Obtener el cliente creado
        const nuevoCliente = await ClientesModel.getByIdBasic(result.insertId);
        
        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente[0]
        });
        
    } catch (error) {
        console.error('Error creando cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono } = req.body;
        
        // Verificar que el cliente existe
        const existeCliente = await ClientesModel.exists(id);
        
        if (existeCliente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        
        await ClientesModel.update(id, nombre, apellido, telefono);
        
        // Obtener el cliente actualizado
        const clienteActualizado = await ClientesModel.getByIdBasic(id);
        
        res.json({
            success: true,
            message: 'Cliente actualizado exitosamente',
            data: clienteActualizado[0]
        });
        
    } catch (error) {
        console.error('Error actualizando cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el cliente existe
        const existeCliente = await ClientesModel.exists(id);
        
        if (existeCliente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        
        // Verificar si el cliente tiene rutas asignadas
        const rutasAsignadas = await ClientesModel.hasAssignedRoutes(id);
        
        if (rutasAsignadas.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el cliente porque tiene rutas asignadas'
            });
        }
        
        await ClientesModel.delete(id);
        
        res.json({
            success: true,
            message: 'Cliente eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error eliminando cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
