import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pilotoRoutes from "./routes/pilotoRoutes.js";
import choferesRoutes from "./routes/choferesRoutes.js";
import camionesRoutes from "./routes/camionesRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import ayudantesRoutes from "./routes/ayudantesRoutes.js";
import rutasRoutes from "./routes/rutasRoutes.js";
import mantenimientosRoutes from "./routes/mantenimientosRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar la conexión a la BD
app.get("/api/test-db", async (req, res) => {
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            res.json({ 
                success: true, 
                message: "Conexión a la base de datos exitosa",
                database: process.env.DB_NAME || 'transporte2'
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Error al conectar con la base de datos" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor",
            error: error.message 
        });
    }
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas específicas para pilotos
app.use("/api/piloto", pilotoRoutes);

// Rutas protegidas
app.use("/api/choferes", choferesRoutes);
app.use("/api/camiones", camionesRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/ayudantes", ayudantesRoutes);
app.use("/api/rutas", rutasRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use("/api/reportes", reportesRoutes);

export default app;

