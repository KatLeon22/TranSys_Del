import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getAllCamiones, 
    getCamionById, 
    createCamion, 
    updateCamion, 
    deleteCamion 
} from "../controllers/camionesController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para camiones
router.get("/", getAllCamiones);
router.get("/:id", getCamionById);
router.post("/", createCamion);
router.put("/:id", updateCamion);
router.delete("/:id", deleteCamion);

export default router;

