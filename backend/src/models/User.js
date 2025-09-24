import { executeQuery } from '../config/db.js';

// =========================
// MODELO USER - SOLO QUERIES A BD
// =========================

export class User {
    // Buscar usuario por username
    static async findByUsername(username) {
        const query = `
            SELECT u.*, r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.username = ?
        `;
        return await executeQuery(query, [username]);
    }

    // Buscar usuario por ID
    static async findById(id) {
        const query = `
            SELECT u.*, r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.id = ?
        `;
        return await executeQuery(query, [id]);
    }

    // Crear nuevo usuario
    static async create(username, password, rol_id) {
        const query = `
            INSERT INTO usuarios (username, password, rol_id) 
            VALUES (?, ?, ?)
        `;
        return await executeQuery(query, [username, password, rol_id]);
    }

    // Actualizar usuario
    static async update(id, userData) {
        const query = `
            UPDATE usuarios 
            SET username = ?, password = ?, rol_id = ?
            WHERE id = ?
        `;
        return await executeQuery(query, [userData.username, userData.password, userData.rol_id, id]);
    }

    // Eliminar usuario
    static async delete(id) {
        const query = `DELETE FROM usuarios WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Obtener permisos del usuario
    static async getPermissions(rol_id) {
        const query = `
            SELECT p.nombre_permiso, p.descripcion 
            FROM permisos p
            JOIN rol_permisos rp ON p.id = rp.permiso_id
            WHERE rp.rol_id = ?
        `;
        return await executeQuery(query, [rol_id]);
    }

    // Obtener todos los usuarios
    static async findAll() {
        const query = `
            SELECT u.*, r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id
        `;
        return await executeQuery(query);
    }
}
