import app from "./app.js";
import { testConnection } from "./config/db.js";
import dotenv from "dotenv";

// =========================
// SERVER - SOLO CONEXIÓN BD Y INICIO
// =========================

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 4000;

// Función para inicializar el servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        console.log("🔄 Verificando conexión a la base de datos...");
        const dbConnected = await testConnection();
        
        if (dbConnected) {
            // Iniciar servidor
            app.listen(PORT, () => {
                console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
                console.log(`📊 Base de datos: ${process.env.DB_NAME || 'transporte2'}`);
                console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
                console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
            });
        } else {
            console.error("❌ No se pudo conectar a la base de datos. Verifica tu configuración.");
            process.exit(1);
        }
    } catch (error) {
        console.error("❌ Error al inicializar el servidor:", error.message);
        process.exit(1);
    }
};

// Iniciar servidor
startServer();
