USE transporte2;

-- =========================
-- ROLES
-- =========================
INSERT IGNORE INTO roles (id, nombre) VALUES
(1, 'administrador'),
(2, 'piloto');

-- =========================
-- USUARIOS
-- =========================
INSERT IGNORE INTO usuarios (username, password, rol_id) VALUES
('admin1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('piloto1', '$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyJgaI9/3xvt0ytapQ1M5LefdmMG', 2),
('piloto2', '$2a$10$I4j8J1.QgRx48ZhDzxjLc.LkOzKgaJ0/4ywt1zubqR2N6MfgnNH', 2);

INSERT IGNORE INTO usuarios (username, password, rol_id) VALUES
('admin2', 'c8fc32abe3bcbafef95d275143315a674291f60ec7d070b1827b8b2c79ed6eeai', 1);



select * from usuarios

USE transporte2;

UPDATE usuarios SET password = 'admin123' WHERE username = 'admin1';
UPDATE usuarios SET password = 'piloto123' WHERE username = 'piloto1';
UPDATE usuarios SET password = 'piloto456' WHERE username = 'piloto2';
UPDATE usuarios SET password = 'Kateryn123' WHERE username = 'admin2';

-- =========================
-- PERMISOS
-- =========================
INSERT IGNORE INTO permisos (id, nombre_permiso, descripcion) VALUES
(1, 'crear_rutas', 'Permite crear nuevas rutas'),
(2, 'editar_rutas', 'Permite editar rutas existentes'),
(3, 'eliminar_rutas', 'Permite eliminar rutas'),
(4, 'ver_rutas', 'Permite ver rutas'),
(5, 'cambiar_estado', 'Permite cambiar estado de rutas'),
(6, 'gestionar_catalogos', 'Permite añadir clientes, camiones, pilotos, ayudantes'),
(7, 'generar_reportes', 'Permite generar reportes del sistema');

-- =========================
-- ROL_PERMISOS
-- (El administrador tiene todos los permisos)
INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7);

-- (El piloto solo puede ver rutas y cambiar estado)
INSERT IGNORE INTO rol_permisos (rol_id, permiso_id) VALUES
(2, 4), -- ver_rutas
(2, 5); -- cambiar_estado

-- =========================
-- CLIENTES
-- =========================
INSERT INTO clientes (nombre, apellido, telefono) VALUES
('Juan', 'Pérez', '55512345'),
('María', 'López', '55567890'),
('Carlos', 'Ramírez', '55511223');

-- =========================
-- CAMIONES
-- =========================
INSERT INTO camiones (placa, marca, modelo, color, tipo, tarjeta_circulacion) VALUES
('ABC123', 'Freightliner', 'Cascadia', 'Blanco', 'Trailer', 'TC-001'),
('XYZ789', 'Volvo', 'FH16', 'Azul', 'Camión rígido', 'TC-002'),
('LMN456', 'Kenworth', 'T680', 'Rojo', 'Trailer', 'TC-003');

-- =========================
-- AYUDANTES
-- =========================
INSERT INTO ayudantes (nombre, apellido, telefono) VALUES
('Pedro', 'Martínez', '55533445'),
('Ana', 'Gómez', '55566778'),
('Luis', 'Fernández', '55588990');

-- =========================
-- PILOTOS
-- =========================
INSERT INTO pilotos (nombre, apellido, telefono, tipo_licencia, vencimiento) VALUES
('José', 'Morales', '55522334', 'A', '2026-05-20'),
('Ricardo', 'Santos', '55544556', 'B', '2025-12-15'),
('Manuel', 'Domínguez', '55577889', 'A', '2027-01-10');

select * from pilotos ; 
-- =========================
-- RUTAS
-- =========================
INSERT INTO rutas (no_ruta, cliente_id, servicio, mercaderia, camion_id, combustible, origen, destino, chofer_id, ayudante_id, fecha, hora, precio, comentario, estado) VALUES
('RUTA001', 1, 'Transporte de carga', 'Electrodomésticos', 1, 50.5, 'Ciudad de Guatemala', 'Quetzaltenango', 1, 1, '2025-09-22', '08:00:00', 2500.00, 'Cargar a las 7 AM', 'Pendiente'),
('RUTA002', 2, 'Entrega express', 'Medicinas', 2, 30.0, 'Guatemala', 'Escuintla', 2, 2, '2025-09-23', '10:30:00', 1800.00, '', 'En curso'),
('RUTA003', 3, 'Transporte refrigerado', 'Carnes', 3, 70.0, 'Guatemala', 'Petén', 3, 3, '2025-09-24', '05:00:00', 5000.00, 'Revisar temperatura del camión', 'Pendiente');

-- =========================
-- HISTORIAL DE CAMBIOS
-- (ejemplo de un piloto cambiando estado)
-- =========================
INSERT INTO rutas_historial (ruta_id, usuario_id, estado_anterior, estado_nuevo, comentario) VALUES
(1, 2, 'Pendiente', 'En curso', 'Ruta iniciada por piloto1'),
(2, 3, 'En curso', 'Entregado', 'Entrega realizada en destino');





-- Actualizar contraseñas
UPDATE usuarios SET password = 'admin123' WHERE username = 'admin1';
UPDATE usuarios SET password = 'piloto123' WHERE username = 'piloto1';
UPDATE usuarios SET password = 'piloto456' WHERE username = 'piloto2';

