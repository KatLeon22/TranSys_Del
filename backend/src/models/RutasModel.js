import { executeQuery } from '../config/db.js';

export class RutasModel {
    // Obtener el siguiente número de ruta
    static async getNextRutaNumber() {
        const query = `
            SELECT no_ruta 
            FROM rutas 
            WHERE no_ruta LIKE 'RUTA%' 
            ORDER BY CAST(SUBSTRING(no_ruta, 5) AS UNSIGNED) DESC 
            LIMIT 1
        `;
        
        return await executeQuery(query);
    }

    // Obtener todas las rutas (para administradores)
    static async getAll() {
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
                p.nombre as piloto_nombre,
                p.apellido as piloto_apellido,
                a.nombre as ayudante_nombre,
                a.apellido as ayudante_apellido
            FROM rutas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN camiones cam ON r.camion_id = cam.id
            LEFT JOIN pilotos p ON r.chofer_id = p.id
            LEFT JOIN ayudantes a ON r.ayudante_id = a.id
            ORDER BY r.id ASC
        `;
        
        return await executeQuery(query);
    }

    // Obtener una ruta por ID
    static async getById(id) {
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
                r.cliente_id,
                r.camion_id,
                r.chofer_id,
                r.ayudante_id,
                c.nombre as cliente_nombre,
                c.apellido as cliente_apellido,
                c.telefono as cliente_telefono,
                cam.placa as camion_placa,
                cam.marca as camion_marca,
                cam.modelo as camion_modelo,
                p.nombre as piloto_nombre,
                p.apellido as piloto_apellido,
                a.nombre as ayudante_nombre,
                a.apellido as ayudante_apellido
            FROM rutas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN camiones cam ON r.camion_id = cam.id
            LEFT JOIN pilotos p ON r.chofer_id = p.id
            LEFT JOIN ayudantes a ON r.ayudante_id = a.id
            WHERE r.id = ?
        `;
        
        return await executeQuery(query, [id]);
    }

    // Crear nueva ruta
    static async create(no_ruta, cliente_id, servicio, mercaderia, camion_id, combustible, origen, destino, chofer_id, ayudante_id, fecha, hora, precio, comentario) {
        console.log('Parámetros para crear ruta:', {
            no_ruta, cliente_id, servicio, mercaderia, camion_id, 
            combustible, origen, destino, chofer_id, ayudante_id, 
            fecha, hora, precio, comentario
        });
        
        const query = `
            INSERT INTO rutas (
                no_ruta, cliente_id, servicio, mercaderia, camion_id, 
                combustible, origen, destino, chofer_id, ayudante_id, 
                fecha, hora, precio, comentario, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')
        `;
        
        const params = [
            no_ruta, cliente_id, servicio, mercaderia, camion_id, 
            combustible, origen, destino, chofer_id, ayudante_id, 
            fecha, hora, precio, comentario
        ];
        
        console.log('Parámetros SQL:', params);
        
        return await executeQuery(query, params);
    }

    // Obtener ruta creada con información completa
    static async getCreatedRuta(id) {
        const query = `
            SELECT 
                r.*,
                c.nombre as cliente_nombre,
                c.apellido as cliente_apellido,
                cam.placa as camion_placa,
                p.nombre as piloto_nombre,
                p.apellido as piloto_apellido
            FROM rutas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN camiones cam ON r.camion_id = cam.id
            LEFT JOIN pilotos p ON r.chofer_id = p.id
            WHERE r.id = ?
        `;
        
        return await executeQuery(query, [id]);
    }

    // Verificar si una ruta existe
    static async exists(id) {
        const query = `SELECT id FROM rutas WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Verificar si existe una ruta con el mismo número
    static async existsByNoRuta(no_ruta) {
        const query = `SELECT id FROM rutas WHERE no_ruta = ?`;
        return await executeQuery(query, [no_ruta]);
    }

    // Verificar si existe otra ruta con el mismo número (excluyendo un ID específico)
    static async existsByNoRutaExcludingId(no_ruta, excludeId) {
        const query = `SELECT id FROM rutas WHERE no_ruta = ? AND id != ?`;
        return await executeQuery(query, [no_ruta, excludeId]);
    }

    // Actualizar ruta
    static async update(id, no_ruta, cliente_id, servicio, mercaderia, camion_id, combustible, origen, destino, chofer_id, ayudante_id, fecha, hora, precio, comentario, estado) {
        const query = `
            UPDATE rutas 
            SET no_ruta = ?, cliente_id = ?, servicio = ?, mercaderia = ?, 
                camion_id = ?, combustible = ?, origen = ?, destino = ?, 
                chofer_id = ?, ayudante_id = ?, fecha = ?, hora = ?, 
                precio = ?, comentario = ?, estado = ?
            WHERE id = ?
        `;
        
        return await executeQuery(query, [
            no_ruta, cliente_id, servicio, mercaderia, camion_id, 
            combustible, origen, destino, chofer_id, ayudante_id, 
            fecha, hora, precio, comentario, estado, id
        ]);
    }

    // Obtener ruta actualizada con información completa
    static async getUpdatedRuta(id) {
        const query = `
            SELECT 
                r.*,
                c.nombre as cliente_nombre,
                c.apellido as cliente_apellido,
                cam.placa as camion_placa,
                p.nombre as piloto_nombre,
                p.apellido as piloto_apellido
            FROM rutas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN camiones cam ON r.camion_id = cam.id
            LEFT JOIN pilotos p ON r.chofer_id = p.id
            WHERE r.id = ?
        `;
        
        return await executeQuery(query, [id]);
    }

    // Eliminar historial de ruta
    static async deleteHistorial(ruta_id) {
        const query = `DELETE FROM rutas_historial WHERE ruta_id = ?`;
        return await executeQuery(query, [ruta_id]);
    }

    // Eliminar ruta
    static async delete(id) {
        const query = `DELETE FROM rutas WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Obtener rutas recientes para el dashboard
    static async getRutasRecientes() {
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
                r.estado,
                r.comentario,
                c.nombre as cliente_nombre,
                c.apellido as cliente_apellido,
                p.nombre as piloto_nombre,
                p.apellido as piloto_apellido,
                a.nombre as ayudante_nombre,
                a.apellido as ayudante_apellido,
                cam.placa as camion_placa
            FROM rutas r
            LEFT JOIN clientes c ON r.cliente_id = c.id
            LEFT JOIN pilotos p ON r.chofer_id = p.id
            LEFT JOIN ayudantes a ON r.ayudante_id = a.id
            LEFT JOIN camiones cam ON r.camion_id = cam.id
            ORDER BY r.fecha DESC, r.hora DESC
            LIMIT 20
        `;
        
        return await executeQuery(query);
    }
}




