import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getReportes, 
    getReportePorPeriodo, 
    exportarReporte 
} from "../controllers/reportesController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para reportes
router.get("/", getReportes);
router.post("/periodo", getReportePorPeriodo);
router.get("/exportar", exportarReporte);

export default router;