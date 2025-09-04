import express from "express";
import cors from "cors";
import choferesRoutes from "./routes/choferesRoutes.js";
import camionesRoutes from "./routes/camionesRoutes.js";
import rutasRoutes from "./routes/rutasRoutes.js";
import mantenimientosRoutes from "./routes/mantenimientosRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/choferes", choferesRoutes);
app.use("/api/camiones", camionesRoutes);
app.use("/api/rutas", rutasRoutes);
app.use("/api/mantenimientos", mantenimientosRoutes);
app.use("/api/reportes", reportesRoutes);

export default app;

