import { executeQuery } from '../config/db.js';

// =========================
// MODELO PERMISOS - SOLO QUERIES A BD
// =========================

export class PermisosModel {
    // Asignar permiso a un rol
    static async assignPermissionToRole(rol_id, permiso_id) {
        const query = `INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)`;
        return await executeQuery(query, [rol_id, permiso_id]);
    }

    // Remover permiso de un rol
    static async removePermissionFromRole(rol_id, permiso_id) {
        const query = `DELETE FROM rol_permisos WHERE rol_id = ? AND permiso_id = ?`;
        return await executeQuery(query, [rol_id, permiso_id]);
    }

    // Obtener todos los permisos
    static async getAllPermissions() {
        const query = `SELECT * FROM permisos ORDER BY id`;
        return await executeQuery(query);
    }

    // Obtener permisos de un rol específico
    static async getPermissionsByRole(rol_id) {
        const query = `
            SELECT p.id, p.nombre_permiso, p.descripcion 
            FROM permisos p
            JOIN rol_permisos rp ON p.id = rp.permiso_id
            WHERE rp.rol_id = ?
        `;
        return await executeQuery(query, [rol_id]);
    }

    // Verificar si un rol tiene un permiso específico
    static async hasPermission(rol_id, permiso_id) {
        const query = `SELECT id FROM rol_permisos WHERE rol_id = ? AND permiso_id = ?`;
        const result = await executeQuery(query, [rol_id, permiso_id]);
        return result.length > 0;
    }

    // Limpiar todos los permisos de un rol
    static async clearRolePermissions(rol_id) {
        const query = `DELETE FROM rol_permisos WHERE rol_id = ?`;
        return await executeQuery(query, [rol_id]);
    }

    // Limpiar permisos duplicados de un rol
    static async cleanDuplicatePermissions(rol_id) {
        // Primero obtener los permisos únicos del rol
        const query = `
            SELECT DISTINCT permiso_id 
            FROM rol_permisos 
            WHERE rol_id = ?
        `;
        const uniquePermissions = await executeQuery(query, [rol_id]);
        
        // Limpiar todos los permisos del rol
        await this.clearRolePermissions(rol_id);
        
        // Reasignar solo los permisos únicos
        for (const perm of uniquePermissions) {
            await this.assignPermissionToRole(rol_id, perm.permiso_id);
        }
        
        return uniquePermissions.length;
    }

    // Obtener permisos de un usuario específico
    static async getUserPermissions(userId) {
        const query = `
            SELECT p.nombre_permiso, p.descripcion 
            FROM permisos p
            JOIN rol_permisos rp ON p.id = rp.permiso_id
            JOIN usuarios u ON rp.rol_id = u.rol_id
            WHERE u.id = ?
        `;
        return await executeQuery(query, [userId]);
    }
}
