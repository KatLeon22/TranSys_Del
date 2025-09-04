import express from "express";
const router = express.Router();

let rutas = [
  { id: 1, cliente: "Cliente1", piloto: "Juan Pérez", ayudante: "Pedro", mercaderia: "Paquete A", origen: "Ciudad A", destino: "Ciudad B", fecha: "2025-09-03", hora: "08:00", combustible: 50 },
];

router.get("/", (req, res) => res.json(rutas));
router.post("/", (req, res) => {
  const nuevo = { id: rutas.length + 1, ...req.body };
  rutas.push(nuevo);
  res.json(nuevo);
});

export default router;

