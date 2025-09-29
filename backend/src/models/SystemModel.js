import { executeQuery } from '../config/db.js';

// =========================
// MODELO SISTEMA - SOLO QUERIES A BD
// =========================

export class SystemModel {
    // Probar conexión a la base de datos
    static async testConnection() {
        const query = `SELECT 1 as test`;
        return await executeQuery(query);
    }

    // Obtener información de la base de datos
    static async getDatabaseInfo() {
        const query = `SELECT DATABASE() as database_name`;
        return await executeQuery(query);
    }

    // Obtener estadísticas de la base de datos
    static async getDatabaseStats() {
        const query = `
            SELECT 
                TABLE_NAME,
                TABLE_ROWS,
                DATA_LENGTH,
                INDEX_LENGTH
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE()
        `;
        return await executeQuery(query);
    }
}
