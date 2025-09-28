import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllPermisos } from '../controllers/permisosController.js';

const router = express.Router();

// =========================
// RUTAS PERMISOS
// =========================

// Obtener todos los permisos (temporalmente sin autenticación para pruebas)
router.get('/', getAllPermisos);

export default router;
