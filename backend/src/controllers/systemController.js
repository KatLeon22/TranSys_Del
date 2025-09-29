import { SystemModel } from '../models/SystemModel.js';

// =========================
// CONTROLADOR SISTEMA - SOLO LÓGICA DE NEGOCIO
// =========================

// Probar conexión a la base de datos
export const testDatabase = async (req, res) => {
    try {
        const result = await SystemModel.testConnection();
        const dbInfo = await SystemModel.getDatabaseInfo();
        
        res.json({ 
            success: true, 
            message: "Conexión a la base de datos exitosa",
            database: dbInfo[0]?.database_name || process.env.DB_NAME || 'transporte2'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error al conectar con la base de datos",
            error: error.message 
        });
    }
};

// Obtener información del sistema
export const getSystemInfo = async (req, res) => {
    try {
        const dbInfo = await SystemModel.getDatabaseInfo();
        const stats = await SystemModel.getDatabaseStats();
        
        res.json({
            success: true,
            data: {
                database: dbInfo[0]?.database_name || process.env.DB_NAME || 'transporte2',
                tables: stats.length,
                environment: process.env.NODE_ENV || 'development'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error obteniendo información del sistema",
            error: error.message
        });
    }
};
