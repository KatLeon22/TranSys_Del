import { executeQuery } from '../config/db.js';

// Script para inicializar roles y permisos base
const initRolesAndPermissions = async () => {
    try {
        console.log('🚀 Inicializando roles y permisos...');

        // 1. Crear roles base si no existen
        await executeQuery(`
            INSERT IGNORE INTO roles (id, nombre) VALUES 
            (1, 'Administrador'),
            (2, 'Piloto'),
            (3, 'Usuario')
        `);

        // 2. Crear permisos base si no existen
        await executeQuery(`
            INSERT IGNORE INTO permisos (id, nombre_permiso, descripcion) VALUES 
            (1, 'crear_rutas', 'Permite crear nuevas rutas'),
            (2, 'editar_rutas', 'Permite editar rutas existentes'),
            (3, 'eliminar_rutas', 'Permite eliminar rutas'),
            (4, 'ver_rutas', 'Permite ver rutas'),
            (5, 'cambiar_estado', 'Permite cambiar estado de rutas'),
            (6, 'gestionar_catalogos', 'Permite añadir clientes, camiones, pilotos, ayudantes'),
            (7, 'generar_reportes', 'Permite generar reportes del sistema')
        `);

        // 3. Asignar permisos a Administrador (todos los permisos)
        console.log('👑 Asignando permisos a Administrador...');
        const permisosAdmin = [1, 2, 3, 4, 5, 6, 7];
        for (const permisoId of permisosAdmin) {
            await executeQuery(
                'INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)',
                [1, permisoId]
            );
        }

        // 4. Asignar permisos a Piloto (solo ver rutas y cambiar estado)
        console.log('✈️ Asignando permisos a Piloto...');
        const permisosPiloto = [4, 5]; // ver_rutas y cambiar_estado
        for (const permisoId of permisosPiloto) {
            await executeQuery(
                'INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)',
                [2, permisoId]
            );
        }

        // 5. Usuario sin permisos por defecto (se asignan manualmente)
        console.log('👤 Usuario creado sin permisos predefinidos - requiere asignación manual');

        console.log('✅ Roles y permisos inicializados correctamente');
        console.log('📋 Resumen:');
        console.log('   - Administrador: Todos los permisos (1-7)');
        console.log('   - Piloto: Solo ver rutas (4) y cambiar estado (5)');
        console.log('   - Usuario: Sin permisos predefinidos (asignación manual)');

    } catch (error) {
        console.error('❌ Error inicializando roles y permisos:', error);
        throw error;
    }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    initRolesAndPermissions()
        .then(() => {
            console.log('🎉 Inicialización completada');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en inicialización:', error);
            process.exit(1);
        });
}

export { initRolesAndPermissions };
