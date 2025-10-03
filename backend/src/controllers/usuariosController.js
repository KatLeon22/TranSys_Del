import { User } from '../models/User.js';
import { PermisosModel } from '../models/PermisosModel.js';
import { executeQuery } from '../config/db.js';
import crypto from 'crypto';

// =========================
// CONTROLADOR USUARIOS - LÓGICA DE NEGOCIO
// =========================

// Endpoint de prueba para verificar que el servidor funciona
export const testEndpoint = async (req, res) => {
    try {
        console.log('🧪 TEST ENDPOINT - Servidor funcionando correctamente');
        res.json({
            success: true,
            message: 'Servidor funcionando correctamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error en test endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Error en test endpoint',
            error: error.message
        });
    }
};

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
            // Si se enviaron permisos personalizados, validar que sean permitidos para usuarios
            if (rol_id == 3) { // Usuario - solo permisos administrativos permitidos
                const permisosPermitidos = [6, 7]; // gestionar_catalogos y generar_reportes
                const permisosInvalidos = permisos.filter(p => !permisosPermitidos.includes(p));
                
                if (permisosInvalidos.length > 0) {
                    console.log('❌ Permisos no permitidos para usuarios:', permisosInvalidos);
                    return res.status(400).json({
                        success: false,
                        message: 'Los usuarios solo pueden tener permisos de gestión de catálogos y generación de reportes',
                        permisosInvalidos: permisosInvalidos
                    });
                }
            }
            
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

        // Limpiar permisos existentes del rol antes de asignar nuevos
        console.log('🧹 Limpiando permisos existentes del rol:', rol_id);
        await PermisosModel.clearRolePermissions(rol_id);
        console.log('✅ Permisos del rol limpiados');

        // Asignar los permisos al rol
        for (const permisoId of permisosParaAsignar) {
            await PermisosModel.assignPermissionToRole(rol_id, permisoId);
        }
        console.log('✅ Permisos asignados al rol:', rol_id);

        // Registrar en bitácora (solo si hay usuario autenticado)
        try {
            if (req.user && req.user.id) {
                await User.logAction(req.user.id, 'CREAR_USUARIO', `Usuario ${username} creado`);
            }
        } catch (error) {
            console.log('⚠️ Bitácora no disponible (continuando):', error.message);
            // No fallar por la bitácora, solo registrar el error
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
        const { username, password, rol_id, estado, piloto_id, permisos } = req.body;
        
        // console.log('🔄 Actualizando usuario:', { id, username, password: password ? '***' : 'no password', rol_id, estado, piloto_id, permisos });

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
        
        // Actualizar usuario solo si hay campos para actualizar
        if (Object.keys(updateData).length > 0) {
            await User.update(id, updateData);
        }

        // Si se enviaron permisos, actualizarlos
        if (permisos && Array.isArray(permisos)) {
            console.log('🔐 Actualizando permisos para usuario:', id, 'Permisos:', permisos);
            
            try {
                // Obtener el rol del usuario para validar permisos
                const usuarioActual = usuarios[0];
                const rolId = usuarioActual.rol_id;
                
                console.log('👤 Usuario actual:', usuarioActual);
                console.log('🎭 Rol ID:', rolId);
                
                // Validar permisos según el rol
                if (rolId == 3) { // Usuario - solo permisos administrativos permitidos
                    const permisosPermitidos = [6, 7]; // gestionar_catalogos y generar_reportes
                    const permisosInvalidos = permisos.filter(p => !permisosPermitidos.includes(p));
                    
                    if (permisosInvalidos.length > 0) {
                        console.log('❌ Permisos no permitidos para usuarios:', permisosInvalidos);
                        return res.status(400).json({
                            success: false,
                            message: 'Los usuarios solo pueden tener permisos de gestión de catálogos y generación de reportes',
                            permisosInvalidos: permisosInvalidos
                        });
                    }
                }
                
                console.log('🧹 Limpiando permisos existentes del rol:', rolId);
                // Limpiar permisos existentes del rol
                await PermisosModel.clearRolePermissions(rolId);
                
                // Asignar nuevos permisos
                if (permisos.length > 0) {
                    console.log('🔐 Asignando nuevos permisos:', permisos);
                    for (const permisoId of permisos) {
                        console.log('➕ Asignando permiso:', permisoId, 'al rol:', rolId);
                        await PermisosModel.assignPermissionToRole(rolId, permisoId);
                    }
                }
                
                console.log('✅ Permisos actualizados correctamente');
            } catch (permisosError) {
                console.error('❌ Error actualizando permisos:', permisosError);
                return res.status(500).json({
                    success: false,
                    message: 'Error actualizando permisos',
                    error: permisosError.message
                });
            }
        }

        // Registrar en bitácora (solo si hay usuario autenticado)
        try {
            if (req.user && req.user.id) {
                const usernameForLog = username || usuarios[0].username;
                await User.logAction(req.user.id, 'ACTUALIZAR_USUARIO', `Usuario ${usernameForLog} actualizado`);
            }
        } catch (error) {
            console.log('⚠️ Bitácora no disponible (continuando):', error.message);
            // No fallar por la bitácora, solo registrar el error
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

        // Verificar si el usuario existe
        const usuarios = await User.findById(id);
        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // No permitir eliminar el usuario actual
        console.log('🔍 Verificando si es el usuario actual:', { 
            userId: req.user?.id, 
            targetId: id, 
            isSame: req.user && parseInt(id) === req.user.id 
        });
        
        if (req.user && parseInt(id) === req.user.id) {
            console.log('❌ Usuario intentando eliminarse a sí mismo');
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propio usuario'
            });
        }

        // Eliminar usuario (ahora maneja automáticamente la bitácora)
        await User.delete(id);
        
        // Limpiar permisos del rol si no hay otros usuarios con ese rol
        try {
            const usuariosConMismoRol = await executeQuery(
                'SELECT COUNT(*) as count FROM usuarios WHERE rol_id = ? AND id != ?', 
                [usuarios[0].rol_id, id]
            );
            
            if (usuariosConMismoRol[0].count === 0) {
                console.log('🧹 No hay otros usuarios con el rol, limpiando permisos del rol:', usuarios[0].rol_id);
                await PermisosModel.clearRolePermissions(usuarios[0].rol_id);
                console.log('✅ Permisos del rol limpiados');
            } else {
                console.log('ℹ️ Hay otros usuarios con el rol, manteniendo permisos del rol');
            }
        } catch (error) {
            console.log('⚠️ Error limpiando permisos del rol (continuando):', error.message);
        }

        console.log('✅ Usuario eliminado exitosamente:', usuarios[0].username);

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: {
                deletedUser: usuarios[0].username,
                deletedId: id
            }
        });

    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener permisos disponibles según el rol
