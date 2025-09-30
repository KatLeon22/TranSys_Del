-- =========================
-- PERMISOS
-- =========================
INSERT INTO `permisos` (id, nombre_permiso, descripcion) VALUES 
(1,'crear_rutas','Permite crear nuevas rutas'),
(2,'editar_rutas','Permite editar rutas existentes'),
(3,'eliminar_rutas','Permite eliminar rutas'),
(4,'ver_rutas','Permite ver rutas'),
(5,'cambiar_estado','Permite cambiar estado de rutas'),
(6,'gestionar_catalogos','Permite añadir clientes, camiones, pilotos, ayudantes'),
(7,'generar_reportes','Permite generar reportes del sistema');

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id, nombre) VALUES
(1, 'administrador'),
(2, 'piloto'),
(3, 'usuario');

-- =========================
-- ROL - PERMISOS
-- =========================
INSERT INTO rol_permisos (id, rol_id, permiso_id) VALUES
(1,1,1),
(2,1,2),
(3,1,3),
(4,1,4),
(5,1,5),
(6,1,6),
(7,1,7),
(8,2,4),
(9,2,5);

-- =========================
-- USUARIOS
-- =========================
INSERT INTO `usuarios` (`id`, `username`, `password`, `rol_id`, `estado`, `piloto_id`) VALUES
(1,'admin1','bcc51265479bb4617a74128e3ef3ab36930601a33781e8a7f3740fa273102801',1,'activo',NULL);

-- =========================
-- USUARIO - PERMISOS
-- =========================
INSERT INTO usuario_permisos (`usuario_id`, `permiso_id`) VALUES
(1,1),
(1,2),
(1,3);
