import { PilotoModel } from '../models/PilotoModel.js';

// Obtener rutas de un piloto específico
export const getRutasByPiloto = async (req, res) => {
    try {
        const pilotoId = req.user.id; // ID del usuario logueado
        
        const rutas = await PilotoModel.getRutasByPiloto(pilotoId);
        
        res.json({
            success: true,
            data: rutas,
            count: rutas.length
        });
        
    } catch (error) {
        console.error('Error obteniendo rutas del piloto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar estado de una ruta (solo pilotos)
export const updateEstadoRuta = async (req, res) => {
    try {
        const { rutaId } = req.params;
        const { nuevoEstado, comentario } = req.body;
        const pilotoId = req.user.id;
        
        // Verificar que la ruta pertenece al piloto
        const ruta = await PilotoModel.verificarRutaPiloto(rutaId, pilotoId);
        
        if (ruta.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar esta ruta'
            });
        }
        
        const estadoAnterior = ruta[0].estado_actual;
        
        // Actualizar el estado de la ruta
        await PilotoModel.updateEstadoRuta(rutaId, nuevoEstado, comentario);
        
        // Registrar en el historial
        await PilotoModel.registrarHistorial(rutaId, pilotoId, estadoAnterior, nuevoEstado, comentario);
        
        res.json({
            success: true,
            message: 'Estado actualizado correctamente',
            data: {
                rutaId,
                estadoAnterior,
                nuevoEstado,
                comentario
            }
        });
        
    } catch (error) {
        console.error('Error actualizando estado de ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener historial de una ruta específica
export const getHistorialRuta = async (req, res) => {
    try {
        const { rutaId } = req.params;
        const pilotoId = req.user.id;
        
        // Verificar que la ruta pertenece al piloto
        const ruta = await PilotoModel.verificarRutaPiloto(rutaId, pilotoId);
        
        if (ruta.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta ruta'
            });
        }
        
        // Obtener historial
        const historial = await PilotoModel.getHistorialRuta(rutaId);
        
        res.json({
            success: true,
            data: historial
        });
        
    } catch (error) {
        console.error('Error obteniendo historial de ruta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
