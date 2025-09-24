import { AyudantesModel } from '../models/AyudantesModel.js';

// Obtener todos los ayudantes
export const getAllAyudantes = async (req, res) => {
    try {
        const ayudantes = await AyudantesModel.getAll();
        
        res.json({
            success: true,
            data: ayudantes,
            count: ayudantes.length
        });
        
    } catch (error) {
        console.error('Error obteniendo ayudantes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un ayudante por ID
export const getAyudanteById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ayudante = await AyudantesModel.getById(id);
        
        if (ayudante.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ayudante no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: ayudante[0]
        });
        
    } catch (error) {
        console.error('Error obteniendo ayudante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo ayudante
export const createAyudante = async (req, res) => {
    try {
        const { nombre, apellido, telefono } = req.body;
        
        // Validar datos requeridos
        if (!nombre || !apellido) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y apellido son requeridos'
            });
        }
        
        const result = await AyudantesModel.create(nombre, apellido, telefono);
        
        // Obtener el ayudante creado
        const nuevoAyudante = await AyudantesModel.getByIdBasic(result.insertId);
        
        res.status(201).json({
            success: true,
            message: 'Ayudante creado exitosamente',
            data: nuevoAyudante[0]
        });
        
    } catch (error) {
        console.error('Error creando ayudante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar ayudante
export const updateAyudante = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono } = req.body;
        
        // Verificar que el ayudante existe
        const existeAyudante = await AyudantesModel.exists(id);
        
        if (existeAyudante.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ayudante no encontrado'
            });
        }
        
        await AyudantesModel.update(id, nombre, apellido, telefono);
        
        // Obtener el ayudante actualizado
        const ayudanteActualizado = await AyudantesModel.getByIdBasic(id);
        
        res.json({
            success: true,
            message: 'Ayudante actualizado exitosamente',
            data: ayudanteActualizado[0]
        });
        
    } catch (error) {
        console.error('Error actualizando ayudante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar ayudante
export const deleteAyudante = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el ayudante existe
        const existeAyudante = await AyudantesModel.exists(id);
        
        if (existeAyudante.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ayudante no encontrado'
            });
        }
        
        // Verificar si el ayudante tiene rutas asignadas
        const rutasAsignadas = await AyudantesModel.hasAssignedRoutes(id);
        
        if (rutasAsignadas.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el ayudante porque tiene rutas asignadas'
            });
        }
        
        await AyudantesModel.delete(id);
        
        res.json({
            success: true,
            message: 'Ayudante eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error eliminando ayudante:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
