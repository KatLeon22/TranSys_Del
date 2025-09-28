import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getAllPilotos,
    getRutasByPiloto, 
    updateEstadoRuta, 
    getHistorialRuta 
} from '../controllers/pilotoController.js';

const router = express.Router();

// Obtener todos los pilotos (sin autenticación para uso en formularios)
router.get('/', getAllPilotos);

// Todas las demás rutas requieren autenticación
router.use(authenticateToken);

// Obtener rutas del piloto logueado
router.get('/mis-rutas', getRutasByPiloto);

// Actualizar estado de una ruta específica
router.put('/ruta/:rutaId/estado', updateEstadoRuta);

// Obtener historial de una ruta
router.get('/ruta/:rutaId/historial', getHistorialRuta);

export default router;
