import api from "./api";

export const getCamiones = async () => {
  const res = await api.get("/camiones");
  return res.data;
};

// Función para crear un camión nuevo en el backend
export const createCamion = async (camion) => {
  const res = await api.post("/camiones", camion);
  return res.data;
};

// Opcional: obtener un camión por ID (para VerCamiones.jsx)
export const getCamionById = async (id) => {
  const res = await api.get(`/camiones/${id}`);
  return res.data;
};
