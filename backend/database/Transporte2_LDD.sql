CREATE DATABASE transporte2;
USE transporte2;

-- ============================
-- Tabla de Roles
-- ============================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- ============================
-- Tabla de Usuarios
-- ============================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- almacenar hash
    rol_id INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- ============================
-- Tabla de Permisos
-- ============================
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_permiso VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255)
);

-- ============================
-- Tabla intermedia Rol-Permisos
-- ============================
CREATE TABLE rol_permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
);

-- ============================
-- Bitácora de acciones
-- ============================
CREATE TABLE bitacora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ============================
-- Clientes
-- ============================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20)
);

-- ============================
-- Camiones
-- ============================
CREATE TABLE camiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    color VARCHAR(30),
    tipo VARCHAR(30),
    tarjeta_circulacion VARCHAR(50) 
);

-- pendiente revisar el campo de tarjetas de ciruclacion 
Select * from camiones; 

-- ============================
-- Ayudantes
-- ============================
CREATE TABLE ayudantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20)
);

Select * from ayudantes;

-- ============================
-- Pilotos
-- ============================
CREATE TABLE pilotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    tipo_licencia VARCHAR(50),
    vencimiento DATE
);

-- ============================
-- Rutas
-- ============================
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_ruta VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INT NOT NULL,
    servicio VARCHAR(50) NOT NULL,
    mercaderia VARCHAR(100),
    camion_id INT NOT NULL,
    combustible DECIMAL(5,2), -- galones
    origen VARCHAR(100),
    destino VARCHAR(100),
    chofer_id INT NOT NULL,
    ayudante_id INT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    precio DECIMAL(10,2),
    comentario TEXT,
    estado ENUM('Pendiente','En curso','Entregado','Incidente') DEFAULT 'Pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (camion_id) REFERENCES camiones(id),
    FOREIGN KEY (chofer_id) REFERENCES pilotos(id),
    FOREIGN KEY (ayudante_id) REFERENCES ayudantes(id)
);

select * from Rutas
select * from clientes;
-- ============================
-- Historial de cambios de rutas
-- ============================
CREATE TABLE rutas_historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado_anterior ENUM('Pendiente','En curso','Entregado','Incidente'),
    estado_nuevo ENUM('Pendiente','En curso','Entregado','Incidente'),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
