import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import authService from "../services/authService.js";
import "../styles/piloto-sidebar.css";

export default function PilotoSidebar({ isOpen = false }) {
  const user = authService.getCurrentUser();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

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
      className={`piloto-sidebar ${open ? 'open' : 'collapsed'} ${pinned ? 'pinned' : ''} ${isOpen ? 'mobile-open' : ''}`}
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
      
      {/* Header del sidebar con texto e icono */}
      <div className="sidebar-header">
        <div className="sidebar-title" style={{ color: '#ffffff' }}>
          <span className="truck-icon">👨‍✈️</span>
          S DE LEON
        </div>
      </div>
      
      <nav>
        {/* Solo Mis Rutas - NO todas las rutas */}
        <NavLink to="/piloto-rutas">
          <span>🛣️</span>
          <span>Mis Rutas</span>
        </NavLink>
      </nav>
    </aside>
  );
}
