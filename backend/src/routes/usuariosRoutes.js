import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';
import {
    testEndpoint,
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    changeUserStatus,
    getAvailableUserPermissions
} from '../controllers/usuariosController.js';

const router = express.Router();

// =========================
// RUTAS USUARIOS
// =========================

// Endpoint de prueba (sin autenticación)
router.get('/test', testEndpoint);

// Obtener todos los usuarios (solo autenticación)
router.get('/', authenticateToken, getAllUsuarios);

// Obtener usuario por ID (solo autenticación)
router.get('/:id', authenticateToken, getUsuarioById);

// Obtener permisos disponibles para usuarios (solo autenticación)
router.get('/permissions/available', authenticateToken, getAvailableUserPermissions);

// Crear nuevo usuario (solo autenticación)
router.post('/', authenticateToken, createUsuario);

// Actualizar usuario (solo autenticación)
router.put('/:id', authenticateToken, updateUsuario);

// Eliminar usuario (solo autenticación)
router.delete('/:id', authenticateToken, deleteUsuario);

// Cambiar estado del usuario (solo autenticación)
router.patch('/:id/status', authenticateToken, changeUserStatus);

export default router;