export const getAvailableUserPermissions = async (req, res) => {
    try {
        const { rol_id } = req.query;
        console.log('📋 Obteniendo permisos disponibles para rol:', rol_id);
        
        let permisosIds = [];
        
        if (rol_id == 1) { // Administrador - todos los permisos
            permisosIds = [1, 2, 3, 4, 5, 6, 7];
            console.log('🔐 Permisos de administrador (todos)');
        } else if (rol_id == 2) { // Piloto - solo ver rutas y cambiar estado
            permisosIds = [4, 5];
            console.log('🔐 Permisos de piloto (ver_rutas y cambiar_estado)');
        } else if (rol_id == 3) { // Usuario - solo permisos administrativos
            permisosIds = [6, 7];
            console.log('🔐 Permisos de usuario (gestionar_catalogos y generar_reportes)');
        } else {
            // Si no se especifica rol, devolver todos los permisos
            permisosIds = [1, 2, 3, 4, 5, 6, 7];
            console.log('🔐 Permisos por defecto (todos)');
        }
        
        const query = `
            SELECT id, nombre_permiso, descripcion 
            FROM permisos 
            WHERE id IN (${permisosIds.join(',')}) 
            ORDER BY id
        `;
        const permisos = await executeQuery(query);
        
        console.log('✅ Permisos disponibles obtenidos:', permisos.length);
        
        res.json({
            success: true,
            data: permisos
        });
        
    } catch (error) {
        console.error('❌ Error obteniendo permisos disponibles:', error);
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
                await User.logAction(req.user.id, 'CAMBIAR_ESTADO', `Usuario ${usuarios[0].username} ${estado === 'activo' ? 'activado' : 'desactivado'}`);
            }
        } catch (error) {
            console.log('⚠️ Bitácora no disponible (continuando):', error.message);
            // No fallar por la bitácora, solo registrar el error
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
