import api from "./api";

export const getCamiones = async () => {
  const res = await api.get("/mantenimientos");
  return res.data;
};
