import { executeQuery } from '../config/db.js';

// Obtener todos los permisos
export const getAllPermisos = async (req, res) => {
    try {
        const query = `
            SELECT id, nombre_permiso, descripcion 
            FROM permisos 
            ORDER BY nombre_permiso
        `;
        const permisos = await executeQuery(query);
        
        res.json({
            success: true,
            data: permisos
        });
    } catch (error) {
        console.error('Error obteniendo permisos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
