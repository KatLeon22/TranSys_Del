import React from "react";
import { NavLink } from "react-router-dom";
import authService from "../services/authService.js";
import "../styles/piloto-sidebar.css";

export default function PilotoSidebar() {
  const user = authService.getCurrentUser();
  
  return (
    <aside className="piloto-sidebar">
      {/* Header del sidebar con texto e icono */}
      <div className="sidebar-header">
        <div className="sidebar-title" style={{ color: '#ffffff' }}>
          <span className="truck-icon">👨‍✈️</span>
          S DE LEON
        </div>
      </div>
      
      <nav>
        {/* Solo Mis Rutas - NO todas las rutas */}
        <NavLink to="/piloto-rutas">Mis Rutas</NavLink>
      </nav>
    </aside>
  );
}
