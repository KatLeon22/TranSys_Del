import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getAllRutas, 
    getRutaById, 
    createRuta, 
    updateRuta, 
    deleteRuta,
    getNextRutaNumber,
    getRutasRecientes,
    testRutas
} from "../controllers/rutasController.js";

const router = express.Router();

// Ruta de prueba sin autenticación
router.get("/test", testRutas);

// Todas las demás rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para rutas
router.get("/", getAllRutas);
router.get("/recientes", getRutasRecientes);
router.get("/next-number", getNextRutaNumber);
router.get("/:id", getRutaById);
router.post("/", createRuta);
router.put("/:id", updateRuta);
router.delete("/:id", deleteRuta);

export default router;

