import { executeQuery } from '../config/db.js';

// =========================
// MODELO USER - SOLO QUERIES A BD
// =========================

export class User {
    // Buscar usuario por username
    static async findByUsername(username) {
        const query = `
            SELECT u.*, r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.username = ?
        `;
        return await executeQuery(query, [username]);
    }

    // Buscar usuario por ID
    static async findById(id) {
        const query = `
            SELECT u.*, r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id
            WHERE u.id = ?
        `;
        return await executeQuery(query, [id]);
    }

    // Crear nuevo usuario
    static async create(userData) {
        const { username, password, rol_id, estado = 'activo', piloto_id = null } = userData;
        const query = `
            INSERT INTO usuarios (username, password, rol_id, estado, piloto_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        return await executeQuery(query, [username, password, rol_id, estado, piloto_id]);
    }

    // Actualizar usuario
    static async update(id, userData) {
        const { username, password, rol_id, estado, piloto_id } = userData;
        
        // Construir la consulta dinámicamente basada en los campos proporcionados
        const setClauses = [];
        const params = [];
        
        if (username !== undefined) {
            setClauses.push('username = ?');
            params.push(username);
        }
        if (password !== undefined && password.trim() !== '') {
            setClauses.push('password = ?');
            params.push(password);
        }
        if (rol_id !== undefined) {
            setClauses.push('rol_id = ?');
            params.push(rol_id);
        }
        if (estado !== undefined) {
            setClauses.push('estado = ?');
            params.push(estado);
        }
        if (piloto_id !== undefined) {
            setClauses.push('piloto_id = ?');
            params.push(piloto_id);
        }
        
        if (setClauses.length === 0) {
            throw new Error('No hay campos para actualizar');
        }
        
        const query = `UPDATE usuarios SET ${setClauses.join(', ')} WHERE id = ?`;
        params.push(id);
        
        return await executeQuery(query, params);
    }

    // Eliminar usuario
    static async delete(id) {
        // Primero eliminar registros relacionados en bitácora
        try {
            await executeQuery(`DELETE FROM bitacora WHERE usuario_id = ?`, [id]);
            console.log('✅ Registros de bitácora eliminados para usuario:', id);
        } catch (error) {
            console.log('⚠️ No se pudieron eliminar registros de bitácora (continuando):', error.message);
            // Continuar aunque falle la bitácora
        }
        
        // Luego eliminar el usuario
        const query = `DELETE FROM usuarios WHERE id = ?`;
        return await executeQuery(query, [id]);
    }

    // Obtener permisos del usuario
    static async getPermissions(rol_id) {
        const query = `
            SELECT p.nombre_permiso, p.descripcion 
            FROM permisos p
            JOIN rol_permisos rp ON p.id = rp.permiso_id
            WHERE rp.rol_id = ?
        `;
        return await executeQuery(query, [rol_id]);
    }

    // Obtener todos los usuarios
    static async findAll() {
        const query = `
            SELECT u.*, r.nombre as rol_nombre,
                   p.nombre as piloto_nombre, p.apellido as piloto_apellido
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id
            LEFT JOIN pilotos p ON u.piloto_id = p.id
            ORDER BY u.creado_en DESC
        `;
        return await executeQuery(query);
    }

    // Verificar si el usuario existe
    static async exists(username) {
        const query = `SELECT id FROM usuarios WHERE username = ?`;
        const result = await executeQuery(query, [username]);
        return result.length > 0;
    }

    // Cambiar estado del usuario
    static async changeStatus(id, estado) {
        const query = `UPDATE usuarios SET estado = ? WHERE id = ?`;
        return await executeQuery(query, [estado, id]);
    }

    // Registrar acción en bitácora
    static async logAction(usuario_id, accion, detalle) {
        const query = `INSERT INTO bitacora (usuario_id, accion, detalle) VALUES (?, ?, ?)`;
        return await executeQuery(query, [usuario_id, accion, detalle]);
    }
}
