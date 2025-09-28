import { executeQuery } from '../config/db.js';

export class AyudantesModel {
    // Obtener todos los ayudantes con conteo de rutas asignadas
    static async getAll() {
        const query = `
            SELECT 
                a.id,
                a.nombre,
                a.apellido,
                a.telefono,
                COUNT(r.id) as rutas_asignadas
            FROM ayudantes a
            LEFT JOIN rutas r ON a.id = r.ayudante_id
            GROUP BY a.id, a.nombre, a.apellido, a.telefono
            ORDER BY a.id ASC
        `;
        
        return await executeQuery(query);
    }

    // Obtener un ayudante por ID con conteo de rutas asignadas
    static async getById(id) {
        const query = `
            SELECT 
                a.id,
                a.nombre,
                a.apellido,
                a.telefono,
                COUNT(r.id) as rutas_asignadas
            FROM ayudantes a
            LEFT JOIN rutas r ON a.id = r.ayudante_id
            WHERE a.id = ?
            GROUP BY a.id, a.nombre, a.apellido, a.telefono
        `;
        
        return await executeQuery(query, [id]);
    }

    // Crear nuevo ayudante
    static async create(nombre, apellido, telefono) {
        const query = `
            INSERT INTO ayudantes (nombre, apellido, telefono)
            VALUES (?, ?, ?)
        `;
        
        return await executeQuery(query, [nombre, apellido, telefono || null]);
    }

    // Obtener ayudante por ID (sin JOIN para obtener datos básicos)
    static async getByIdBasic(id) {
        const query = `SELECT * FROM ayudantes WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Verificar si un ayudante existe
    static async exists(id) {
        const query = `SELECT id FROM ayudantes WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Actualizar ayudante
    static async update(id, nombre, apellido, telefono) {
        const query = `
            UPDATE ayudantes 
            SET nombre = ?, apellido = ?, telefono = ?
            WHERE id = ?
        `;
        
        return await executeQuery(query, [nombre, apellido, telefono, id]);
    }

    // Verificar si el ayudante tiene rutas asignadas
    static async hasAssignedRoutes(id) {
        const query = `SELECT id FROM rutas WHERE ayudante_id = ?`;
        return await executeQuery(query, [id]);
    }

    // Eliminar ayudante
    static async delete(id) {
        const query = `DELETE FROM ayudantes WHERE id = ?`;
        return await executeQuery(query, [id]);
    }
}




