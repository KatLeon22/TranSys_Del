import express from 'express';
import { testDatabase, getSystemInfo } from '../controllers/systemController.js';

// =========================
// RUTAS SISTEMA - SOLO ENDPOINTS
// =========================

const router = express.Router();

// GET /api/test-db - Probar conexión a la base de datos
router.get('/test-db', testDatabase);

// GET /api/system/info - Obtener información del sistema
router.get('/system/info', getSystemInfo);

export default router;
