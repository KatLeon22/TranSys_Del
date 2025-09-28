import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Buscar usuario en la base de datos
        const userQuery = `
            SELECT u.id, u.username, u.rol_id, r.nombre as rol_nombre, u.piloto_id
            FROM usuarios u
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.id = ?
        `;
        const users = await executeQuery(userQuery, [decoded.id]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const user = users[0];

        // Agregar información del usuario a la request
        req.user = {
            id: user.id,
            username: user.username,
            rol_id: user.rol_id,
            rol_nombre: user.rol_nombre,
            piloto_id: user.piloto_id
        };
        next();

    } catch (error) {
        console.error('Error en autenticación:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Middleware para verificar roles específicos
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!allowedRoles.includes(req.user.rol_nombre)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso'
            });
        }

        next();
    };
};

// Middleware para verificar permisos específicos
export const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const user = await User.findById(req.user.id);
            const hasPermission = await user.hasPermission(permissionName);

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `No tienes el permiso '${permissionName}' requerido`
                });
            }

            next();
        } catch (error) {
            console.error('Error verificando permiso:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };
};

// Middleware opcional (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const userQuery = `
                SELECT u.id, u.username, u.rol_id, r.nombre as rol_nombre, u.piloto_id
                FROM usuarios u
                LEFT JOIN roles r ON u.rol_id = r.id
                WHERE u.id = ?
            `;
            const users = await executeQuery(userQuery, [decoded.id]);
            
            if (users.length > 0) {
                const user = users[0];
                req.user = {
                    id: user.id,
                    username: user.username,
                    rol_id: user.rol_id,
                    rol_nombre: user.rol_nombre,
                    piloto_id: user.piloto_id
                };
            }
        }

        next();
    } catch (error) {
        // En middleware opcional, no fallamos si hay error
        next();
    }
};
