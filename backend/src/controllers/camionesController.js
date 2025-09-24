import { CamionesModel } from '../models/CamionesModel.js';

// Obtener todos los camiones
export const getAllCamiones = async (req, res) => {
    try {
        const camiones = await CamionesModel.getAll();
        
        res.json({
            success: true,
            data: camiones,
            count: camiones.length
        });
        
    } catch (error) {
        console.error('Error obteniendo camiones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un camión por ID
export const getCamionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const camion = await CamionesModel.getById(id);
        
        if (camion.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Camión no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: camion[0]
        });
        
    } catch (error) {
        console.error('Error obteniendo camión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo camión
export const createCamion = async (req, res) => {
    try {
        const { placa, marca, modelo, color, tipo, tarjeta_circulacion } = req.body;
        
        // Validar datos requeridos
        if (!placa) {
            return res.status(400).json({
                success: false,
                message: 'La placa es requerida'
            });
        }
        
        // Verificar que la placa no exista
        const placaExistente = await CamionesModel.existsByPlaca(placa);
        
        if (placaExistente.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un camión con esta placa'
            });
        }
        
        const result = await CamionesModel.create(placa, marca, modelo, color, tipo, tarjeta_circulacion);
        
        // Obtener el camión creado
        const nuevoCamion = await CamionesModel.getByIdBasic(result.insertId);
        
        res.status(201).json({
            success: true,
            message: 'Camión creado exitosamente',
            data: nuevoCamion[0]
        });
        
    } catch (error) {
        console.error('Error creando camión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar camión
export const updateCamion = async (req, res) => {
    try {
        const { id } = req.params;
        const { placa, marca, modelo, color, tipo, tarjeta_circulacion } = req.body;
        
        // Verificar que el camión existe
        const existeCamion = await CamionesModel.exists(id);
        
        if (existeCamion.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Camión no encontrado'
            });
        }
        
        // Si se cambia la placa, verificar que no exista otra con la misma placa
        if (placa) {
            const placaExistente = await CamionesModel.existsByPlacaExcludingId(placa, id);
            
            if (placaExistente.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe otro camión con esta placa'
                });
            }
        }
        
        await CamionesModel.update(id, placa, marca, modelo, color, tipo, tarjeta_circulacion);
        
        // Obtener el camión actualizado
        const camionActualizado = await CamionesModel.getByIdBasic(id);
        
        res.json({
            success: true,
            message: 'Camión actualizado exitosamente',
            data: camionActualizado[0]
        });
        
    } catch (error) {
        console.error('Error actualizando camión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar camión
export const deleteCamion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el camión existe
        const existeCamion = await CamionesModel.exists(id);
        
        if (existeCamion.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Camión no encontrado'
            });
        }
        
        // Verificar si el camión tiene rutas asignadas
        const rutasAsignadas = await CamionesModel.hasAssignedRoutes(id);
        
        if (rutasAsignadas.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el camión porque tiene rutas asignadas'
            });
        }
        
        await CamionesModel.delete(id);
        
        res.json({
            success: true,
            message: 'Camión eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error eliminando camión:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
