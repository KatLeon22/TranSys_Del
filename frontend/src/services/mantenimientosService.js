import api from "./api";

export const getMantenimientos = async () => {
  const res = await api.get("/mantenimientos");
  return res.data;
};
