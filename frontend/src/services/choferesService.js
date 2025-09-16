import api from "./api";

export const getChoferes = async () => {
  const res = await api.get("/choferes");
  return res.data;
};

export const createChofer = async (chofer) => {
  const res = await api.post("/choferes", chofer);
  return res.data;
};

// Función para obtener un chofer por ID
export const getChoferById = async (id) => {
  const res = await api.get(`/choferes/${id}`);
  return res.data;
};
