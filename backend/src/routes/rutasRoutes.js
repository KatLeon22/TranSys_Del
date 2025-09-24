import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getAllRutas, 
    getRutaById, 
    createRuta, 
    updateRuta, 
    deleteRuta,
    getNextRutaNumber
} from "../controllers/rutasController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para rutas
router.get("/", getAllRutas);
router.get("/next-number", getNextRutaNumber);
router.get("/:id", getRutaById);
router.post("/", createRuta);
router.put("/:id", updateRuta);
router.delete("/:id", deleteRuta);

export default router;

