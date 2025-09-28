import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permissions.js';
import {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    changeUserStatus
} from '../controllers/usuariosController.js';

const router = express.Router();

// =========================
// RUTAS USUARIOS
// =========================

// Obtener todos los usuarios (solo autenticación)
router.get('/', authenticateToken, getAllUsuarios);

// Obtener usuario por ID (solo autenticación)
router.get('/:id', authenticateToken, getUsuarioById);

// Crear nuevo usuario (solo autenticación)
router.post('/', authenticateToken, createUsuario);

// Actualizar usuario (solo autenticación)
router.put('/:id', authenticateToken, updateUsuario);

// Eliminar usuario (solo autenticación)
router.delete('/:id', authenticateToken, deleteUsuario);

// Cambiar estado del usuario (solo autenticación)
router.patch('/:id/status', authenticateToken, changeUserStatus);

export default router;
