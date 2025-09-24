// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PilotoLayout from "./components/PilotoLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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
import Login from "./modules/login";
import PilotoRutas from "./modules/PilotoRutas";

export default function App() {
  const [rutas, setRutas] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Login - Ruta por defecto */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Resto de Modulos - Protegidos */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Ruta especial para pilotos */}
                  <Route 
                    path="/piloto-rutas" 
                    element={
                      <PilotoLayout>
                        <PilotoRutas />
                      </PilotoLayout>
                    } 
                  />

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

                {/* Alias */}
                <Route path="/ver-ayudantes/:id" element={<MostrarAyudante />} />
                <Route path="/ver-ruta/:id" element={<MostrarRuta rutas={rutas} />} />
                <Route path="/ver-camiones/:id" element={<MostrarCamiones />} />
                <Route path="/ver-choferes/:id" element={<VerChoferes />} />
                <Route path="/ver-clientes/:id" element={<MostrarClientes />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
