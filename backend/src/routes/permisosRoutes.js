import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getAllPermisos, 
    cleanDuplicatePermissions, 
    getUserPermissions 
} from '../controllers/permisosController.js';

const router = express.Router();

// =========================
// RUTAS PERMISOS
// =========================

// Obtener todos los permisos
router.get('/', getAllPermisos);

// Obtener permisos de un usuario específico
router.get('/usuario/:userId', getUserPermissions);

// Limpiar permisos duplicados de un rol
router.post('/limpiar-duplicados/:rol_id', cleanDuplicatePermissions);

export default router;
