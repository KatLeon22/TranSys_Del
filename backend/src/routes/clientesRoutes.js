import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { 
    getAllClientes, 
    getClienteById, 
    createCliente, 
    updateCliente, 
    deleteCliente 
} from "../controllers/clientesController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para clientes
router.get("/", getAllClientes);
router.get("/:id", getClienteById);
router.post("/", createCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;





