import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getAllAyudantes, 
    getAyudanteById, 
    createAyudante, 
    updateAyudante, 
    deleteAyudante 
} from "../controllers/ayudantesController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para ayudantes
router.get("/", getAllAyudantes);
router.get("/:id", getAyudanteById);
router.post("/", createAyudante);
router.put("/:id", updateAyudante);
router.delete("/:id", deleteAyudante);

export default router;





