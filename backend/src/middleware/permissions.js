import { executeQuery } from '../config/db.js';

// Middleware para verificar permisos
export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Verificar si el usuario está autenticado
            if (!req.user || !req.user.id) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Usuario no autenticado' 
                });
            }

            // Obtener el rol del usuario
            const userRole = await executeQuery(
                'SELECT rol_id FROM usuarios WHERE id = ?',
                [req.user.id]
            );

            if (!userRole || userRole.length === 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Usuario no encontrado' 
                });
            }

            const rolId = userRole[0].rol_id;

            // Verificar si el usuario tiene el permiso requerido
            const hasPermission = await executeQuery(
                `SELECT COUNT(*) as count 
                 FROM rol_permisos rp 
                 JOIN permisos p ON rp.permiso_id = p.id 
                 WHERE rp.rol_id = ? AND p.nombre_permiso = ?`,
                [rolId, requiredPermission]
            );

            if (hasPermission[0].count === 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: `No tienes permisos para realizar esta acción. Se requiere: ${requiredPermission}` 
                });
            }

            // Si tiene el permiso, continuar
            next();
        } catch (error) {
            console.error('Error verificando permisos:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor' 
            });
        }
    };
};

// Middleware para verificar múltiples permisos (OR)
export const checkAnyPermission = (permissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Usuario no autenticado' 
                });
            }

            const userRole = await executeQuery(
                'SELECT rol_id FROM usuarios WHERE id = ?',
                [req.user.id]
            );

            if (!userRole || userRole.length === 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Usuario no encontrado' 
                });
            }

            const rolId = userRole[0].rol_id;

            // Verificar si el usuario tiene al menos uno de los permisos
            const permissionChecks = permissions.map(permission => 
                executeQuery(
                    `SELECT COUNT(*) as count 
                     FROM rol_permisos rp 
                     JOIN permisos p ON rp.permiso_id = p.id 
                     WHERE rp.rol_id = ? AND p.nombre_permiso = ?`,
                    [rolId, permission]
                )
            );

            const results = await Promise.all(permissionChecks);
            const hasAnyPermission = results.some(result => result[0].count > 0);

            if (!hasAnyPermission) {
                return res.status(403).json({ 
                    success: false, 
                    message: `No tienes permisos para realizar esta acción. Se requiere uno de: ${permissions.join(', ')}` 
                });
            }

            next();
        } catch (error) {
            console.error('Error verificando permisos:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor' 
            });
        }
    };
};
