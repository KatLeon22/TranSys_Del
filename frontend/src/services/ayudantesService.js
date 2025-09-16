import api from "./api";

export const getAyudantes = async () => {
  const res = await api.get("/ayudantes");
  return res.data;
};

export const createAyudante = async (ayudante) => {
  const res = await api.post("/ayudantes", ayudante);
  return res.data;
};

export const getAyudanteById = async (id) => {
  const res = await api.get(`/ayudantes/${id}`);
  return res.data;
};
