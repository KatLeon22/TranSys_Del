import { ChoferesModel } from '../models/ChoferesModel.js';

// Obtener todos los choferes
export const getAllChoferes = async (req, res) => {
    try {
        const choferes = await ChoferesModel.getAll();
        
        res.json({
            success: true,
            data: choferes,
            count: choferes.length
        });
        
    } catch (error) {
        console.error('Error obteniendo choferes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un chofer por ID
export const getChoferById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const chofer = await ChoferesModel.getById(id);
        
        if (chofer.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chofer no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: chofer[0]
        });
        
    } catch (error) {
        console.error('Error obteniendo chofer:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo chofer
export const createChofer = async (req, res) => {
    try {
        const { nombre, apellido, telefono, tipo_licencia, vencimiento } = req.body;
        
        // Validar datos requeridos
        if (!nombre || !apellido) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y apellido son requeridos'
            });
        }
        
        const result = await ChoferesModel.create(nombre, apellido, telefono, tipo_licencia, vencimiento);
        
        // Obtener el chofer creado
        const nuevoChofer = await ChoferesModel.getByIdBasic(result.insertId);
        
        res.status(201).json({
            success: true,
            message: 'Chofer creado exitosamente',
            data: nuevoChofer[0]
        });
        
    } catch (error) {
        console.error('Error creando chofer:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar chofer
export const updateChofer = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, tipo_licencia, vencimiento } = req.body;
        
        // Verificar que el chofer existe
        const existeChofer = await ChoferesModel.exists(id);
        
        if (existeChofer.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chofer no encontrado'
            });
        }
        
        await ChoferesModel.update(id, nombre, apellido, telefono, tipo_licencia, vencimiento);
        
        // Obtener el chofer actualizado
        const choferActualizado = await ChoferesModel.getByIdBasic(id);
        
        res.json({
            success: true,
            message: 'Chofer actualizado exitosamente',
            data: choferActualizado[0]
        });
        
    } catch (error) {
        console.error('Error actualizando chofer:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar chofer
export const deleteChofer = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el chofer existe
        const existeChofer = await ChoferesModel.exists(id);
        
        if (existeChofer.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chofer no encontrado'
            });
        }
        
        // Verificar si el chofer tiene rutas asignadas
        const rutasAsignadas = await ChoferesModel.hasAssignedRoutes(id);
        
        if (rutasAsignadas.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el chofer porque tiene rutas asignadas'
            });
        }
        
        await ChoferesModel.delete(id);
        
        res.json({
            success: true,
            message: 'Chofer eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error eliminando chofer:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
