import { executeQuery } from './src/config/db.js';
import crypto from 'crypto';

async function createAdminUser() {
    try {
        console.log('🔧 Creando usuario administrador...');
        
        // Hash de la contraseña
        const password = 'admin123';
        const hashedPassword = crypto.createHash('sha256').update(password + 'transporte2024').digest('hex');
        
        // Crear usuario administrador
        const result = await executeQuery(
            'INSERT INTO usuarios (username, password, rol_id, estado) VALUES (?, ?, ?, ?)',
            ['admin', hashedPassword, 1, 'activo']
        );
        
        console.log('✅ Usuario administrador creado con ID:', result.insertId);
        
        // Asignar TODOS los permisos al rol administrador (rol_id = 1)
        const permissions = [
            { id: 1, name: 'crear_rutas' },
            { id: 2, name: 'editar_rutas' },
            { id: 3, name: 'eliminar_rutas' },
            { id: 4, name: 'ver_rutas' },
            { id: 5, name: 'cambiar_estado' },
            { id: 6, name: 'gestionar_catalogos' },
            { id: 7, name: 'generar_reportes' }
        ];
        
        console.log('🔐 Asignando todos los permisos al administrador...');
        
        for (const permission of permissions) {
            await executeQuery(
                'INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)',
                [1, permission.id]
            );
            console.log(`✅ Permiso asignado: ${permission.name}`);
        }
        
        console.log('🎉 Usuario administrador creado exitosamente!');
        console.log('📋 Credenciales:');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');
        
    } catch (error) {
        console.error('❌ Error creando administrador:', error);
    }
}

createAdminUser();
