import React from "react";
import { Link, useLocation } from "react-router-dom";
import authService from "../services/authService.js";
import "../styles/piloto-sidebar.css";

export default function PilotoSidebar() {
  const location = useLocation();
  const user = authService.getCurrentUser();

  const menuItems = [
    {
      path: "/piloto-rutas",
      label: "Mis Rutas",
      icon: "🚛",
      description: "Gestionar mis rutas asignadas"
    }
  ];

  return (
    <aside className="piloto-sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">👨‍✈️</div>
          <div className="user-details">
            <h3>{user?.username || 'Piloto'}</h3>
            <span className="user-role">Piloto</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="piloto-permissions">
          <h4>Permisos del Piloto:</h4>
          <ul className="permissions-list">
            <li>✅ Ver mis rutas asignadas</li>
            <li>✅ Cambiar estado de rutas</li>
            <li>✅ Agregar comentarios</li>
            <li>❌ Crear nuevas rutas</li>
            <li>❌ Gestionar otros usuarios</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}




