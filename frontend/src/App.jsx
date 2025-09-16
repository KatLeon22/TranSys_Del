// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Módulos
import Dashboard from "./modules/Dashboard";
import Choferes from "./modules/Choferes";
import Rutas from "./modules/Ruta";
import Mantenimientos from "./modules/Mantenimientos";
import Reportes from "./modules/Reportes";
import VerChoferes from "./modules/MostrarChoferes";
import Ayudantes from "./modules/Ayudantes";
import IngresarChoferes from "./modules/IngresarChoferes";
import IngresarAyudante from "./modules/IngresarAyudante";
import MostrarAyudante from "./modules/MostrarAyudantes";
import Clientes from "./modules/Clientes";
import IngresarClientes from "./modules/IngresarClientes";
import MostrarClientes from "./modules/MostrarClientes";
import Camiones from "./modules/Camiones";
import IngresarCamiones from "./modules/IngresarCamiones";
import IngresarRuta from "./modules/IngresarRutas";
import MostrarCamiones from "./modules/MostrarCamiones";
import EditarChoferes from "./modules/EditarChoferes";
import EditarAyudantes from "./modules/EditarAyudantes";
import EditarClientes from "./modules/EditarClientes";
import EditarCamiones from "./modules/EditarCamiones";
import EditarRutas from "./modules/EditarRutas";
import MostrarRuta from "./modules/MostrarRutas";

export default function App() {
  // Estado global de rutas para compartir entre Ruta y EditarRutas
  const [rutas, setRutas] = useState([]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Módulos */}
          <Route path="/choferes" element={<Choferes />} />
          <Route path="/rutas" element={<Rutas rutas={rutas} setRutas={setRutas} />} />
          <Route path="/mantenimientos" element={<Mantenimientos />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/camiones" element={<Camiones />} />
          <Route path="/ayudantes" element={<Ayudantes />} />

          {/* Ingreso */}
          <Route path="/ingresar-choferes" element={<IngresarChoferes />} />
          <Route path="/ingresar-ayudante" element={<IngresarAyudante />} />
          <Route path="/ingresar-clientes" element={<IngresarClientes />} />
          <Route path="/ingresar-camiones" element={<IngresarCamiones />} />
          <Route path="/ingresar-ruta" element={<IngresarRuta rutas={rutas} setRutas={setRutas} />} />

          {/* Edición */}
          <Route path="/editar-choferes/:id" element={<EditarChoferes />} />
          <Route path="/editar-ayudantes/:id" element={<EditarAyudantes />} />
          <Route path="/editar-clientes/:id" element={<EditarClientes />} />
          <Route path="/editar-camiones/:id" element={<EditarCamiones />} />
          <Route path="/editar-ruta/:id" element={<EditarRutas rutas={rutas} setRutas={setRutas} />} />

          {/* Mostrar / Detalles */}
          <Route path="/mostrar-choferes/:id" element={<VerChoferes />} />
          <Route path="/mostrar-ayudante/:id" element={<MostrarAyudante />} />
          <Route path="/mostrar-clientes/:id" element={<MostrarClientes />} />
          <Route path="/mostrar-camiones/:id" element={<MostrarCamiones />} />
          <Route path="/mostrar-ruta/:id" element={<MostrarRuta rutas={rutas} />} />

          {/* Rutas alternativas para consistencia */}
          <Route path="/ver-ayudantes/:id" element={<MostrarAyudante />} />
          <Route path="/ver-ruta/:id" element={<MostrarRuta rutas={rutas} />} />
          <Route path="/ver-camiones/:id" element={<MostrarCamiones />} />
          <Route path="/ver-choferes/:id" element={<VerChoferes />} />
          <Route path="/ver-clientes/:id" element={<MostrarClientes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
