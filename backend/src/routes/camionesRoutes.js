import express from "express";
const router = express.Router();

let camiones = [
  { id: 1, marca: "Volvo", color: "Blanco", tipo: "Camión", placa: "ABC123" },
  { id: 2, marca: "Mercedes", color: "Rojo", tipo: "Camión", placa: "XYZ789" },
];

router.get("/", (req, res) => res.json(camiones));
router.post("/", (req, res) => {
  const nuevo = { id: camiones.length + 1, ...req.body };
  camiones.push(nuevo);
  res.json(nuevo);
});

export default router;

