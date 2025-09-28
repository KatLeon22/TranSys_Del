import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import authService from "../services/authService.js";
import "../styles/sidebar.css";

export default function Sidebar({ isOpen = false }) {
  const [personalOpen, setPersonalOpen] = useState(false);

  // Mostrar permisos del usuario
  const userPermissions = authService.getPermissions();
  console.log('🔐 Permisos del usuario en sidebar:', userPermissions);

  // Verificar permisos del usuario
  const hasPermission = (permission) => {
    const result = authService.hasPermission(permission);
    console.log(`🔐 Verificando permiso ${permission}:`, result);
    return result;
  };

  // Verificar si tiene algún permiso de gestión
  const hasManagementPermission = () => {
    return hasPermission('gestionar_catalogos');
  };

  // Verificar si es administrador
  const isAdmin = () => {
    const user = authService.getCurrentUser();
    return user?.rol_nombre === 'administrador';
  };

  // Verificar si tiene permisos de rutas
  const hasRoutePermission = () => {
    return hasPermission('ver_rutas') || hasPermission('crear_rutas') || hasPermission('editar_rutas') || hasPermission('eliminar_rutas');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header del sidebar con texto e icono */}
      <div className="sidebar-header">
        <div className="sidebar-title" style={{ color: '#ffffff' }}>
          <span className="truck-icon">🚚</span>
          S DE LEON
        </div>
      </div>
      <nav>
        {/* Dashboard - solo para administradores */}
        {isAdmin() && (
          <NavLink to="/admin-dashboard">Dashboard</NavLink>
        )}
        
        {/* Usuarios - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <NavLink to="/usuarios">Usuarios</NavLink>
        )}
        
        {/* Rutas - solo si tiene permisos de rutas */}
        {hasRoutePermission() && (
          <NavLink to="/rutas">Rutas</NavLink>
        )}
        
        {/* Personal - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <div>
            <button
              className="sidebar-dropdown-btn"
              onClick={() => setPersonalOpen(!personalOpen)}
            >
              Personal
            </button>
            {personalOpen && (
              <div className="sidebar-dropdown-content">
                <NavLink to="/choferes">Pilotos</NavLink>
                <NavLink to="/ayudantes">Ayudantes</NavLink>
              </div>
            )}
          </div>
        )}
        
        {/* Clientes - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <NavLink to="/clientes">Clientes</NavLink>
        )}
        
        {/* Camiones - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <NavLink to="/camiones">Camiones</NavLink>
        )}
        
        {/* Reportes - solo si tiene permiso de generar reportes */}
        {hasPermission('generar_reportes') && (
          <NavLink to="/reportes">Reportes</NavLink>
        )}
      </nav>
    </aside>
  );
}
