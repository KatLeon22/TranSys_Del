import { PermisosModel } from '../models/PermisosModel.js';

// =========================
// CONTROLADOR PERMISOS - SOLO LÓGICA DE NEGOCIO
// =========================

// Obtener todos los permisos
export const getAllPermisos = async (req, res) => {
    try {
        const permisos = await PermisosModel.getAllPermissions();
        
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

// Limpiar permisos duplicados de un rol
export const cleanDuplicatePermissions = async (req, res) => {
    try {
        const { rol_id } = req.params;
        
        console.log('🧹 Limpiando permisos duplicados para rol:', rol_id);
        
        // Obtener permisos actuales antes de limpiar
        const permisosAntes = await PermisosModel.getPermissionsByRole(rol_id);
        console.log('📊 Permisos antes de limpiar:', permisosAntes.length);
        
        // Limpiar permisos duplicados
        const permisosUnicos = await PermisosModel.cleanDuplicatePermissions(rol_id);
        
        // Obtener permisos después de limpiar
        const permisosDespues = await PermisosModel.getPermissionsByRole(rol_id);
        
        res.json({
            success: true,
            message: 'Permisos duplicados limpiados exitosamente',
            data: {
                rol_id: parseInt(rol_id),
                permisos_antes: permisosAntes.length,
                permisos_despues: permisosDespues.length,
                permisos_unicos: permisosUnicos,
                permisos_limpiados: permisosAntes.length - permisosDespues.length
            }
        });
        
    } catch (error) {
        console.error('Error limpiando permisos duplicados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener permisos de un usuario específico
export const getUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const permisos = await PermisosModel.getUserPermissions(userId);
        
        res.json({
            success: true,
            data: {
                userId: parseInt(userId),
                permisos: permisos,
                count: permisos.length
            }
        });
        
    } catch (error) {
        console.error('Error obteniendo permisos del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
