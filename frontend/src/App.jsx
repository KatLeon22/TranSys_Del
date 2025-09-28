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
import Usuarios from "./modules/Usuarios";

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
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Ruta especial para pilotos */}
                  <Route 
                    path="/piloto-rutas" 
                    element={
                      <PilotoLayout>
                        <PilotoRutas />
                      </PilotoLayout>
                    } 
                  />

                {/* Módulos con verificación de permisos */}
                <Route 
                  path="/choferes" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <Choferes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/rutas" 
                  element={
                    <ProtectedRoute requiredPermissions={['ver_rutas', 'crear_rutas', 'editar_rutas', 'eliminar_rutas']}>
                      <Rutas rutas={rutas} setRutas={setRutas} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mantenimientos" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <Mantenimientos />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reportes" 
                  element={
                    <ProtectedRoute requiredPermissions={['generar_reportes']}>
                      <Reportes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clientes" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <Clientes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/camiones" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <Camiones />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ayudantes" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <Ayudantes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/usuarios" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <Usuarios />
                    </ProtectedRoute>
                  } 
                />

                {/* Ingreso con verificación de permisos */}
                <Route 
                  path="/ingresar-choferes" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <IngresarChoferes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ingresar-ayudante" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <IngresarAyudante />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ingresar-clientes" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <IngresarClientes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ingresar-camiones" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <IngresarCamiones />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ingresar-ruta" 
                  element={
                    <ProtectedRoute requiredPermissions={['crear_rutas']}>
                      <IngresarRuta rutas={rutas} setRutas={setRutas} />
                    </ProtectedRoute>
                  } 
                />

                {/* Edición con verificación de permisos */}
                <Route 
                  path="/editar-choferes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <EditarChoferes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editar-ayudantes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <EditarAyudantes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editar-clientes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <EditarClientes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editar-camiones/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <EditarCamiones />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editar-ruta/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['editar_rutas']}>
                      <EditarRutas rutas={rutas} setRutas={setRutas} />
                    </ProtectedRoute>
                  } 
                />

                {/* Mostrar / Detalles con verificación de permisos */}
                <Route 
                  path="/mostrar-choferes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <VerChoferes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mostrar-ayudante/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <MostrarAyudante />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mostrar-clientes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <MostrarClientes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mostrar-camiones/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <MostrarCamiones />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mostrar-ruta/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['ver_rutas']}>
                      <MostrarRuta rutas={rutas} />
                    </ProtectedRoute>
                  } 
                />

                {/* Alias con verificación de permisos */}
                <Route 
                  path="/ver-ayudantes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <MostrarAyudante />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ver-ruta/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['ver_rutas']}>
                      <MostrarRuta rutas={rutas} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ver-camiones/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <MostrarCamiones />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ver-choferes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <VerChoferes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ver-clientes/:id" 
                  element={
                    <ProtectedRoute requiredPermissions={['gestionar_catalogos']}>
                      <MostrarClientes />
                    </ProtectedRoute>
                  } 
                />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
