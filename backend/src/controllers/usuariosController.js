import { User } from '../models/User.js';
import { executeQuery } from '../config/db.js';
import crypto from 'crypto';

// =========================
// CONTROLADOR USUARIOS - LÓGICA DE NEGOCIO
// =========================

// Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll();
        
        res.json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarios = await User.findById(id);
        
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuarios[0]
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        console.log('🔄 Creando nuevo usuario...');
        console.log('📋 Datos recibidos:', req.body);
        
        const { username, password, rol_id, estado = 'activo', piloto_id = null, permisos = [] } = req.body;

        // Validar datos requeridos
        if (!username || !password || !rol_id) {
            console.log('❌ Faltan datos requeridos');
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.exists(username);
        if (userExists) {
            console.log('❌ Usuario ya existe:', username);
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya existe'
            });
        }

        // Hash de la contraseña
        const crypto = await import('crypto');
        const hashedPassword = crypto.createHash('sha256').update(password + 'transporte2024').digest('hex');

        // Crear usuario
        console.log('💾 Creando usuario en la base de datos...');
        const userData = {
            username,
            password: hashedPassword,
            rol_id,
            estado
        };
        
        // Solo agregar piloto_id si es un piloto (rol_id = 2) y tiene piloto_id
        if (rol_id == 2 && piloto_id) {
            userData.piloto_id = piloto_id;
        }
        
        const result = await User.create(userData);
        console.log('✅ Usuario creado exitosamente:', result);

        // Asignar permisos según el rol o permisos personalizados
        let permisosParaAsignar = [];
        
        if (permisos && permisos.length > 0) {
            // Si se enviaron permisos personalizados, usar esos
            console.log('🔐 Asignando permisos personalizados:', permisos);
            permisosParaAsignar = permisos;
        } else {
            // Si no se enviaron permisos, usar los permisos por defecto según el rol
            if (rol_id == 1) { // Administrador - todos los permisos
                console.log('🔐 Asignando permisos de administrador (todos los permisos)...');
                permisosParaAsignar = [1, 2, 3, 4, 5, 6, 7]; // Todos los permisos
            } else if (rol_id == 2) { // Piloto - solo ver rutas y cambiar estado
                console.log('🔐 Asignando permisos de piloto...');
                permisosParaAsignar = [4, 5]; // ver_rutas y cambiar_estado
            } else if (rol_id == 3) { // Usuario - sin permisos por defecto
                console.log('🔐 Usuario sin permisos predefinidos - requiere selección manual');
                permisosParaAsignar = []; // Sin permisos por defecto
            }
        }

        // Asignar los permisos
        for (const permisoId of permisosParaAsignar) {
            await executeQuery(
                'INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)',
                [rol_id, permisoId]
            );
        }

        // Registrar en bitácora (solo si hay usuario autenticado)
        try {
            if (req.user && req.user.id) {
                await executeQuery(
                    'INSERT INTO bitacora (usuario_id, accion, detalle) VALUES (?, ?, ?)',
                    [req.user.id, 'CREAR_USUARIO', `Usuario ${username} creado`]
                );
            }
        } catch (error) {
            console.log('Bitácora no disponible:', error.message);
        }

        console.log('🎉 Usuario creado completamente');
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                id: result.insertId,
                username,
                rol_id
            }
        });

    } catch (error) {
        console.error('❌ Error creando usuario:', error);
        console.error('📋 Stack trace:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, rol_id, estado, piloto_id } = req.body;
        
        console.log('🔄 Actualizando usuario:', { id, username, password: password ? '***' : 'no password', rol_id, estado, piloto_id });

        // Verificar si el usuario existe
        const usuarios = await User.findById(id);
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si el nuevo username ya existe (si se está cambiando)
        if (username && username !== usuarios[0].username) {
            const userExists = await User.exists(username);
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario ya existe'
                });
            }
        }

        // Preparar datos para actualización
        const updateData = {};
        
        // Si solo se envía contraseña, mantener los valores actuales del usuario
        if (password && password.trim() !== '') {
            const crypto = await import('crypto');
            const hashedPassword = crypto.createHash('sha256').update(password + 'transporte2024').digest('hex');
            updateData.password = hashedPassword;
            
            // Mantener los valores actuales del usuario
            updateData.username = usuarios[0].username;
            updateData.rol_id = usuarios[0].rol_id;
            updateData.estado = usuarios[0].estado;
            updateData.piloto_id = usuarios[0].piloto_id;
        } else {
            // Si se envían otros campos, actualizarlos
            if (username !== null && username !== undefined) {
                updateData.username = username;
            }
            if (rol_id !== null && rol_id !== undefined) {
                updateData.rol_id = rol_id;
            }
            if (estado !== null && estado !== undefined) {
                updateData.estado = estado;
            }
            if (piloto_id !== null && piloto_id !== undefined) {
                updateData.piloto_id = piloto_id;
            }
        }
        
        // Actualizar usuario
        await User.update(id, updateData);

        // Registrar en bitácora (solo si hay usuario autenticado)
        try {
            if (req.user && req.user.id) {
                const usernameForLog = username || usuarios[0].username;
                await executeQuery(
                    'INSERT INTO bitacora (usuario_id, accion, detalle) VALUES (?, ?, ?)',
                    [req.user.id, 'ACTUALIZAR_USUARIO', `Usuario ${usernameForLog} actualizado`]
                );
            }
        } catch (error) {
            console.log('Bitácora no disponible:', error.message);
        }

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente'
        });

    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🗑️ Eliminando usuario:', { id });
        console.log('🔍 req.user:', req.user);

        // Verificar si el usuario existe
        const usuarios = await User.findById(id);
        if (usuarios.length === 0) {
            console.log('❌ Usuario no encontrado:', id);
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No permitir eliminar el usuario actual (solo si hay usuario autenticado)
        if (req.user && parseInt(id) === req.user.id) {
            console.log('❌ Intento de eliminar usuario propio');
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propio usuario'
            });
        }

        console.log('✅ Procediendo a eliminar usuario:', usuarios[0].username);

        // Eliminar usuario
        await User.delete(id);

        // Registrar en bitácora (solo si hay usuario autenticado)
        try {
            if (req.user && req.user.id) {
                await executeQuery(
                    'INSERT INTO bitacora (usuario_id, accion, detalle) VALUES (?, ?, ?)',
                    [req.user.id, 'ELIMINAR_USUARIO', `Usuario ${usuarios[0].username} eliminado`]
                );
                console.log('📝 Bitácora registrada');
            }
        } catch (error) {
            console.log('Bitácora no disponible:', error.message);
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });

    } catch (error) {
        console.error('❌ Error eliminando usuario:', error);
        console.error('📋 Detalles del error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Cambiar estado del usuario
export const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        console.log('🔄 Cambiando estado del usuario:', { id, estado });
        console.log('📋 Datos recibidos:', { id, estado, body: req.body });

        if (!estado || !['activo', 'inactivo'].includes(estado)) {
            console.log('❌ Estado inválido:', estado);
            return res.status(400).json({
                success: false,
                message: 'Estado inválido. Debe ser "activo" o "inactivo"'
            });
        }

        // Verificar si el usuario existe
        const usuarios = await User.findById(id);
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No permitir desactivar el usuario actual (solo si hay usuario autenticado)
        if (req.user && parseInt(id) === req.user.id && estado === 'inactivo') {
            return res.status(400).json({
                success: false,
                message: 'No puedes desactivar tu propio usuario'
            });
        }

        // Cambiar estado
        await User.changeStatus(id, estado);

        // Registrar en bitácora (solo si hay usuario autenticado)
        try {
            if (req.user && req.user.id) {
                await executeQuery(
                    'INSERT INTO bitacora (usuario_id, accion, detalle) VALUES (?, ?, ?)',
                    [req.user.id, 'CAMBIAR_ESTADO', `Usuario ${usuarios[0].username} ${estado === 'activo' ? 'activado' : 'desactivado'}`]
                );
            }
        } catch (error) {
            console.log('Bitácora no disponible:', error.message);
        }

        res.json({
            success: true,
            message: `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`
        });

    } catch (error) {
        console.error('Error cambiando estado del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
