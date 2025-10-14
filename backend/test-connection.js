import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        console.log('✅ Conexión exitosa a la base de datos');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        
        // Probar una consulta simple
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Consulta de prueba exitosa:', rows);
        
        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('🔍 Detalles del error:', error);
        return false;
    }
}

testConnection();
