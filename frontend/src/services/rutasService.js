import api from "./api";

export const getRutas = async () => {
  const res = await api.get("/rutas");
  return res.data;
};
