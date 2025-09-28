import { executeQuery } from '../config/db.js';

export class PilotoModel {
    // Obtener rutas de un piloto específico
    static async getRutasByPiloto(userId) {
        try {
            console.log('🔍 Obteniendo rutas para usuario ID:', userId);
            
            // Primero verificar si el usuario tiene piloto_id
            const userQuery = `SELECT id, username, piloto_id FROM usuarios WHERE id = ?`;
            const [user] = await executeQuery(userQuery, [userId]);
            console.log('👤 Usuario encontrado:', user);
            
            if (!user || !user.piloto_id) {
                console.log('❌ Usuario no tiene piloto_id asignado');
                return [];
            }
            
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
                WHERE r.chofer_id = ?
                ORDER BY r.fecha DESC, r.hora DESC
            `;
            
            console.log('📝 Ejecutando consulta con piloto_id:', user.piloto_id);
            const result = await executeQuery(query, [user.piloto_id]);
            console.log('📊 Rutas encontradas:', result.length);
            
            return result;
        } catch (error) {
            console.error('❌ Error en getRutasByPiloto:', error);
            throw error;
        }
    }

    // Verificar que la ruta pertenece al piloto
    static async verificarRutaPiloto(rutaId, pilotoId) {
        const query = `
            SELECT r.id, r.estado as estado_actual
            FROM rutas r
            LEFT JOIN pilotos p ON r.chofer_id = p.id
            LEFT JOIN usuarios u ON p.id = u.piloto_id
            WHERE r.id = ? AND u.id = ?
        `;
        
        return await executeQuery(query, [rutaId, pilotoId]);
    }

    // Actualizar estado de una ruta
    static async updateEstadoRuta(rutaId, nuevoEstado, comentario) {
        const query = `
            UPDATE rutas 
            SET estado = ?, comentario = ?
            WHERE id = ?
        `;
        
        return await executeQuery(query, [nuevoEstado, comentario, rutaId]);
    }

    // Registrar cambio en el historial
    static async registrarHistorial(rutaId, pilotoId, estadoAnterior, estadoNuevo, comentario) {
        const query = `
            INSERT INTO rutas_historial 
            (ruta_id, usuario_id, estado_anterior, estado_nuevo, comentario)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        return await executeQuery(query, [rutaId, pilotoId, estadoAnterior, estadoNuevo, comentario]);
    }

    // Obtener historial de una ruta específica
    static async getHistorialRuta(rutaId) {
        const query = `
            SELECT 
                rh.estado_anterior,
                rh.estado_nuevo,
                rh.comentario,
                rh.fecha,
                u.username
            FROM rutas_historial rh
            LEFT JOIN usuarios u ON rh.usuario_id = u.id
            WHERE rh.ruta_id = ?
            ORDER BY rh.fecha DESC
        `;
        
        return await executeQuery(query, [rutaId]);
    }
}




