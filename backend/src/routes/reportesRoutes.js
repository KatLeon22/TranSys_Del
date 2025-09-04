import express from "express";
const router = express.Router();

let reportes = [
  { mes: "Enero", chofer: "Juan Pérez", viajes: 12 },
  { mes: "Febrero", chofer: "Juan Pérez", viajes: 8 },
  { mes: "Marzo", chofer: "María Gómez", viajes: 15 },
];

router.get("/", (req, res) => res.json(reportes));

export default router;
