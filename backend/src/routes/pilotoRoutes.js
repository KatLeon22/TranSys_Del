import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getAllPilotos,
    getPilotoInfo,
    debugPilotoCompleto,
    debugAuth,
    debugPermissions,
    getRutasByPiloto, 
    updateEstadoRuta, 
    getHistorialRuta 
} from '../controllers/pilotoController.js';

const router = express.Router();

// Obtener todos los pilotos (sin autenticación para uso en formularios)
router.get('/', getAllPilotos);

// Todas las demás rutas requieren autenticación
router.use(authenticateToken);

// Debug: Obtener información del piloto
router.get('/info', getPilotoInfo);

// Debug completo: Verificar todo el flujo
router.get('/debug-completo', debugPilotoCompleto);

// Debug de autenticación
router.get('/debug-auth', debugAuth);

// Debug de permisos
router.get('/debug-permissions', debugPermissions);

// Obtener rutas del piloto logueado
router.get('/mis-rutas', getRutasByPiloto);

// Actualizar estado de una ruta específica
router.put('/ruta/:rutaId/estado', updateEstadoRuta);

// Obtener historial de una ruta
router.get('/ruta/:rutaId/historial', getHistorialRuta);

export default router;
