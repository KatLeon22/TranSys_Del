USE transporte2;

-- =========================
-- GENERADOR DE HASH PARA CONTRASEÑAS
-- =========================
-- Este script te permite generar hashes para cualquier contraseña
-- Solo cambia la contraseña en la línea de abajo y ejecuta

-- =========================
-- CONFIGURACIÓN
-- =========================
-- Cambia estas variables según lo que necesites:
SET @usuario = 'admin2';           -- Cambia por el nombre de usuario que quieras
SET @contraseña = 'Kateryn123';      -- Cambia por la contraseña que quieras
SET @rol_id = 1;                  -- 1 = administrador, 2 = piloto


SET @salt = 'transporte2024';     -- Salt para mayor seguridad pero esto no lo utilice

-- =========================
-- GENERAR HASH
-- =========================
-- Esto te mostrará el hash generado
SELECT 
    @usuario as usuario,
    @contraseña as contraseña_original,
    SHA2(CONCAT(@contraseña, @salt), 256) as hash_generado,
    @rol_id as rol_id;


-- inserto esto aca 
INSERT IGNORE INTO usuarios (username, password, rol_id) VALUES
('admin2', 'c8fc32abe3bcbafef95d275143315a674291f60ec7d070b1827b8b2c79ed6eeai', 1);

select * from usuarios;

USE transporte2; -- aca por si se va la base de datos

UPDATE usuarios SET password = 'admin123' WHERE username = 'admin1';
UPDATE usuarios SET password = 'piloto123' WHERE username = 'piloto1';
UPDATE usuarios SET password = 'piloto456' WHERE username = 'piloto2';
UPDATE usuarios SET password = 'Kateryn123' WHERE username = 'admin2'; -- guardamos el usuario que se creo 










-- =========================
-- SQL LISTO PARA COPIAR
-- =========================
-- Copia y pega este resultado en un nuevo query:
SELECT CONCAT(
    'INSERT INTO usuarios (username, password, rol_id) VALUES (',
    CHAR(39), @usuario, CHAR(39), ', ',
    CHAR(39), SHA2(CONCAT(@contraseña, @salt), 256), CHAR(39), ', ',
    @rol_id, ');'
) as sql_para_ejecutar;

-- =========================
-- INFORMACIÓN ADICIONAL
-- =========================
SELECT 
    'Para agregar el usuario, copia el SQL de arriba y ejecútalo' as instruccion,
    'Salt usado: ' + @salt as salt_info,
    'Longitud del hash: ' + LENGTH(SHA2(CONCAT(@contraseña, @salt), 256)) as longitud_hash;




