import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import authService from "../services/authService.js";
import "../styles/sidebar.css";

export default function Sidebar({ isOpen = false }) {
  const [personalOpen, setPersonalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

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

  // Manejar hover
  const handleMouseEnter = () => {
    if (!pinned) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!pinned) {
      setOpen(false);
    }
  };

  // Manejar click del botón
  const handleToggle = () => {
    setPinned(!pinned);
    setOpen(!pinned);
  };

  return (
    <aside 
      className={`sidebar ${open ? 'open' : 'collapsed'} ${pinned ? 'pinned' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón hamburguesa */}
      <button 
        className="sidebar-toggle"
        onClick={handleToggle}
        title={pinned ? 'Desactivar modo fijo' : 'Activar modo fijo'}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      {/* Header del sidebar con texto */}
      <div className="sidebar-header">
        <div className="sidebar-title" style={{ color: '#ffffff' }}>
          <span className="truck-icon">🚛</span>
          S DE LEON
        </div>
      </div>
      <nav>
        {/* Dashboard - solo para administradores */}
        {isAdmin() && (
          <NavLink to="/admin-dashboard">
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>
        )}
        
        {/* Usuarios - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <NavLink to="/usuarios">
            <span>👥</span>
            <span>Usuarios</span>
          </NavLink>
        )}
        
        {/* Rutas - solo si tiene permisos de rutas */}
        {hasRoutePermission() && (
          <NavLink to="/rutas">
            <span>🛣️</span>
            <span>Rutas</span>
          </NavLink>
        )}
        
        {/* Personal - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <div>
            <button
              className="sidebar-dropdown-btn"
              onClick={() => setPersonalOpen(!personalOpen)}
            >
              <span>👷</span>
              <span>Personal</span>
            </button>
            {personalOpen && (
              <div className="sidebar-dropdown-content">
                <NavLink to="/choferes">
                  <span>🚗</span>
                  <span>Pilotos</span>
                </NavLink>
                <NavLink to="/ayudantes">
                  <span>👨‍💼</span>
                  <span>Ayudantes</span>
                </NavLink>
              </div>
            )}
          </div>
        )}
        
        {/* Clientes - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <NavLink to="/clientes">
            <span>🏢</span>
            <span>Clientes</span>
          </NavLink>
        )}
        
        {/* Camiones - solo si tiene permisos de gestión */}
        {hasManagementPermission() && (
          <NavLink to="/camiones">
            <span>🚛</span>
            <span>Camiones</span>
          </NavLink>
        )}
        
        {/* Reportes - solo si tiene permiso de generar reportes */}
        {hasPermission('generar_reportes') && (
          <NavLink to="/reportes">
            <span>📈</span>
            <span>Reportes</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
