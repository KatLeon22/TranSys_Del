import api from "./api";

// Obtener todas las rutas
export const getRutas = async () => {
  const res = await api.get("/rutas");
  return res.data;
};

// Crear una nueva ruta
export const createRuta = async (ruta) => {
  const res = await api.post("/rutas", ruta);
  return res.data;
};

// Opcional: obtener una ruta por ID
export const getRutaById = async (id) => {
  const res = await api.get(`/rutas/${id}`);
  return res.data;
};

