import express from "express";
const router = express.Router();

let choferes = [
  { id: 1, nombre: "Juan", apellido: "Pérez", licencia: "12345" },
  { id: 2, nombre: "María", apellido: "Gómez", licencia: "67890" },
];

router.get("/", (req, res) => res.json(choferes));
router.post("/", (req, res) => {
  const nuevo = { id: choferes.length + 1, ...req.body };
  choferes.push(nuevo);
  res.json(nuevo);
});

export default router;

