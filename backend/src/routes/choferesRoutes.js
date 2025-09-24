import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getAllChoferes, 
    getChoferById, 
    createChofer, 
    updateChofer, 
    deleteChofer 
} from "../controllers/choferesController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para choferes
router.get("/", getAllChoferes);
router.get("/:id", getChoferById);
router.post("/", createChofer);
router.put("/:id", updateChofer);
router.delete("/:id", deleteChofer);

export default router;

