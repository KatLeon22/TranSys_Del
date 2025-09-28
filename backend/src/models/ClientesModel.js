import { executeQuery } from '../config/db.js';

export class ClientesModel {
    // Obtener todos los clientes con conteo de rutas asignadas
    static async getAll() {
        const query = `
            SELECT 
                c.id,
                c.nombre,
                c.apellido,
                c.telefono,
                COUNT(r.id) as rutas_asignadas
            FROM clientes c
            LEFT JOIN rutas r ON c.id = r.cliente_id
            GROUP BY c.id, c.nombre, c.apellido, c.telefono
            ORDER BY c.id ASC
        `;
        
        return await executeQuery(query);
    }

    // Obtener un cliente por ID con conteo de rutas asignadas
    static async getById(id) {
        const query = `
            SELECT 
                c.id,
                c.nombre,
                c.apellido,
                c.telefono,
                COUNT(r.id) as rutas_asignadas
            FROM clientes c
            LEFT JOIN rutas r ON c.id = r.cliente_id
            WHERE c.id = ?
            GROUP BY c.id, c.nombre, c.apellido, c.telefono
        `;
        
        return await executeQuery(query, [id]);
    }

    // Crear nuevo cliente
    static async create(nombre, apellido, telefono) {
        const query = `
            INSERT INTO clientes (nombre, apellido, telefono)
            VALUES (?, ?, ?)
        `;
        
        return await executeQuery(query, [nombre, apellido, telefono]);
    }

    // Obtener cliente por ID (sin JOIN para obtener datos básicos)
    static async getByIdBasic(id) {
        const query = `SELECT * FROM clientes WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Verificar si un cliente existe
    static async exists(id) {
        const query = `SELECT id FROM clientes WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Actualizar cliente
    static async update(id, nombre, apellido, telefono) {
        const query = `
            UPDATE clientes 
            SET nombre = ?, apellido = ?, telefono = ?
            WHERE id = ?
        `;
        
        return await executeQuery(query, [nombre, apellido, telefono, id]);
    }

    // Verificar si el cliente tiene rutas asignadas
    static async hasAssignedRoutes(id) {
        const query = `SELECT id FROM rutas WHERE cliente_id = ?`;
        return await executeQuery(query, [id]);
    }

    // Eliminar cliente
    static async delete(id) {
        const query = `DELETE FROM clientes WHERE id = ?`;
        return await executeQuery(query, [id]);
    }
}




