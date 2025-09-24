import { executeQuery } from '../config/db.js';

export class CamionesModel {
    // Obtener todos los camiones con conteo de rutas asignadas
    static async getAll() {
        const query = `
            SELECT 
                c.id,
                c.placa,
                c.marca,
                c.modelo,
                c.color,
                c.tipo,
                c.tarjeta_circulacion,
                COUNT(r.id) as rutas_asignadas
            FROM camiones c
            LEFT JOIN rutas r ON c.id = r.camion_id
            GROUP BY c.id, c.placa, c.marca, c.modelo, c.color, c.tipo, c.tarjeta_circulacion
            ORDER BY c.id ASC
        `;
        
        return await executeQuery(query);
    }

    // Obtener un camión por ID con conteo de rutas asignadas
    static async getById(id) {
        const query = `
            SELECT 
                c.id,
                c.placa,
                c.marca,
                c.modelo,
                c.color,
                c.tipo,
                c.tarjeta_circulacion,
                COUNT(r.id) as rutas_asignadas
            FROM camiones c
            LEFT JOIN rutas r ON c.id = r.camion_id
            WHERE c.id = ?
            GROUP BY c.id, c.placa, c.marca, c.modelo, c.color, c.tipo, c.tarjeta_circulacion
        `;
        
        return await executeQuery(query, [id]);
    }

    // Crear nuevo camión
    static async create(placa, marca, modelo, color, tipo, tarjeta_circulacion) {
        const query = `
            INSERT INTO camiones (placa, marca, modelo, color, tipo, tarjeta_circulacion)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        return await executeQuery(query, [placa, marca, modelo, color, tipo, tarjeta_circulacion]);
    }

    // Obtener camión por ID (sin JOIN para obtener datos básicos)
    static async getByIdBasic(id) {
        const query = `SELECT * FROM camiones WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Verificar si un camión existe
    static async exists(id) {
        const query = `SELECT id FROM camiones WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Verificar si existe un camión con la misma placa
    static async existsByPlaca(placa) {
        const query = `SELECT id FROM camiones WHERE placa = ?`;
        return await executeQuery(query, [placa]);
    }

    // Verificar si existe otro camión con la misma placa (excluyendo un ID específico)
    static async existsByPlacaExcludingId(placa, excludeId) {
        const query = `SELECT id FROM camiones WHERE placa = ? AND id != ?`;
        return await executeQuery(query, [placa, excludeId]);
    }

    // Actualizar camión
    static async update(id, placa, marca, modelo, color, tipo, tarjeta_circulacion) {
        const query = `
            UPDATE camiones 
            SET placa = ?, marca = ?, modelo = ?, color = ?, tipo = ?, tarjeta_circulacion = ?
            WHERE id = ?
        `;
        
        return await executeQuery(query, [placa, marca, modelo, color, tipo, tarjeta_circulacion, id]);
    }

    // Verificar si el camión tiene rutas asignadas
    static async hasAssignedRoutes(id) {
        const query = `SELECT id FROM rutas WHERE camion_id = ?`;
        return await executeQuery(query, [id]);
    }

    // Eliminar camión
    static async delete(id) {
        const query = `DELETE FROM camiones WHERE id = ?`;
        return await executeQuery(query, [id]);
    }
}



