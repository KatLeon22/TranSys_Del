import express from 'express';
import { login, verifyToken, logout, getProfile } from '../controllers/autController.js';
import { authenticateToken } from '../middleware/auth.js';

// =========================
// RUTAS AUTENTICACIÓN - SOLO ENDPOINTS
// =========================

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', logout);

// GET /api/auth/profile - Obtener perfil (requiere autenticación)
router.get('/profile', authenticateToken, getProfile);

export default router;
