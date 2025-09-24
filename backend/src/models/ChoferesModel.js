import { executeQuery } from '../config/db.js';

export class ChoferesModel {
    // Obtener todos los choferes con información de usuario y rol
    static async getAll() {
        const query = `
            SELECT 
                p.id,
                p.nombre,
                p.apellido,
                p.telefono,
                p.tipo_licencia,
                p.vencimiento,
                u.username,
                u.rol_id,
                r.nombre as rol_nombre
            FROM pilotos p
            LEFT JOIN usuarios u ON p.id = u.id
            LEFT JOIN roles r ON u.rol_id = r.id
            ORDER BY p.id ASC
        `;
        
        return await executeQuery(query);
    }

    // Obtener un chofer por ID con información de usuario y rol
    static async getById(id) {
        const query = `
            SELECT 
                p.id,
                p.nombre,
                p.apellido,
                p.telefono,
                p.tipo_licencia,
                p.vencimiento,
                u.username,
                u.rol_id,
                r.nombre as rol_nombre
            FROM pilotos p
            LEFT JOIN usuarios u ON p.id = u.id
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE p.id = ?
        `;
        
        return await executeQuery(query, [id]);
    }

    // Crear nuevo chofer
    static async create(nombre, apellido, telefono, tipo_licencia, vencimiento) {
        const query = `
            INSERT INTO pilotos (nombre, apellido, telefono, tipo_licencia, vencimiento)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        return await executeQuery(query, [nombre, apellido, telefono, tipo_licencia, vencimiento]);
    }

    // Obtener chofer por ID (sin JOIN para obtener datos básicos)
    static async getByIdBasic(id) {
        const query = `SELECT * FROM pilotos WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Verificar si un chofer existe
    static async exists(id) {
        const query = `SELECT id FROM pilotos WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Actualizar chofer
    static async update(id, nombre, apellido, telefono, tipo_licencia, vencimiento) {
        const query = `
            UPDATE pilotos 
            SET nombre = ?, apellido = ?, telefono = ?, tipo_licencia = ?, vencimiento = ?
            WHERE id = ?
        `;
        
        return await executeQuery(query, [nombre, apellido, telefono, tipo_licencia, vencimiento, id]);
    }

    // Verificar si el chofer tiene rutas asignadas
    static async hasAssignedRoutes(id) {
        const query = `SELECT id FROM rutas WHERE chofer_id = ?`;
        return await executeQuery(query, [id]);
    }

    // Eliminar chofer
    static async delete(id) {
        const query = `DELETE FROM pilotos WHERE id = ?`;
        return await executeQuery(query, [id]);
    }
}



