import express from "express";
const router = express.Router();

let mantenimientos = [
  { id: 1, camion: "Volvo", estado: "Disponible" },
  { id: 2, camion: "Mercedes", estado: "En mantenimiento" },
];

router.get("/", (req, res) => res.json(mantenimientos));
router.post("/", (req, res) => {
  const nuevo = { id: mantenimientos.length + 1, ...req.body };
  mantenimientos.push(nuevo);
  res.json(nuevo);
});

export default router;

