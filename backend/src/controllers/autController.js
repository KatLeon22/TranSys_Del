import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// =========================
// CONTROLADOR AUTENTICACIÓN - SOLO LÓGICA DE NEGOCIO
// =========================

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generar token JWT
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            rol_id: user.rol_id,
            rol_nombre: user.rol_nombre 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Verificar contraseña
const verifyPassword = async (password, hashedPassword) => {
    try {
        // Verificar si es un hash SHA2 (64 caracteres)
        if (hashedPassword.length === 64) {
            const crypto = await import('crypto');
            const hashedInput = crypto.createHash('sha256').update(password + 'transporte2024').digest('hex');
            return hashedInput === hashedPassword;
        }
        // Si no, comparar directamente (para compatibilidad con texto plano)
        return password === hashedPassword;
    } catch (error) {
        console.error('Error verificando contraseña:', error);
        return false;
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar datos de entrada
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario en la base de datos
        const users = await User.findByUsername(username);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const user = users[0];

        // Verificar que el usuario esté activo
        if (user.estado !== 'activo') {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado. Contacta al administrador.'
            });
        }

        // Verificar contraseña
        const isValidPassword = await verifyPassword(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token JWT
        const token = generateToken(user);

        // Obtener permisos específicos del usuario (no del rol)
        const permissions = await User.getPermissions(user.rol_id);

        // Registrar en bitácora (opcional)
        try {
            await User.logAction(user.id, 'LOGIN', `Usuario ${username} inició sesión`);
        } catch (error) {
            console.log('⚠️ Bitácora no disponible (continuando):', error.message);
            // No fallar por la bitácora, solo registrar el error
        }

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    rol_id: user.rol_id,
                    rol_nombre: user.rol_nombre
                },
                token,
                permissions: permissions.map(p => p.nombre_permiso)
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Verificar token
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Buscar usuario actualizado
        const users = await User.findById(decoded.id);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const user = users[0];

        // Verificar que el usuario esté activo
        if (user.estado !== 'activo') {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado. Contacta al administrador.'
            });
        }

        // Obtener permisos actualizados
        const permissions = await User.getPermissions(user.rol_id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    rol_id: user.rol_id,
                    rol_nombre: user.rol_nombre
                },
                permissions: permissions.map(p => p.nombre_permiso)
            }
        });

    } catch (error) {
        console.error('Error verificando token:', error);
        
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

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Registrar logout en bitácora (opcional)
            try {
                await User.logAction(decoded.id, 'LOGOUT', `Usuario ${decoded.username} cerró sesión`);
            } catch (error) {
                console.log('⚠️ Bitácora no disponible (continuando):', error.message);
                // No fallar por la bitácora, solo registrar el error
            }
        }

        res.json({
            success: true,
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener perfil del usuario
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await User.findById(userId);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const user = users[0];
        const permissions = await User.getPermissions(user.rol_id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    rol_id: user.rol_id,
                    rol_nombre: user.rol_nombre
                },
                permissions: permissions.map(p => p.nombre_permiso)
            }
        });

    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
