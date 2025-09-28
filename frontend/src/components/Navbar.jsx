import React from "react";
import LogoutButton from "./LogoutButton";
import authService from "../services/authService.js";
import "../styles/navbar.css";

export default function Navbar() {
  const user = authService.getCurrentUser();
  
  return (
    <header className="navbar">
      <div className="user">
        <span className="user-info">
          Usuario {user?.username || 'Usuario'}
        </span>
        <span className="admin-icon">👨‍💼</span>
        <span>Rol: {user?.rol_nombre || 'Sin rol'}</span>
        <LogoutButton>Cerrar sesión</LogoutButton>
      </div>
    </header>
  );
}
