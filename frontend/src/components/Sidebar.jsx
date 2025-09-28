import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [personalOpen, setPersonalOpen] = useState(false);

  return (
    <aside className="sidebar">
      {/* Header del sidebar con texto e icono */}
      <div className="sidebar-header">
        <div className="sidebar-title" style={{ color: '#ffffff' }}>
          <span className="truck-icon">🚚</span>
          S DE LEON
        </div>
      </div>
      <nav>
        
        <NavLink to="/Dashboard">Dashboard</NavLink>
         <NavLink to="/Usuarios">Usuarios</NavLink>
         <NavLink to="/rutas">Rutas</NavLink>
        <div>
          {/* Personal desplegable */}
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
        <NavLink to="/clientes">Clientes</NavLink>
        <NavLink to="/camiones">Camiones</NavLink>
       
        <NavLink to="/reportes">Reportes</NavLink>
      </nav>
    </aside>
  );
}
