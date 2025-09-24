import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/layout.css";

export default function Sidebar() {
  const [personalOpen, setPersonalOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">S DE LEON</div>
      <nav>
        <NavLink to="/Dashboard">Dashboard</NavLink>
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
