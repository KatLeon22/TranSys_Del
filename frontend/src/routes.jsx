import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ChoferesList from "./modules/choferes/ChoferesList";
import CamionesList from "./modules/Camiones/CamionesList";
import RutasList from "./modules/Rutas/RutasList";
import MantenimientosList from "./modules/Mantenimientos/MantenimientosList";
import Reportes from "./modules/Reportes/Reportes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/choferes" element={<ChoferesList />} />
          <Route path="/camiones" element={<CamionesList />} />
          <Route path="/rutas" element={<RutasList />} />
          <Route path="/mantenimientos" element={<MantenimientosList />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
