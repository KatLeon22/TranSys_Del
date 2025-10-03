import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import pilotoRoutes from "./routes/pilotoRoutes.js";
import choferesRoutes from "./routes/choferesRoutes.js";
import camionesRoutes from "./routes/camionesRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import ayudantesRoutes from "./routes/ayudantesRoutes.js";
import rutasRoutes from "./routes/rutasRoutes.js";
import mantenimientosRoutes from "./routes/mantenimientosRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import permisosRoutes from "./routes/permisosRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// CONFIGURACIÓN DE EXPRESS
// =========================

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// =========================
// RUTAS
// =========================

// Rutas del sistema
app.use("/api", systemRoutes);

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
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/permisos", permisosRoutes);

// Ruta catch-all: enviar React app para cualquier ruta no manejada por la API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

export default app;

