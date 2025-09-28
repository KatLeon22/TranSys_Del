import { PilotoModel } from '../models/PilotoModel.js';
import { executeQuery } from '../config/db.js';

// Obtener todos los pilotos (para asignación de usuarios)
export const getAllPilotos = async (req, res) => {
    try {
        const query = `
            SELECT id, nombre, apellido, telefono, tipo_licencia, vencimiento
            FROM pilotos 
            ORDER BY nombre, apellido
        `;
        const pilotos = await executeQuery(query);
        
        res.json({
            success: true,
            data: pilotos
        });
    } catch (error) {
        console.error('Error obteniendo pilotos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener rutas de un piloto específico
export const getRutasByPiloto = async (req, res) => {
    try {
        const userId = req.user?.id; // ID del usuario logueado
        const pilotoId = req.user?.piloto_id; // ID del piloto asociado
        
        if (!pilotoId) {
            return res.status(400).json({
                success: false,
                message: 'Usuario no tiene piloto asociado'
            });
        }
        
        // Obtener fecha actual
        const hoy = new Date().toISOString().split('T')[0];
        
        // Consulta directa usando el piloto_id y filtrando por fecha actual
        const query = `
            SELECT 
                r.id,
                r.no_ruta,
                r.servicio,
                r.mercaderia,
                r.combustible,
                r.origen,
                r.destino,
                r.fecha,
                r.hora,
                r.precio,
                r.comentario,
                r.estado,
                c.nombre as cliente_nombre,
                c.apellido as cliente_apellido,
                c.telefono as cliente_telefono,
                cam.placa as camion_placa,
                cam.marca as camion_marca,
                cam.modelo as camion_modelo,
                a.nombre as ayudante_nombre,
                a.apellido as ayudante_apellido
            FROM rutas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN camiones cam ON r.camion_id = cam.id
            LEFT JOIN ayudantes a ON r.ayudante_id = a.id
            WHERE r.chofer_id = ? AND r.fecha = ?
            ORDER BY r.hora ASC
        `;
        
        const rutas = await executeQuery(query, [pilotoId, hoy]);
        
        res.json({
            success: true,
            data: rutas,
            count: rutas.length
        });
        
    } catch (error) {
        console.error('❌ Error obteniendo rutas del piloto:', error);
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
